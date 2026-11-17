const $ = id => document.getElementById(id);
const MAX_FILES = 50;
const SVGO = 'https://cdn.jsdelivr.net/npm/svgo@4.0.1/dist/svgo.browser.js';
const PREVIEW_COLOR = '#1c1b1d'; // 미리보기에서 currentColor를 그릴 글자색
const mobile = matchMedia('(max-width:599px)');
let items = [], selected = 0, svgo = null;

const fmt = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const baseName = n => n.replace(/\.[^.]+$/, '');

// SVGO(브라우저용)는 처음 필요할 때 한 번만 불러옴
function loadSvgo() {
  if (!svgo) svgo = import(SVGO);
  return svgo;
}

function parse(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const root = doc.documentElement;
  if (doc.querySelector('parsererror') || root.localName !== 'svg') throw new Error('SVG를 읽을 수 없음');
  return root;
}

function viewBox(root) {
  const v = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
  return v.length === 4 && v.every(isFinite) ? v : null;
}

// 피그마 clipPath 제거: 아이콘 전체(viewBox)와 같은 사각형 하나로만 자르는 clipPath는 아무것도 잘라내지 않음
function removeFullClips(root) {
  const vb = viewBox(root);
  if (!vb || vb[0] || vb[1]) return;
  const num = (el, a) => +(el.getAttribute(a) || 0);
  root.querySelectorAll('clipPath').forEach(cp => {
    const r = cp.children[0];
    if (cp.children.length !== 1 || r.localName !== 'rect' || cp.hasAttribute('transform') || r.hasAttribute('transform') ||
      cp.getAttribute('clipPathUnits') === 'objectBoundingBox' ||
      num(r, 'x') || num(r, 'y') || num(r, 'width') < vb[2] || num(r, 'height') < vb[3]) return;
    const users = [...root.querySelectorAll('[clip-path]')].filter(el => el.getAttribute('clip-path').replace(/\s/g, '') === `url(#${cp.id})`);
    // 좌표가 바뀐(transform) 요소에 걸린 경우는 안전하게 그대로 둠
    if (users.some(el => { for (let p = el; p && p !== root; p = p.parentElement) if (p.hasAttribute('transform')) return true; })) return;
    users.forEach(el => el.removeAttribute('clip-path'));
    cp.remove();
  });
}

// 색으로 세는 값인지: none·transparent·currentColor·url(...)(그라데이션 등)은 제외
const isColor = v => v && !/^(none|transparent|currentcolor|inherit)$/i.test(v) && !/^url\(/i.test(v);
// clipPath·mask·defs 안은 화면에 칠해지는 색이 아니므로 세지도 바꾸지도 않음
const inDefs = el => !!el.closest('defs, clipPath, mask');
const PAINT = /(^|[;{\s])(fill|stroke)\s*:\s*([^;}!]+)/gi;

// 칠하는 색 모으기, recolor면 currentColor로 바꾸기
function paints(root, recolor) {
  const colors = new Set();
  const take = v => { v = v.trim(); if (isColor(v)) { colors.add(v.toLowerCase()); return true; } };
  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (el.localName === 'style') { // <style> 안의 fill·stroke
      el.textContent = el.textContent.replace(PAINT, (m, a, p, v) => take(v) && recolor ? `${a}${p}:currentColor` : m);
      continue;
    }
    if (inDefs(el)) continue;
    for (const p of ['fill', 'stroke']) {
      if (take(el.getAttribute(p) || '') && recolor) el.setAttribute(p, 'currentColor');
    }
    const st = el.getAttribute('style');
    if (st) {
      const out = st.replace(PAINT, (m, a, p, v) => take(v) && recolor ? `${a}${p}:currentColor` : m);
      if (recolor) el.setAttribute('style', out);
    }
  }
  return [...colors];
}

// 화면에 칠해지는 곳에 그라데이션·패턴(url)이 있는지 → 있으면 다색으로 보고 원본 색 유지
const hasGradient = root => [root, ...root.querySelectorAll('*')].some(el => el.localName === 'style'
  ? /(fill|stroke)\s*:\s*url\(/i.test(el.textContent)
  : !inDefs(el) && /url\(/i.test((el.getAttribute('fill') || '') + (el.getAttribute('stroke') || '') +
    ((el.getAttribute('style') || '').match(/(fill|stroke)\s*:\s*url\(/i) ? 'url(' : '')));

// 색 지정 없이 기본색(검정)으로 칠해지는 아이콘인지
const usesCurrent = root => [root, ...root.querySelectorAll('*')].some(el =>
  /currentcolor/i.test((el.getAttribute('fill') || '') + (el.getAttribute('stroke') || '') + (el.getAttribute('style') || '') +
    (el.localName === 'style' ? el.textContent : '')));

async function compress(item) {
  item.out = null; item.error = null; item.note = '';
  try {
    const { optimize } = await loadSvgo();
    const run = s => optimize(s, { multipass: true, plugins: ['preset-default'] }).data;

    // 1) 피그마 clipPath 제거 후 SVGO로 정리·압축
    let root = parse(item.src);
    removeFullClips(root);
    root = parse(run(new XMLSerializer().serializeToString(root)));

    // 2) 색 판별 → 단색(또는 강제)이면 currentColor
    const colors = paints(root, false);
    item.colors = colors;
    item.grad = hasGradient(root);
    item.mono = colors.length <= 1 && !item.grad;
    if (item.mono || item.force) {
      paints(root, true);
      if (!colors.length && !usesCurrent(root)) root.setAttribute('fill', 'currentColor');
    }

    // 3) 크기: 세로 1em, 가로는 viewBox 비율대로 (정사각형이면 1em × 1em)
    //    viewBox가 없으면 원래 크기로 만들어 둠
    const notes = [];
    if (!viewBox(root)) {
      const w = parseFloat(root.getAttribute('width')), h = parseFloat(root.getAttribute('height'));
      if (w > 0 && h > 0) root.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }
    const vb = viewBox(root);
    if (vb && vb[2] > 0 && vb[3] > 0) {
      const ratio = +(vb[2] / vb[3]).toFixed(3);
      root.setAttribute('width', ratio + 'em');
      root.setAttribute('height', '1em');
      if (ratio !== 1) notes.push(`정사각형 아님: 가로 ${ratio}em × 세로 1em`);
    } else notes.push('viewBox·크기 정보가 없어 크기는 그대로 둠');

    item.text = run(new XMLSerializer().serializeToString(root));
    item.out = new Blob([item.text], { type: 'image/svg+xml' });
    item.note = notes.join(' · ');
  } catch (e) {
    item.error = e.message || '알 수 없는 오류';
  }
}

async function runAll() {
  if (!items.length) return;
  $('zipAll').disabled = true;
  for (const it of items) it.pending = true;
  render();
  for (const it of items) { await compress(it); it.pending = false; render(); }
  $('zipAll').disabled = !items.some(it => it.out);
  preview();
}

function colorCell(it) {
  if (it.pending) return '처리 중…';
  if (!it.out) return `<span class="fail">처리 실패</span><span class="note">${esc(it.error || '')}</span>`;
  const chips = (it.grad ? '<span class="color-chip"><i class="is-grad"></i>그라데이션</span>' : '') +
    it.colors.map(c => `<span class="color-chip"><i style="background:${esc(c)}"></i>${esc(c)}</span>`).join('');
  if (it.mono) return '단색 → currentColor';
  if (it.force) return `다색 → currentColor(강제)<span class="note">${chips}</span>`;
  return `다색 · 원래 색 유지<span class="note">${chips}</span>` +
    `<button class="btn btn-recolor" data-force="${items.indexOf(it)}">currentColor로 바꾸기</button>`;
}

function render() {
  $('rows').innerHTML = items.map((it, i) => {
    const ok = !!it.out;
    const rate = ok ? (1 - it.out.size / it.file.size) * 100 : 0;
    return `<tr data-i="${i}" class="${i === selected ? 'on' : ''}">
      <td>${esc(it.file.name)}${it.note ? `<span class="note">${esc(it.note)}</span>` : ''}</td>
      <td>${fmt(it.file.size)}</td>
      <td>${ok ? fmt(it.out.size) : '-'}</td>
      <td${rate > 0 ? ' class="good"' : ''}>${ok ? rate.toFixed(1) + '%' : '-'}</td>
      <td>${colorCell(it)}</td>
      <td><button class="btn btn-download" data-dl="${i}"${ok ? '' : ' disabled'}>다운로드</button></td>
    </tr>`;
  }).join('');
  $('result').hidden = false;
}

let urls = [];
function preview() {
  urls.forEach(u => URL.revokeObjectURL(u)); urls = [];
  const it = items[selected];
  if (mobile.matches || !it) return; // 모바일은 미리보기 없음
  $('pvName').textContent = '미리보기: ' + it.file.name + (it.out && it.text.includes('currentColor') ? ' (currentColor는 글자색으로 표시)' : '');
  const before = URL.createObjectURL(it.file);
  // 이미지로 그리면 currentColor가 글자색을 못 받으므로 미리보기용으로만 글자색을 넣음
  const after = it.out ? URL.createObjectURL(new Blob([it.text.replace(/currentColor/g, PREVIEW_COLOR)], { type: 'image/svg+xml' })) : before;
  urls.push(before, after);
  $('pvBefore').src = before;
  $('pvAfter').src = after;
}

function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

$('zipAll').onclick = async () => {
  const zip = new JSZip(), used = {};
  for (const it of items) {
    if (!it.out) continue;
    let name = it.file.name;
    if (used[name]) { // 폴더가 달라 이름이 겹치면 번호 붙이기
      const n = ++used[name];
      name = baseName(name) + ` (${n}).svg`;
    } else used[name] = 1;
    zip.file(name, it.out);
  }
  download(await zip.generateAsync({ type: 'blob' }), 'svg-optimized.zip');
};

// 끌어다 놓은 폴더 안의 파일까지 모두 꺼내기
async function filesFrom(dt) {
  const entries = [...dt.items].map(i => i.webkitGetAsEntry && i.webkitGetAsEntry()).filter(Boolean);
  if (!entries.length) return [...dt.files];
  const out = [];
  async function walk(en) {
    if (en.isFile) { out.push(await new Promise((ok, no) => en.file(ok, no))); return; }
    const reader = en.createReader();
    let batch;
    do { // readEntries는 한 번에 일부만 돌려주므로 빈 배열이 올 때까지 반복
      batch = await new Promise((ok, no) => reader.readEntries(ok, no));
      for (const e of batch) await walk(e);
    } while (batch.length);
  }
  for (const en of entries) await walk(en);
  return out;
}

async function load(fileList) {
  const files = [...fileList].filter(f => /\.svg$/i.test(f.name));
  if (!files.length) {
    $('msg').hidden = false;
    $('msg').textContent = 'SVG 파일이 없어요.';
    return;
  }
  $('msg').hidden = files.length <= MAX_FILES;
  $('msg').textContent = `한 번에 ${MAX_FILES}개까지 처리할 수 있어요. 앞의 ${MAX_FILES}개만 처리했습니다.`;
  items = await Promise.all(files.slice(0, MAX_FILES).map(async file => ({ file, src: await file.text() })));
  selected = 0;
  await runAll();
}

const drop = $('drop');
drop.onclick = () => $('file').click();
$('file').onchange = e => { load(e.target.files); e.target.value = ''; };
drop.ondragover = e => { e.preventDefault(); drop.classList.add('is-dragover'); };
drop.ondragleave = () => drop.classList.remove('is-dragover');
drop.ondrop = async e => { e.preventDefault(); drop.classList.remove('is-dragover'); load(await filesFrom(e.dataTransfer)); };

$('rows').onclick = async e => {
  const dl = e.target.closest('[data-dl]');
  if (dl) { const it = items[dl.dataset.dl]; download(it.out, it.file.name); return; }
  const fc = e.target.closest('[data-force]');
  if (fc) { // 다색 파일만 강제로 currentColor
    const i = +fc.dataset.force, it = items[i];
    it.force = true;
    await compress(it);
    selected = i;
    render(); preview();
    return;
  }
  const row = e.target.closest('tr[data-i]');
  if (row && +row.dataset.i !== selected) { selected = +row.dataset.i; render(); preview(); }
};
