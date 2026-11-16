/* Front UI 공통 메뉴
 * 각 페이지 <head>에 <script src="/common/js/nav.js"></script> 한 줄만 넣으면 메뉴가 그려집니다.
 * 메뉴 항목은 아래 MENU만 수정하세요.
 *   items 안에 items를 넣으면 접고 펼치는 그룹이 됩니다.
 *   soon: true 는 '준비 중' 표시(링크 없음)입니다.
 * 페이지에 <div data-tabs></div>를 넣으면 현재 섹션의 하위 메뉴가 탭으로 그려집니다.
 */
(function () {
  var MENU = [
    { label: 'Home', icon: 'home', href: '/' },
    {
      label: 'Tools', icon: 'tune', href: '/media-tools/lottie.html',
      items: [
        { label: 'Lottie JSON 압축', href: '/media-tools/lottie.html' },
        { label: '이미지 압축', href: '/media-tools/image.html' }
      ]
    },
    { label: 'Code', icon: 'code', href: '/ui-codeview/' }
  ];

  // Material Symbols (Outlined) 경로. 배열이면 [선, 채움] — rail에서 현재 섹션만 채움 아이콘으로 표시
  var ICONS = {
    home: ['M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z',
           'M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z'],
    tune: 'M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z',
    code: 'M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z',
    menu: 'M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z',
    back: 'm313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z',
    expand: 'M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z'
  };

  // nav.css를 common/css/에서 불러옴 (nav.js 위치 기준)
  // <head>에서 실행될 때는 일반 <link>처럼 넣어서, CSS가 적용되기 전 화면이 먼저 그려지지 않게 함
  var cssHref = new URL('../css/nav.css', document.currentScript.src).href;
  if (document.readyState === 'loading') {
    document.write('<link rel="stylesheet" href="' + cssHref + '">');
    // 자주 쓰는 굵기의 Pretendard를 미리 받아서, 글꼴이 늦게 바뀌며 글줄이 움직이는 현상을 줄임
    ['Regular', 'Medium', 'SemiBold'].forEach(function (w) {
      document.write('<link rel="preload" as="font" type="font/woff2" crossorigin href="' +
        new URL('../font/Pretendard-' + w + '.subset.woff2', cssHref).href + '">');
    });
  } else {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssHref;
    document.head.appendChild(css);
  }

  var mobile = window.matchMedia('(max-width: 599px)');

  function svg(d, cls) {
    return '<svg class="nav-icon' + (cls ? ' ' + cls : '') + '" viewBox="0 -960 960 960" aria-hidden="true"><path d="' + d + '"/></svg>';
  }
  function icon(name) {
    var d = ICONS[name];
    return Array.isArray(d) ? svg(d[0], 'is-line') + svg(d[1], 'is-fill') : svg(d);
  }
  function clean(p) { return p.replace(/index\.html$/, '').replace(/\/$/, '') || '/'; }
  var here = clean(location.pathname);

  function isHere(href) { return href && clean(href) === here; }
  function hasHere(items) {
    return (items || []).some(function (it) { return isHere(it.href) || hasHere(it.items); });
  }
  // 현재 페이지가 속한 섹션
  var current = MENU.filter(function (s) { return isHere(s.href) || hasHere(s.items); })[0];

  function renderItems(items) {
    return items.map(function (it) {
      if (it.items) {
        var open = hasHere(it.items);
        return '<button type="button" class="nav-drawer__group" aria-expanded="' + open + '">' +
          it.label + icon('expand') + '</button>' +
          '<div class="nav-drawer__sub"' + (open ? '' : ' hidden') + '>' + renderItems(it.items) + '</div>';
      }
      if (it.soon) {
        return '<span class="nav-drawer__link is-soon">' + it.label + '<span class="nav-drawer__badge">준비 중</span></span>';
      }
      var active = isHere(it.href);
      return '<a class="nav-drawer__link' + (active ? ' is-active' : '') + '" href="' + it.href + '"' +
        (active ? ' aria-current="page"' : '') + '>' + it.label + '</a>';
    }).join('');
  }

  // 모바일 '메인 메뉴' 목록
  function renderMain() {
    return MENU.map(function (s, i) {
      var active = s === current ? ' is-active' : '';
      if (s.items) {
        return '<button type="button" class="nav-drawer__link' + active + '" data-section="' + i + '">' +
          icon(s.icon) + s.label + '</button>';
      }
      return '<a class="nav-drawer__link' + active + '" href="' + s.href + '">' + icon(s.icon) + s.label + '</a>';
    }).join('');
  }

  function build() {
    var rail = document.createElement('nav');
    rail.className = 'nav-rail';
    rail.setAttribute('aria-label', '메인 메뉴');
    rail.innerHTML = MENU.map(function (s, i) {
      var active = s === current;
      return '<a class="nav-rail__item' + (active ? ' is-active' : '') + '" href="' + s.href + '" data-section="' + i + '"' +
        (active ? ' aria-current="page"' : '') + '>' +
        '<span class="nav-rail__pill">' + icon(s.icon) + '</span>' + s.label + '</a>';
    }).join('');

    var drawer = document.createElement('nav');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('aria-label', '하위 메뉴');

    var topbar = document.createElement('header');
    topbar.className = 'nav-topbar';
    topbar.innerHTML = '<button type="button" class="nav-topbar__menu" aria-label="메뉴 열기">' + icon('menu') + '</button>' +
      '<a class="nav-topbar__title" href="/">Front UI</a>';

    var scrim = document.createElement('div');
    scrim.className = 'nav-scrim';

    document.body.prepend(rail, drawer, topbar, scrim);

    var closeTimer;
    function show(html) {
      drawer.innerHTML = html;
      drawer.classList.add('is-open');
    }
    function close() {
      drawer.classList.remove('is-open');
      scrim.classList.remove('is-open');
      document.body.classList.remove('nav-lock');
      rail.querySelectorAll('.is-hover').forEach(function (el) { el.classList.remove('is-hover'); });
    }
    function showSection(i, withBack) {
      var s = MENU[i];
      show((withBack ? '<button type="button" class="nav-drawer__back">' + icon('back') + '메인 메뉴</button>' : '') +
        renderItems(s.items));
    }

    // PC: rail 아이콘에 마우스를 올리거나 포커스하면 drawer 열기
    function railEnter(e) {
      var a = e.target.closest('.nav-rail__item');
      if (!a || mobile.matches) return;
      clearTimeout(closeTimer);
      rail.querySelectorAll('.is-hover').forEach(function (el) { el.classList.remove('is-hover'); });
      var s = MENU[a.dataset.section];
      if (s.items) {
        a.classList.add('is-hover');
        showSection(a.dataset.section, false);
      } else {
        close();
      }
    }
    rail.addEventListener('mouseover', railEnter);
    rail.addEventListener('focusin', railEnter);

    // rail + drawer 영역을 벗어나면 닫기 (이동 중 깜빡임 방지용 짧은 지연)
    function leave() {
      if (mobile.matches) return;
      closeTimer = setTimeout(close, 150);
    }
    [rail, drawer].forEach(function (el) {
      el.addEventListener('mouseleave', leave);
      el.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    });
    document.addEventListener('focusin', function (e) {
      if (!mobile.matches && !rail.contains(e.target) && !drawer.contains(e.target)) close();
    });

    // drawer 안: 그룹 접기·펼치기, 모바일 메인 메뉴 ↔ 하위 메뉴
    drawer.addEventListener('click', function (e) {
      var group = e.target.closest('.nav-drawer__group');
      if (group) {
        var open = group.getAttribute('aria-expanded') !== 'true';
        group.setAttribute('aria-expanded', open);
        group.nextElementSibling.hidden = !open;
        return;
      }
      if (e.target.closest('.nav-drawer__back')) { show(renderMain()); return; }
      var sec = e.target.closest('[data-section]');
      if (sec) showSection(sec.dataset.section, true);
    });

    // 모바일: ☰ → 현재 섹션 하위 메뉴(없으면 메인 메뉴)
    topbar.querySelector('.nav-topbar__menu').addEventListener('click', function () {
      if (current && current.items) showSection(MENU.indexOf(current), true);
      else show(renderMain());
      scrim.classList.add('is-open');
      document.body.classList.add('nav-lock');
    });
    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    mobile.addEventListener('change', close);

    // 페이지 탭: 현재 섹션 하위 메뉴(링크 항목)를 탭으로 표시
    var tabs = document.querySelector('[data-tabs]');
    if (tabs && current && current.items) {
      tabs.className = 'page-tabs';
      tabs.innerHTML = '<nav class="page-tabs__track" aria-label="' + current.label + ' 탭">' +
        current.items.filter(function (it) { return it.href; }).map(function (it) {
          var active = isHere(it.href);
          return '<a class="page-tab' + (active ? ' is-active' : '') + '" href="' + it.href + '"' +
            (active ? ' aria-current="page"' : '') + '><span>' + it.label + '</span></a>';
        }).join('') + '</nav>';

      // PC: 상단에 붙었는지 감지 (탭 바로 위의 1px 기준점이 화면 밖으로 나가면 고정 상태)
      var mark = document.createElement('div');
      mark.style.height = '1px';
      tabs.before(mark);
      new IntersectionObserver(function (en) {
        tabs.classList.toggle('is-stuck', !en[0].isIntersecting && en[0].boundingClientRect.top < 0);
      }).observe(mark);

      // PC: 다른 탭을 누르면 표시 배경이 옮겨가는 모션(0.2초)을 보여준 뒤 페이지 이동 (m3와 동일한 모션)
      tabs.addEventListener('click', function (e) {
        var t = e.target.closest('.page-tab');
        if (!t || t.classList.contains('is-active') || mobile.matches || e.ctrlKey || e.metaKey || e.shiftKey) return;
        e.preventDefault();
        tabs.querySelector('.page-tab.is-active').classList.remove('is-active');
        t.classList.add('is-active');
        setTimeout(function () { location.href = t.href; }, 200);
      });

      // 다 그려진 다음 프레임부터 모션 적용
      requestAnimationFrame(function () { requestAnimationFrame(function () { tabs.classList.add('is-ready'); }); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
