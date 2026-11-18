const $ = id => document.getElementById(id);
// 빠른 계산에 한 번에 보여줄 디자인 폭과 기기 이름 (디자인 폭 선택창과 같은 목록)
const DEVICES = { 360: 'Galaxy S8+', 375: 'iPhone SE', 390: 'iPhone 12 Pro', 768: 'iPad Mini', 820: 'iPad Air', 1024: 'iPad Pro', 1920: 'PC Full HD' };
const WIDTHS = Object.keys(DEVICES).map(Number);
const DIGITS = { px: 2, rem: 1, vw: 3 }; // 단위별 최대 소수점 자릿수

// 반올림 후 끝의 0 제거 (-0은 0으로)
const fmt = (v, unit) => String(+v.toFixed(DIGITS[unit]) || 0);

const base = () => +$('base').value || 10;
function width() {
  const v = $('width').value;
  return v === 'custom' ? (+$('customW').value || 0) : +v;
}

// px을 거쳐서 서로 변환
const toPx = (v, unit, w) => unit === 'rem' ? v * base() : unit === 'vw' ? v * w / 100 : v;
const fromPx = (px, unit, w) => unit === 'rem' ? px / base() : unit === 'vw' ? px / w * 100 : px;

/* 빠른 계산: 값 하나 → 디자인 폭별 px·rem·vw */
function quick() {
  const v = parseFloat($('qVal').value), unit = $('qUnit').value;
  $('qRows').innerHTML = isFinite(v) ? WIDTHS.map(w => {
    const px = toPx(v, unit, w);
    const cell = u => { const s = fmt(fromPx(px, u, w), u) + u; return `<td><button type="button" class="copy-val" data-copy="${s}">${s}</button></td>`; };
    return `<tr><td>${w}px<span class="device">${DEVICES[w]}</span></td>${cell('px')}${cell('rem')}${cell('vw')}</tr>`;
  }).join('') : '';
}

/* CSS 일괄 변환 */
// cap: px → vw일 때 이 화면 폭부터 크기를 고정 (min(vw, 그 폭에서의 px))
function convertCss(text, from, to, w, skip, cap) {
  // 주석(/* */, SCSS의 //)·따옴표·url()은 잠시 빼 두었다가 그대로 되돌림
  const saved = [];
  let t = text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|url\([^)]*\)/gi,
    m => '\u0000' + (saved.push(m) - 1) + '\u0000');
  let count = 0;
  const num = new RegExp(`(^|[^\\w.\\-#])(-?(?:\\d+\\.?\\d*|\\.\\d+))${from}(?![\\w-])`, 'gi');
  const conv = value => value.replace(num, (m, pre, n) => {
    const v = +n;
    if (!v || (from === 'px' && Math.abs(v) <= skip)) return m; // 0, 작은 값은 그대로
    count++;
    const out = fmt(fromPx(toPx(v, from, w), to, w), to) + to;
    // 음수(예: margin -8px)는 작아지는 쪽을 막아야 해서 max()
    return pre + (cap ? `${v < 0 ? 'max' : 'min'}(${out}, ${fmt(v * cap / w, 'px')}px)` : out);
  });
  // { 앞은 선택자·@media 조건이라 그대로, ; 나 } 앞은 선언이라 값(: 뒤)만 변환
  t = t.replace(/([^{};]*)([{};]|$)/g, (m, body, end) => {
    if (end === '{' || !body) return m;
    const i = body.indexOf(':');
    return (i < 0 ? conv(body) : body.slice(0, i + 1) + conv(body.slice(i + 1))) + end;
  });
  t = t.replace(/\u0000(\d+)\u0000/g, (m, i) => saved[i]);
  return { text: t, count };
}

function batch() {
  const [from, to] = $('dir').value.split('-');
  const vw = from === 'vw' || to === 'vw';
  $('baseWrap').hidden = vw;                                   // 기준 폰트 크기는 rem 변환에만
  $('widthWrap').hidden = !vw;                                 // 디자인 폭은 vw 변환에만
  $('customWrap').hidden = !vw || $('width').value !== 'custom';
  $('skipWrap').hidden = from !== 'px';                        // 작은 값 제외는 px에서 바꿀 때만
  const src = $('src').value;
  const w = width();
  if (!src.trim()) { $('out').value = ''; $('count').textContent = ''; return; }
  if (vw && !w) { $('out').value = ''; $('count').textContent = '디자인 폭(width)을 입력하세요'; return; }
  const r = convertCss(src, from, to, w, +$('skip').value);
  $('out').value = r.text;
  $('count').textContent = r.count + '개 변환';
}

/* 반응형 변환: 붙여넣은 시안의 CSS를 그 시안 구간의 미디어쿼리로 */
const RESP_WIDTH = { mob: 375, tab: 768, pc: 1920 }; // 시안을 바꿀 때 기본 디자인 폭
const RESP_NAME = { mob: '모바일', tab: '태블릿', pc: 'PC' };
const respTarget = () => document.querySelector('[name=rTarget]:checked').value;

// 시안 구성에 따른 구간 [시작, 끝] (끝이 0이면 끝없음)
function respRanges() {
  const tab = +$('rTab').value || 0, pc = +$('rPc').value || 0;
  return $('rLayout').value === '3'
    ? { mob: [0, tab - 1], tab: [tab, pc - 1], pc: [pc, 0] }
    : { mob: [0, pc - 1], pc: [pc, 0] };
}
const rangeText = ([a, b]) => (a ? a + 'px' : '') + '~' + (b ? b + 'px' : '');

function resp() {
  const three = $('rLayout').value === '3';
  $('rTabRadio').hidden = !three;
  $('rTabWrap').hidden = !three;
  if (!three && respTarget() === 'tab') { // 태블릿이 없어지면 모바일로
    document.querySelector('[name=rTarget][value=mob]').checked = true;
    $('rWidth').value = RESP_WIDTH.mob;
  }
  const target = respTarget(), ranges = respRanges();
  $('rCapWrap').hidden = target !== 'mob'; // 크기 고정은 모바일에만
  $('rCustomWrap').hidden = $('rWidth').value !== 'custom';
  $('rBar').innerHTML = Object.keys(ranges).map(k =>
    `<div class="range-item${k === target ? ' is-on' : ''}"><b>${rangeText(ranges[k])}</b><span>${RESP_NAME[k]} 시안</span></div>`).join('');

  const src = $('rSrc').value;
  const w = $('rWidth').value === 'custom' ? (+$('rCustomW').value || 0) : +$('rWidth').value;
  if (!src.trim()) { $('rOut').value = ''; $('rCount').textContent = ''; return; }
  if (!w) { $('rOut').value = ''; $('rCount').textContent = '디자인 폭(width)을 입력하세요'; return; }
  const [a, b] = ranges[target];
  const cap = target === 'mob' ? +$('rCap').value || 0 : 0;
  const r = convertCss(src.trim(), 'px', 'vw', w, +$('rSkip').value, cap);
  const query = [a && `(min-width: ${a}px)`, b && `(max-width: ${b}px)`].filter(Boolean).join(' and ');
  const note = `${w} 기준 vw` + (cap ? `, ${cap}px부터 크기 고정` : '');
  $('rOut').value = `/* ${RESP_NAME[target]} (${rangeText([a, b])}) : ${note} */\n@media ${query} {\n` +
    r.text.split('\n').map(l => l.trim() ? '  ' + l : l).join('\n') + '\n}';
  $('rCount').textContent = r.count + '개 변환';
}

function update() {
  quick();
  batch();
  resp();
}

async function copy(text, btn, label) {
  try { await navigator.clipboard.writeText(text); } catch (e) { return; }
  btn.textContent = '복사됨';
  btn.classList.add('is-copied');
  clearTimeout(btn.timer);
  btn.timer = setTimeout(() => { btn.textContent = label; btn.classList.remove('is-copied'); }, 1200);
}

// 기준 폰트 크기: 빠른 계산과 CSS 일괄 변환의 입력칸은 같은 값 (한쪽을 바꾸면 다른 쪽도 바뀜)
['base', 'baseB'].forEach((id, i, ids) => $(id).addEventListener('input', e => { $(ids[1 - i]).value = e.target.value; }));
['base', 'baseB', 'width', 'customW', 'qVal', 'qUnit', 'dir', 'skip', 'src'].forEach(id => $(id).addEventListener('input', update));
$('qRows').onclick = e => {
  const b = e.target.closest('.copy-val');
  if (b) copy(b.dataset.copy, b, b.dataset.copy);
};
$('copyOut').onclick = e => { if ($('out').value) copy($('out').value, e.currentTarget, '변환 결과 복사'); };
['rLayout', 'rWidth', 'rCustomW', 'rTab', 'rPc', 'rCap', 'rSkip', 'rSrc'].forEach(id => $(id).addEventListener('input', resp));
document.querySelectorAll('[name=rTarget]').forEach(r => r.addEventListener('change', () => {
  $('rWidth').value = RESP_WIDTH[respTarget()]; // 시안을 바꾸면 그 시안의 기본 디자인 폭으로
  resp();
}));
$('rCopy').onclick = e => { if ($('rOut').value) copy($('rOut').value, e.currentTarget, '변환 결과 복사'); };
update();
