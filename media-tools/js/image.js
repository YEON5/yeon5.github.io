const $ = id => document.getElementById(id);
const QUALITY = 0.82;  // JPG·WebP 품질 고정 (Lottie 페이지와 같은 값)
const MAX_FILES = 20;
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const OXIPNG = 'https://cdn.jsdelivr.net/npm/@jsquash/oxipng@2.3.0/codec/pkg/squoosh_oxipng.js';
const mobile = matchMedia('(max-width:599px)');
let items = [], selected = 0, oxipng = null;

const fmt = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const baseName = n => n.replace(/\.[^.]+$/, '');

// PNG 무손실 최적화 엔진(OxiPNG, Squoosh와 동일)은 처음 필요할 때 한 번만 불러옴
function loadOxipng() {
  if (!oxipng) oxipng = import(OXIPNG).then(async m => { await m.default(); return m; });
  return oxipng;
}

function maxWidth() {
  const v = $('resize').value;
  if (v !== 'custom') return +v;
  const w = Math.round(+$('customW').value);
  return w >= 16 ? w : 0;
}

async function compress(item) {
  item.out = null; item.error = null; item.note = '';
  const file = item.file;
  const srcType = file.type;
  if (!TYPES[srcType]) { item.error = '지원하지 않는 형식'; return; }

  let bmp;
  try { bmp = await createImageBitmap(file); } catch (e) { item.error = '이미지를 읽을 수 없음'; return; }

  const limit = maxWidth();
  const resized = limit && bmp.width > limit;
  const w = resized ? limit : bmp.width;
  const h = resized ? Math.round(bmp.height * limit / bmp.width) : bmp.height;
  const outType = $('toWebp').checked ? 'image/webp' : srcType;

  try {
    let blob;
    const colors = +$('pngQ').value; // 0 = 무손실
    if (outType === 'image/png') {
      const m = await loadOxipng();
      let bytes;
      if (colors) { // 색 수 줄이기(UPNG.js) 후 OxiPNG로 한 번 더 무손실 최적화
        const c = new OffscreenCanvas(w, h);
        const g = c.getContext('2d');
        g.drawImage(bmp, 0, 0, w, h);
        const d = g.getImageData(0, 0, w, h);
        const q = UPNG.encode([d.data.buffer], w, h, colors);
        bytes = m.optimise(new Uint8Array(q), 2, false, false);
      } else if (resized) {
        const c = new OffscreenCanvas(w, h);
        const g = c.getContext('2d');
        g.drawImage(bmp, 0, 0, w, h);
        const d = g.getImageData(0, 0, w, h);
        bytes = m.optimise_raw(d.data, w, h, 2, false, false);
      } else {
        bytes = m.optimise(new Uint8Array(await file.arrayBuffer()), 2, false, false); // 원본 픽셀 그대로
      }
      blob = new Blob([bytes], { type: 'image/png' });
    } else {
      const c = new OffscreenCanvas(w, h);
      const g = c.getContext('2d');
      if (outType === 'image/jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); } // JPG는 투명 영역을 흰색으로
      g.drawImage(bmp, 0, 0, w, h);
      blob = await c.convertToBlob({ type: outType, quality: QUALITY });
      if (blob.type !== outType) throw new Error('인코딩 미지원');
    }

    const notes = [];
    if (resized) notes.push(`${bmp.width}×${bmp.height} → ${w}×${h}`);
    if (outType === 'image/png' && colors) notes.push(`${colors}색으로 줄임`);
    // 크기를 줄이지 않았는데 결과가 더 크면 원본 유지
    if (!resized && blob.size >= file.size) {
      item.out = file; item.ext = TYPES[srcType]; item.kept = true;
      notes.push('이미 최적화된 파일이라 원본 유지');
    } else {
      item.out = blob; item.ext = TYPES[outType]; item.kept = false;
      if (outType !== srcType) notes.push('WebP로 변환');
    }
    item.note = notes.join(' · ');
  } catch (e) {
    item.error = '압축 실패: ' + (e.message || '알 수 없는 오류');
  } finally {
    bmp.close();
  }
}

function outName(it) { return baseName(it.file.name) + '.' + it.ext; }

// 목록에 PNG가 있고 WebP 변환이 꺼져 있을 때만 PNG 품질 메뉴 표시
function updatePngMenu() {
  $('pngWrap').hidden = $('toWebp').checked || !items.some(it => it.file.type === 'image/png');
}

async function runAll() {
  updatePngMenu();
  if (!items.length) return;
  $('zipAll').disabled = true;
  for (const it of items) { it.pending = true; }
  render();
  for (const it of items) { await compress(it); it.pending = false; render(); }
  $('zipAll').disabled = !items.some(it => it.out);
  preview();
}

function render() {
  $('rows').innerHTML = items.map((it, i) => {
    const ok = !!it.out;
    let status = '처리 중…';
    if (!it.pending) status = ok ? (it.kept ? '원본 유지' : '완료') : `<span class="fail">압축 실패</span><span class="note">${esc(it.error || '')}</span>`;
    return `<tr data-i="${i}" class="${i === selected ? 'on' : ''}">
      <td>${esc(it.file.name)}${it.note ? `<span class="note">${esc(it.note)}</span>` : ''}</td>
      <td>${fmt(it.file.size)}</td>
      <td>${ok ? fmt(it.out.size) : '-'}</td>
      <td class="good">${ok ? Math.max(0, (1 - it.out.size / it.file.size) * 100).toFixed(1) + '%' : '-'}</td>
      <td>${status}</td>
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
  $('pvName').textContent = '미리보기: ' + it.file.name + ' (가운데 선을 좌우로 움직여 비교)';
  const before = URL.createObjectURL(it.file);
  const after = URL.createObjectURL(it.out || it.file);
  urls.push(before, after);
  $('pvBefore').src = before;
  $('pvAfter').src = after;
}
$('pvPos').oninput = e => $('compare').style.setProperty('--pos', e.target.value + '%');

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
    let name = outName(it);
    if (used[name]) { // 이름이 겹치면 번호 붙이기
      const n = ++used[name];
      name = baseName(name) + ` (${n}).` + it.ext;
    } else used[name] = 1;
    zip.file(name, it.out);
  }
  download(await zip.generateAsync({ type: 'blob' }), 'images-compressed.zip');
};

async function load(fileList) {
  let files = [...fileList];
  if (!files.length) return;
  $('msg').hidden = files.length <= MAX_FILES;
  $('msg').textContent = `한 번에 ${MAX_FILES}개까지 처리할 수 있어요. 앞의 ${MAX_FILES}개만 압축했습니다.`;
  items = files.slice(0, MAX_FILES).map(file => ({ file }));
  selected = 0;
  await runAll();
}

const drop = $('drop');
drop.onclick = () => $('file').click();
$('file').onchange = e => { load(e.target.files); e.target.value = ''; };
drop.ondragover = e => { e.preventDefault(); drop.classList.add('is-dragover'); };
drop.ondragleave = () => drop.classList.remove('is-dragover');
drop.ondrop = e => { e.preventDefault(); drop.classList.remove('is-dragover'); load(e.dataTransfer.files); };

$('toWebp').onchange = runAll;
$('pngQ').onchange = runAll;
$('resize').onchange = () => { $('customWrap').hidden = $('resize').value !== 'custom'; runAll(); };
$('customW').onchange = runAll;

$('rows').onclick = e => {
  const dl = e.target.closest('[data-dl]');
  if (dl) { const it = items[dl.dataset.dl]; download(it.out, outName(it)); return; }
  const row = e.target.closest('tr[data-i]');
  if (row && +row.dataset.i !== selected) { selected = +row.dataset.i; render(); preview(); }
};
