/* ===== UI ===== */
(function(){
  var KEY = 'math1179-workbook-v1';
  var state = {a:{}, st:{}};
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && saved.a) state = saved; } catch (e) {}
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  var $ = function(sel, root){ return (root || document).querySelector(sel); };
  var $$ = function(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* assign ids */
  var PARTS = {};
  CH.forEach(function(ch){ ch.qs.forEach(function(q, qi){ q.id = 'c' + ch.no + 'q' + qi; q.parts.forEach(function(p, pi){ p.id = q.id + 'p' + pi; PARTS[p.id] = p; }); }); });
  function chParts(ch){ var a = []; ch.qs.forEach(function(q){ a = a.concat(q.parts); }); return a; }
  function chDone(ch){ return chParts(ch).filter(function(p){ return state.st[p.id] === 'ok'; }).length; }

  function cellOk(cell, v){ var L = low(v || ''); if (!L && cell.empty) return true; return cell.a.map(low).indexOf(L) >= 0; }
  function gradePart(p){
    if (p.t === 'grid'){
      var all = true, any = false;
      p.rows.forEach(function(row, r){ row.forEach(function(cell, c){ if (typeof cell === 'string') return; var id = p.id + 'r' + r + 'c' + c; var v = state.a[id] || ''; if (v) any = true; var ok = cellOk(cell, v); setCell(id, ok); if (!ok) all = false; }); });
      return {ok: all, empty: !any};
    }
    if (p.t === 'open') return {ok:null};
    return checkPart(p, state.a[p.id]);
  }
  function setCell(id, ok){ var el = document.getElementById(id); if (el){ el.classList.toggle('is-ok', ok); el.classList.toggle('is-bad', !ok); } }

  /* ---------- render ---------- */
  function partHTML(p){
    var h = '<div class="part t-' + p.t + '" data-pid="' + p.id + '">';
    h += '<div class="prow"><span class="plabel">' + p.l + '</span><span class="pfield">';
    var v = state.a[p.id] || '';
    if (p.t === 'tf' || p.t === 'choice'){
      var opts = p.t === 'tf' ? [['T','True'],['F','False']] : p.opts.map(function(o, i){ return [String(i), o]; });
      h += '<span class="seg" role="radiogroup">' + opts.map(function(o){ return '<button type="button" class="opt' + (v === o[0] ? ' on' : '') + '" data-val="' + o[0] + '" role="radio" aria-checked="' + (v === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span>';
    } else if (p.t === 'open'){
      h += '<textarea id="' + p.id + '" class="ans" rows="2" placeholder="' + esc(p.ph || 'Viết câu trả lời của bạn') + '">' + esc(v) + '</textarea>';
    } else if (p.t === 'grid'){
      h += '<span class="scroll"><table class="grid' + (p.tt ? ' tt' : '') + '"><thead><tr>' + p.head.map(function(x){ return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
      p.rows.forEach(function(row, r){ h += '<tr>' + row.map(function(cell, c){ if (typeof cell === 'string') return '<td class="fix">' + cell + '</td>'; var id = p.id + 'r' + r + 'c' + c; return '<td><input id="' + id + '" class="cell" data-cell="1" autocomplete="off" spellcheck="false" value="' + esc(state.a[id] || '') + '" aria-label="' + esc(p.head[c] + ' hàng ' + (r + 1)) + '"></td>'; }).join('') + '</tr>'; });
      h += '</tbody></table></span>';
    } else {
      var wide = /matrix|pairs|pts|fn|formula|logic|set|roots/.test(p.t) ? ' wide' : '';
      h += '<input id="' + p.id + '" class="ans' + wide + '" autocomplete="off" spellcheck="false" value="' + esc(v) + '" placeholder="' + esc(p.ph || (p.t === 'set' ? '{a, b, c}' : '')) + '">';
    }
    h += '</span><span class="mark" aria-live="polite"></span></div>';
    h += '<div class="pmsg" hidden></div>';
    h += '<div class="pans" hidden><span>Đáp án:</span> ' + (p.t === 'grid' ? '<span class="scroll"><table class="grid mini"><tr>' + p.head.map(function(x){ return '<th>' + x + '</th>'; }).join('') + '</tr>' + p.rows.map(function(row){ return '<tr>' + row.map(function(c){ return '<td>' + (typeof c === 'string' ? c : c.s) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></span>' : esc(p.s)) + (p.t === 'open' ? '<span class="self">Bạn tự chấm: <button type="button" class="sm" data-self="ok">Mình làm đúng</button><button type="button" class="sm" data-self="bad">Chưa đúng</button></span>' : '') + '</div>';
    return h + '</div>';
  }
  function qHTML(ch, q){
    var h = q.sec ? '<h3 class="sec">' + q.sec + '</h3>' : '';
    h += '<section class="q" id="' + q.id + '"><div class="qhead"><span class="qno">' + q.n + '</span><div class="qtext"><p>' + q.p + '</p>' + (q.fig ? '<div class="figs">' + q.fig + '</div>' : '') + '</div></div>';
    h += '<div class="parts">' + q.parts.map(partHTML).join('') + '</div>';
    h += '<div class="qact"><button type="button" class="btn primary" data-act="check">Kiểm tra</button><button type="button" class="btn" data-act="hint" aria-expanded="false">Gợi ý</button><button type="button" class="btn" data-act="sol" aria-expanded="false">Hiện đáp án</button><button type="button" class="btn ghost" data-act="clear">Làm lại</button><span class="qscore"></span></div>';
    h += '<div class="hint" hidden><b>Gợi ý.</b> ' + q.hint + '</div>';
    h += '<div class="sol" hidden>' + (q.sol || '') + '</div>';
    return h + '</section>';
  }
  function tocHTML(cur){
    return '<a href="#intro" class="toc-i' + (cur === 'intro' ? ' cur' : '') + '"' + (cur === 'intro' ? ' aria-current="page"' : '') + '><span class="tn">i</span><span class="tt">Giới thiệu</span><span class="tc"></span></a>' + CH.map(function(ch){ var t = chParts(ch).length, d = chDone(ch); return '<a href="#ch' + ch.no + '" class="toc-i' + (cur === 'ch' + ch.no ? ' cur' : '') + '"' + (cur === 'ch' + ch.no ? ' aria-current="page"' : '') + '><span class="tn">' + ch.no + '</span><span class="tt">' + ch.title + '</span><span class="tp"><i style="width:' + Math.round(100 * d / t) + '%"></i></span><span class="tc">' + d + '/' + t + '</span></a>'; }).join('') + '<a href="#formulae" class="toc-i' + (cur === 'formulae' ? ' cur' : '') + '"><span class="tn">ƒ</span><span class="tt">Formulae</span><span class="tc"></span></a>';
  }
  function updateTotals(){
    var tot = 0, done = 0; CH.forEach(function(ch){ tot += chParts(ch).length; done += chDone(ch); });
    $('#ovbar i').style.width = (100 * done / tot).toFixed(1) + '%';
    $('#ovtxt').textContent = done + ' / ' + tot + ' ý đúng';
    $('#toc').innerHTML = tocHTML(current);
  }
  var current = 'intro';
  function render(){
    var h = (location.hash || '').replace('#', '');
    if (!/^ch(\d+)$|^formulae$|^intro$/.test(h) || (h.indexOf('ch') === 0 && !CH[+h.slice(2) - 1])) h = 'intro';
    current = h;
    var main = $('#main');
    if (h === 'formulae'){ main.innerHTML = FORMULAE; }
    else if (h === 'intro'){ main.innerHTML = INTRO; }
    else {
      var ch = CH[+h.slice(2) - 1];
      var html = '<header class="chhead"><p class="eyebrow">Chapter ' + ch.no + ' · workbook MATH1179</p><h2>' + ch.title + '</h2><p class="vi">' + ch.vi + '</p>' + (ch.intro ? '<p class="intro">' + ch.intro + '</p>' : '') + '</header>';
      html += ch.qs.map(function(q){ return qHTML(ch, q); }).join('');
      var prev = CH[ch.no - 2], next = CH[ch.no];
      html += '<nav class="pager">' + (prev ? '<a class="btn" href="#ch' + prev.no + '">← ' + prev.no + '. ' + prev.title + '</a>' : '<a class="btn" href="#intro">← Giới thiệu</a>') + (next ? '<a class="btn primary" href="#ch' + next.no + '">' + next.no + '. ' + next.title + ' →</a>' : '<a class="btn" href="#formulae">Formulae →</a>') + '</nav>';
      main.innerHTML = html;
      ch.qs.forEach(function(q){ restoreMarks(q); });
    }
    updateTotals();
    window.scrollTo(0, 0);
  }
  function qOf(id){ var m = /^c(\d+)q(\d+)/.exec(id); return CH[+m[1] - 1].qs[+m[2]]; }
  function showMark(p, res){
    var el = document.querySelector('.part[data-pid="' + p.id + '"]'); if (!el) return;
    var mk = $('.mark', el), msg = $('.pmsg', el);
    el.classList.remove('ok', 'bad');
    mk.textContent = '';
    msg.hidden = true;
    if (res == null) return;
    if (res === 'ok' || res.ok === true){ el.classList.add('ok'); mk.textContent = '✓'; mk.setAttribute('aria-label', 'Đúng'); }
    else if (res === 'bad' || res.ok === false){ el.classList.add('bad'); mk.textContent = res.empty ? '·' : '✗'; mk.setAttribute('aria-label', 'Chưa đúng'); if (res.msg){ msg.textContent = res.msg; msg.hidden = false; } }
  }
  function restoreMarks(q){
    q.parts.forEach(function(p){ var s = state.st[p.id]; if (s){ showMark(p, s); if (p.t === 'grid' && s) gradePart(p); } });
    scoreLine(q);
  }
  function scoreLine(q){
    var el = $('#' + q.id + ' .qscore'); if (!el) return;
    var d = q.parts.filter(function(p){ return state.st[p.id] === 'ok'; }).length;
    var tried = q.parts.some(function(p){ return state.st[p.id]; });
    el.textContent = tried ? d + '/' + q.parts.length + ' đúng' : '';
    el.className = 'qscore' + (tried && d === q.parts.length ? ' full' : '');
  }
  function checkQ(q){
    q.parts.forEach(function(p){
      if (p.t === 'open') return;
      var r = gradePart(p);
      if (r.empty){ delete state.st[p.id]; showMark(p, {ok:false, empty:true, msg:'Chưa có câu trả lời.'}); return; }
      state.st[p.id] = r.ok ? 'ok' : 'bad';
      showMark(p, r);
    });
    save(); scoreLine(q); updateTotals();
  }
  function toggle(q, which, btn){
    var sec = $('#' + q.id), box = $('.' + which, sec), open = box.hidden;
    box.hidden = !open; btn.setAttribute('aria-expanded', open);
    if (which === 'sol'){
      btn.textContent = open ? 'Ẩn đáp án' : 'Hiện đáp án';
      $$('.pans', sec).forEach(function(x){ x.hidden = !open; });
      q.parts.forEach(function(p){ if (p.t === 'grid') $$('input[id^="' + p.id + 'r"]', sec).forEach(function(inp){ var m = /r(\d+)c(\d+)$/.exec(inp.id); var cell = p.rows[+m[1]][+m[2]]; inp.setAttribute('placeholder', open ? cell.s : ''); }); });
      sec.classList.toggle('revealed', open);
    }
  }

  /* ---------- events ---------- */
  var lastField = null;
  document.addEventListener('focusin', function(e){ if (e.target.matches('input.ans, input.cell, textarea.ans')) lastField = e.target; });
  document.addEventListener('input', function(e){
    var t = e.target;
    if (t.matches('.ans, .cell')){ state.a[t.id] = t.value; var part = t.closest('.part'); if (part && state.st[part.dataset.pid] && PARTS[part.dataset.pid].t !== 'open'){ delete state.st[part.dataset.pid]; showMark(PARTS[part.dataset.pid], null); if (t.matches('.cell')) t.classList.remove('is-ok', 'is-bad'); scoreLine(qOf(part.dataset.pid)); updateTotals(); } save(); }
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && e.target.matches('input.ans, input.cell')){ e.preventDefault(); var sec = e.target.closest('.q'); if (sec) checkQ(qOf(sec.id)); }
  });
  document.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var sec = b.closest('.q'), q = sec ? qOf(sec.id) : null;
    if (b.classList.contains('opt')){
      var part = b.closest('.part'), pid = part.dataset.pid;
      $$('.opt', part).forEach(function(o){ o.classList.toggle('on', o === b); o.setAttribute('aria-checked', o === b); });
      state.a[pid] = b.dataset.val; delete state.st[pid]; showMark(PARTS[pid], null); save(); scoreLine(q); updateTotals(); return;
    }
    if (b.dataset.self){ var pp = b.closest('.part'); state.st[pp.dataset.pid] = b.dataset.self; showMark(PARTS[pp.dataset.pid], b.dataset.self); save(); scoreLine(q); updateTotals(); return; }
    if (b.dataset.act === 'check') return checkQ(q);
    if (b.dataset.act === 'hint') return toggle(q, 'hint', b);
    if (b.dataset.act === 'sol') return toggle(q, 'sol', b);
    if (b.dataset.act === 'clear'){
      q.parts.forEach(function(p){ delete state.a[p.id]; delete state.st[p.id]; if (p.t === 'grid') Object.keys(state.a).forEach(function(k){ if (k.indexOf(p.id + 'r') === 0) delete state.a[k]; }); });
      save(); var tmp = document.createElement('div'); tmp.innerHTML = qHTML(CH[+q.id.split('q')[0].slice(1) - 1], q); var fresh = tmp.querySelector('.q'); sec.replaceWith(fresh); scoreLine(q); updateTotals(); return;
    }
    if (b.dataset.sym != null){
      var f = lastField; if (!f || !document.body.contains(f)) return;
      var s0 = f.selectionStart != null ? f.selectionStart : f.value.length, s1 = f.selectionEnd != null ? f.selectionEnd : s0;
      f.value = f.value.slice(0, s0) + b.dataset.sym + f.value.slice(s1); f.focus(); var pos = s0 + b.dataset.sym.length; try { f.setSelectionRange(pos, pos); } catch (er) {}
      f.dispatchEvent(new Event('input', {bubbles:true})); return;
    }
    if (b.id === 'reset'){ $('#resetbox').hidden = false; return; }
    if (b.id === 'resetno'){ $('#resetbox').hidden = true; return; }
    if (b.id === 'resetyes'){ state = {a:{}, st:{}}; save(); $('#resetbox').hidden = true; render(); return; }
    if (b.id === 'symtoggle'){ var bar = $('#symbar'); bar.classList.toggle('min'); b.setAttribute('aria-expanded', !bar.classList.contains('min')); return; }
  });
  document.addEventListener('mousedown', function(e){ if (e.target.closest('[data-sym]')) e.preventDefault(); });
  window.addEventListener('hashchange', render);

  var SYMS = ['∪','∩','′','\\','∅','∈','∉','⊆','⊂','×','¬','∧','∨','→','↔','⊕','∀','∃','π','√','²','⁻¹','≥','≤','∞'];
  $('#syms').innerHTML = SYMS.map(function(s){ return '<button type="button" data-sym="' + esc(s) + '" title="Chèn ' + esc(s) + '">' + esc(s) + '</button>'; }).join('');
  render();
})();
