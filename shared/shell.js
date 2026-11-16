/* 入口站共用外殼：版本號、操作人、模組卡片 */
(function () {
  'use strict';

  // 與 ISO 表單站共用同一個 origin，沿用同一個鍵，切換一次全部生效
  var USER_KEY = 'iso:user';

  // modules.json 讀取失敗時的最低限度備援，避免整個入口空白
  var FALLBACK = [
    { id: 'iso', name: 'ISO 文件表單', desc: '品質文件與簽核流程。', path: 'https://cceccecasters.github.io/iso-forms-web/', external: true, status: 'live', meta: '10 張表單' },
    { id: 'board', name: '生產進度看板', desc: '派工單進度與交期風險。', path: 'https://cceccecasters.github.io/caster-production-board/', external: true, status: 'live', meta: '即時看板' }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderCards(list) {
    var box = document.getElementById('modules');
    if (!box) return;
    box.textContent = '';

    list.forEach(function (m, i) {
      var live = m.status === 'live' && m.path;
      var card = live ? el('a', 'card') : el('div', 'card is-wip');
      if (live) {
        card.href = m.path;
        card.setAttribute('aria-label', m.name + '（' + m.meta + '）');
      } else {
        card.setAttribute('aria-disabled', 'true');
      }
      card.dataset.id = m.id;

      var top = el('div', 'card-top');
      top.appendChild(el('span', 'card-idx', String(i + 1).padStart(2, '0')));
      top.appendChild(el('span', 'badge ' + (live ? 'badge-live' : 'badge-wip'), live ? '已上線' : '即將推出'));
      card.appendChild(top);

      card.appendChild(el('h2', null, m.name));
      card.appendChild(el('p', null, m.desc));

      var foot = el('div', 'card-foot');
      foot.appendChild(el('span', 'meta', m.meta || ''));
      foot.appendChild(el('span', 'go', live ? '開啟 →' : '未開放'));
      card.appendChild(foot);

      box.appendChild(card);
    });
  }

  function setVersion(v, note) {
    var short = document.getElementById('ver');
    var full = document.getElementById('footer-ver');
    if (short) short.textContent = 'v' + v;
    if (full) full.textContent = '版次 ' + v + (note ? ' · ' + note : '');
  }

  function initOperator() {
    var out = document.getElementById('who-name');
    var btn = document.getElementById('who');
    if (!out || !btn) return;

    function show() {
      var name = (localStorage.getItem(USER_KEY) || '').trim();
      out.textContent = name || '未設定';
      btn.title = name ? '操作人：' + name + '（點擊切換）' : '點擊設定操作人';
    }

    btn.addEventListener('click', function () {
      var cur = (localStorage.getItem(USER_KEY) || '').trim();
      var next = window.prompt('操作人姓名（會套用到所有模組）', cur);
      if (next === null) return;
      next = next.trim();
      if (!next) return;
      localStorage.setItem(USER_KEY, next);
      show();
    });

    show();
  }

  function initToday() {
    var node = document.getElementById('today');
    if (!node) return;
    var d = new Date();
    var opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    node.textContent = new Intl.DateTimeFormat('zh-TW', opts).format(d);
  }

  function boot() {
    initOperator();
    initToday();

    fetch('version.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (v) { if (v && v.v) setVersion(v.v, v.note); })
      .catch(function () { /* 版本號不是關鍵路徑，失敗就維持預設 */ });

    fetch('shared/modules.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('modules.json ' + r.status); return r.json(); })
      .then(function (data) { renderCards((data && data.modules) || FALLBACK); })
      .catch(function () { renderCards(FALLBACK); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
