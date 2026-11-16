const $ = id => document.getElementById(id);
const PRECISION = 3;   // 소수점 자릿수 고정
const QUALITY = 0.82;  // WebP 품질 고정 (EasyLottie Balanced 모드와 같은 값)
const MAX_FILES = 20;
const mobile = matchMedia('(max-width:600px)');
let items = [], selected = 0, anims = [];

const fmt = b => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB';
const bytes = s => new Blob([s]).size;
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// base64 이미지를 WebP로 다시 인코딩 (더 작을 때만 교체)
function toWebp(dataUrl, quality) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      const out = c.toDataURL('image/webp', quality);
      // WebP 인코딩 미지원 브라우저(구버전 Safari)는 PNG를 돌려주므로 원본 유지
      resolve(out.startsWith('data:image/webp') && out.length < dataUrl.length ? out : dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// 압축본 검사: 이미지 연결이 끊기지 않았는지 + 처음·중간·마지막 프레임을 실제로 그려봄
function validate(data) {
  if (!Array.isArray(data.layers)) return Promise.resolve('layers 없음');
  if (LottieOptimizer.brokenRefs(data)) return Promise.resolve('끊어진 자산 연결');
  return new Promise(resolve => {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px';
    document.body.appendChild(box);
    let anim, done = false;
    const finish = err => {
      if (done) return; done = true;
      clearTimeout(timer);
      try { anim && anim.destroy(); } catch (e) {}
      box.remove();
      resolve(err);
    };
    const timer = setTimeout(() => finish('불러오기 시간 초과'), 5000);
    try {
      anim = lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: JSON.parse(JSON.stringify(data)) });
      anim.addEventListener('data_failed', () => finish('불러오기 실패'));
      anim.addEventListener('error', () => finish('재생 오류'));
      anim.addEventListener('DOMLoaded', () => {
        try {
          const last = Math.max(0, anim.totalFrames - 1);
          [0, Math.floor(last / 2), last].forEach(f => anim.goToAndStop(f, true));
          finish(null);
        } catch (e) { finish('재생 오류'); }
      });
    } catch (e) { finish('불러오기 실패'); }
  });
}

async function compress(item) {
  item.output = null; item.error = null; item.note = '';
  if (!item.source) { item.error = item.parseError; return; }
  const data = LottieOptimizer.optimizeLottie(item.source, { precision: PRECISION, removeNames: $('removeNames').checked });
  const clean = LottieOptimizer.cleanAssets(data);
  let converted = 0;
  if ($('toWebp').checked) {
    for (const a of LottieOptimizer.embeddedImages(data)) {
      const next = await toWebp(a.p, QUALITY);
      if (next !== a.p) { a.p = next; converted++; }
    }
  }
  const notes = [];
  if (clean.removed) notes.push(`안 쓰는 자산 ${clean.removed}개 삭제`);
  if (clean.merged) notes.push(`중복 이미지 ${clean.merged}개 합침`);
  if (converted) notes.push(`이미지 ${converted}개 WebP 변환`);
  item.note = notes.join(' · ');
  item.error = await validate(data);
  if (!item.error) { item.data = data; item.output = JSON.stringify(data); }
}

async function runAll() {
  if (!items.length) return;
  for (const item of items) await compress(item);
  render();
  preview();
}

function render() {
  $('rows').innerHTML = items.map((it, i) => {
    const ok = !it.error;
    const after = ok ? bytes(it.output) : 0;
    return `<tr data-i="${i}" class="${i === selected ? 'on' : ''}">
      <td>${esc(it.name)}${it.note ? `<span class="note">${it.note}</span>` : ''}</td>
      <td>${fmt(it.size)}</td>
      <td>${ok ? fmt(after) : '-'}</td>
      <td class="good">${ok ? Math.max(0, (1 - after / it.size) * 100).toFixed(1) + '%' : '-'}</td>
      <td>${ok ? '검사 통과' : `<span class="fail">압축 실패</span><span class="note">${esc(it.error)}</span>`}</td>
      <td><button class="btn" data-dl="${i}"${ok ? '' : ' disabled'}>다운로드</button></td>
    </tr>`;
  }).join('');
  $('result').hidden = false;
}

function preview() {
  anims.forEach(x => x.destroy());
  anims = [];
  $('pvBefore').innerHTML = $('pvAfter').innerHTML = '';
  const it = items[selected];
  if (mobile.matches) return; // 모바일은 미리보기 없음
  $('pvName').textContent = it ? '미리보기: ' + it.name : '';
  if (!it || !it.source) return;
  const pairs = [[it.source, 'pvBefore']];
  if (it.data) pairs.push([it.data, 'pvAfter']);
  anims = pairs.map(([d, id]) =>
    lottie.loadAnimation({ container: $(id), renderer: 'svg', loop: true, autoplay: true, animationData: JSON.parse(JSON.stringify(d)) }));
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const item = { name: file.name, size: file.size, source: null };
      try {
        item.source = JSON.parse(reader.result);
        if (!Array.isArray(item.source.layers)) throw 0;
      } catch (e) {
        item.source = null;
        item.parseError = 'Lottie JSON 파일이 아님';
      }
      resolve(item);
    };
    reader.readAsText(file);
  });
}

async function load(fileList) {
  let files = [...fileList];
  if (!files.length) return;
  $('msg').hidden = files.length <= MAX_FILES;
  $('msg').textContent = `한 번에 ${MAX_FILES}개까지 처리할 수 있어요. 앞의 ${MAX_FILES}개만 압축했습니다.`;
  files = files.slice(0, MAX_FILES);
  items = await Promise.all(files.map(readFile));
  selected = 0;
  await runAll();
}

const drop = $('drop');
drop.onclick = () => $('file').click();
$('file').onchange = e => { load(e.target.files); e.target.value = ''; };
drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = e => { e.preventDefault(); drop.classList.remove('over'); load(e.dataTransfer.files); };

['removeNames', 'toWebp'].forEach(id => $(id).onchange = runAll);

$('rows').onclick = e => {
  const dl = e.target.closest('[data-dl]');
  if (dl) {
    const it = items[dl.dataset.dl];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([it.output], { type: 'application/json' }));
    a.download = it.name.replace(/\.json$/i, '') + '.min.json';
    a.click();
    URL.revokeObjectURL(a.href);
    return;
  }
  const row = e.target.closest('tr[data-i]');
  if (row && +row.dataset.i !== selected) { selected = +row.dataset.i; render(); preview(); }
};
