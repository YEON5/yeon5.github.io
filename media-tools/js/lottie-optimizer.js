// Lottie JSON 용량 최적화 로직 (브라우저 / Node 공용)
(function (root) {
  // 재생에 필요 없는 에디터/메타 키
  const EDITOR_KEYS = ['mn', 'cix', 'np'];

  function roundNumbers(node, factor) {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = roundNumbers(node[i], factor);
      return node;
    }
    if (node && typeof node === 'object') {
      for (const k in node) node[k] = roundNumbers(node[k], factor);
      return node;
    }
    if (typeof node === 'number' && !Number.isInteger(node)) {
      return Math.round(node * factor) / factor;
    }
    return node;
  }

  function stripKeys(node, keys) {
    if (Array.isArray(node)) { node.forEach(n => stripKeys(n, keys)); return; }
    if (node && typeof node === 'object') {
      for (const k of keys) delete node[k];
      for (const k in node) stripKeys(node[k], keys);
    }
  }

  // opts: { precision, removeNames, removeMeta }
  function optimizeLottie(json, opts) {
    const o = Object.assign({ precision: 3, removeNames: false, removeMeta: true }, opts);
    const data = JSON.parse(JSON.stringify(json));
    const keys = EDITOR_KEYS.slice();
    if (o.removeNames) keys.push('nm'); // 레이어 이름 기반 제어(텍스트 교체 등)를 쓰면 끄기
    stripKeys(data, keys);
    if (o.removeMeta) delete data.meta;
    roundNumbers(data, Math.pow(10, o.precision));
    return data;
  }

  // 임베드된 base64 이미지 목록 (WebP 변환은 페이지에서 canvas로 처리)
  function embeddedImages(json) {
    return (json.assets || []).filter(a => typeof a.p === 'string' && a.p.startsWith('data:image/'));
  }

  // node 안의 모든 refId 값 수집
  function collectRefIds(node, out) {
    if (Array.isArray(node)) { node.forEach(n => collectRefIds(n, out)); return out; }
    if (node && typeof node === 'object') {
      for (const k in node) {
        if (k === 'refId' && typeof node[k] === 'string') out.add(node[k]);
        else collectRefIds(node[k], out);
      }
    }
    return out;
  }

  function replaceRefIds(node, map) {
    if (Array.isArray(node)) { node.forEach(n => replaceRefIds(n, map)); return; }
    if (node && typeof node === 'object') {
      for (const k in node) {
        if (k === 'refId' && map[node[k]]) node[k] = map[node[k]];
        else replaceRefIds(node[k], map);
      }
    }
  }

  // 내용이 같은 이미지는 하나로 합치고, 어디서도 쓰지 않는 자산은 삭제 (data를 직접 수정)
  function cleanAssets(data) {
    const assets = data.assets || [];
    const isImage = a => typeof a.p === 'string' && !a.layers;

    // 1) 중복 이미지 합치기
    const seen = {}, map = {};
    for (const a of assets) {
      if (!isImage(a)) continue;
      const key = (a.u || '') + '|' + a.p;
      if (seen[key]) map[a.id] = seen[key];
      else seen[key] = a.id;
    }
    const merged = Object.keys(map).length;
    if (merged) replaceRefIds(data, map);

    // 2) 루트 레이어(와 글꼴 등 자산 밖의 데이터)에서 출발해 실제로 연결된 자산만 남김
    const byId = {};
    assets.forEach(a => { byId[a.id] = a; });
    const rest = Object.assign({}, data);
    delete rest.assets;
    const used = new Set();
    const queue = [...collectRefIds(rest, new Set())];
    while (queue.length) {
      const id = queue.pop();
      if (used.has(id)) continue;
      used.add(id);
      if (byId[id]) collectRefIds(byId[id], new Set()).forEach(r => queue.push(r));
    }
    const before = assets.length;
    if (data.assets) data.assets = assets.filter(a => used.has(a.id));
    return { merged, removed: before - (data.assets || []).length - merged };
  }

  // 모든 refId가 실제 자산을 가리키는지 확인 (끊어진 연결 수 반환)
  function brokenRefs(data) {
    const ids = new Set((data.assets || []).map(a => a.id));
    return [...collectRefIds(data, new Set())].filter(id => !ids.has(id)).length;
  }

  const api = { optimizeLottie, embeddedImages, cleanAssets, brokenRefs };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LottieOptimizer = api;
})(this);
