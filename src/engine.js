/* ===== Engine: parsers + checkers (pure, testable in node) ===== */
var SUP = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
function normMath(s){
  s = String(s).trim();
  s = s.replace(/[−–]/g,'-').replace(/[×·✕]/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').replace(/√/g,'sqrt ');
  s = s.replace(/([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, function(m){ return '^(' + m.split('').map(function(c){return SUP[c];}).join('') + ')'; });
  return s;
}
var FUNCS = {sqrt:Math.sqrt, sin:Math.sin, cos:Math.cos, tan:Math.tan, ln:Math.log, log:Math.log10, log2:Math.log2, log10:Math.log10, abs:Math.abs, exp:Math.exp};
function tokenize(s){
  var t = [], i = 0, m;
  while (i < s.length){
    var c = s[i];
    if (/\s/.test(c)){ i++; continue; }
    if ((m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i)))){ t.push({k:'n', v:parseFloat(m[1])}); i += m[1].length; continue; }
    if ((m = /^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i)))){ t.push({k:'id', v:m[0]}); i += m[0].length; continue; }
    if ('+-*/^()'.indexOf(c) >= 0){ t.push({k:c}); i++; continue; }
    throw new Error('Ký tự không hợp lệ: ' + c);
  }
  return t;
}
function evalExpr(str, vars){
  vars = vars || {};
  var s = normMath(str);
  /* scientific notation like 4.62e16 or 4.62E-3 */
  s = s.replace(/(\d)\s*[eE]\s*([+-]?\d+)/g, '$1*10^($2)');
  var t = tokenize(s), p = 0;
  function peek(){ return t[p]; }
  function startsAtom(tk){ return tk && (tk.k==='n' || tk.k==='id' || tk.k==='('); }
  function expr(){ var v = term(); while (peek() && (peek().k==='+'||peek().k==='-')){ var o=t[p++].k; var r=term(); v = o==='+'? v+r : v-r; } return v; }
  function term(){ var v = unary(); for(;;){ var tk = peek(); if (tk && (tk.k==='*'||tk.k==='/')){ p++; var r = unary(); v = tk.k==='*'? v*r : v/r; } else if (startsAtom(tk)){ v = v*power(); } else break; } return v; }
  function unary(){ var tk = peek(); if (tk && (tk.k==='-'||tk.k==='+')){ p++; var v = unary(); return tk.k==='-'? -v : v; } return power(); }
  function power(){ var b = atom(); if (peek() && peek().k==='^'){ p++; var e = unary(); return Math.pow(b, e); } return b; }
  function atom(){
    var tk = t[p++];
    if (!tk) throw new Error('Biểu thức chưa đầy đủ');
    if (tk.k==='n') return tk.v;
    if (tk.k==='('){ var v = expr(); if (!peek() || peek().k!==')') throw new Error('Thiếu dấu )'); p++; return v; }
    if (tk.k==='id'){
      var id = tk.v;
      if (id==='pi') return Math.PI;
      if (FUNCS[id]){ var a = (peek() && peek().k==='(') ? atom() : power(); return FUNCS[id](a); }
      if (Object.prototype.hasOwnProperty.call(vars, id)) return vars[id];
      var prod = 1;
      for (var i=0;i<id.length;i++){ var ch = id[i]; if (!Object.prototype.hasOwnProperty.call(vars, ch)) throw new Error('Không hiểu ký hiệu "' + id + '"'); prod *= vars[ch]; }
      return prod;
    }
    throw new Error('Cú pháp chưa đúng');
  }
  var v = expr();
  if (p < t.length) throw new Error('Cú pháp chưa đúng gần "' + (t[p].v || t[p].k) + '"');
  return v;
}
/* Parse a numeric answer typed by a student */
function parseNum(input){
  var s = String(input).trim();
  s = s.replace(/^[a-zA-Z]\s*=\s*/, '').replace(/^[≈~]\s*/, '');
  s = s.replace(/\b(cm|mm|m)[²³]/g,'').replace(/[£$€%°]/g,'').replace(/\b(recurring|rad|radians|degrees|deg|minutes|mins|min|hours|hrs|h|cm|m|kg|people|người|phút|giờ|độ|litres|liters)\b\.?/gi,'').trim();
  s = s.replace(/\.{2,}$/,'').replace(/̇|̅/g,'');
  if (/^-?\d{1,3}([, ]\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/[, ]/g,'');
  var m = /^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(s);
  if (m){ var v = +m[2] + (+m[3])/(+m[4]); return m[1] ? -v : v; }
  s = s.replace(/(\d)\s*[xX]\s*(10)/g, '$1*$2');
  return evalExpr(s, {});
}
function close(a, b, tol){ if (tol == null) tol = 1e-9; return Math.abs(a-b) <= Math.max(tol, 1e-9*Math.abs(b)); }
function low(s){ return String(s).toLowerCase().replace(/[‘’`´]/g,"'").replace(/[“”]/g,'"').replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/′/g,"'"); }
var NONE_RE = /^(none|no|noreal|norealroots?|norealsolutions?|nosolution|vônghiệm|vonghiem|khôngcó|không|empty|∅|\{\}|φ|ø)$/;
var IMPOSSIBLE_RE = /(khôngthựchiện|khongthuchien|impossible|notpossible|undefined|cannot|can't|khôngthể|khongthe|kxđ|n\/a|error|lỗi|#num|#value|không xác định|khôngxácđịnh|notdefined)/;
var INF_RE = /^(∞|inf|infinite|infinity|vôhạn|vohan|ℵ0|ℵ₀|aleph0|countablyinfinite)$/;

function splitList(s){
  s = String(s).trim().replace(/^\{|\}$/g,'').trim();
  if (!s) return [];
  var parts = s.indexOf(',')>=0 ? s.split(',') : (s.indexOf(';')>=0 ? s.split(';') : s.split(/\s+/));
  return parts.map(function(x){ return x.trim().replace(/^['"]|['"]$/g,''); }).filter(function(x){ return x.length; });
}
function parseSet(s){ s = String(s).replace(/\s+(and|và|&)\s+/gi, ', '); var L = low(s); if (NONE_RE.test(L)) return []; return splitList(String(s)).map(function(x){ return low(x); }); }
function sameSet(a, b){
  var A = {}, B = {}; a.forEach(function(x){A[x]=1;}); b.forEach(function(x){B[x]=1;});
  var ka = Object.keys(A), kb = Object.keys(B); if (ka.length !== kb.length) return false;
  return ka.every(function(k){ return B[k]; });
}
function parseTuples(s){
  var out = [], re = /\(([^()]*)\)/g, m;
  while ((m = re.exec(String(s)))) out.push(m[1].split(',').map(function(x){ return low(x); }).join(','));
  return out;
}
function parseNumList(s){
  var L = low(s); if (NONE_RE.test(L)) return [];
  var str = String(s).replace(/[a-zA-Z]\s*=\s*/g,'').replace(/\band\b|\bvà\b|\bor\b/gi, ',').replace(/±/g,'±');
  return str.split(/[,;]/).map(function(x){ return x.trim(); }).filter(Boolean).map(parseNum);
}
function parseMatrix(s){
  var str = String(s).trim();
  var rows;
  if (/[;\n]/.test(str)) rows = str.split(/[;\n]/);
  else if (/\]\s*,?\s*\[/.test(str)) rows = str.split(/\]\s*,?\s*\[/);
  else rows = [str];
  rows = rows.map(function(r){ return r.replace(/[\[\]()]/g,' ').trim(); }).filter(Boolean);
  return rows.map(function(r){ var cells = r.indexOf(',')>=0 ? r.split(',') : r.split(/\s+/); return cells.map(function(c){ return c.trim(); }).filter(Boolean).map(parseNum); });
}
function parseVecList(s){
  var out = [], re = /\(([^()]*)\)/g, m;
  while ((m = re.exec(String(s)))) out.push(m[1].split(',').map(function(x){ return parseNum(x); }));
  return out;
}
/* ---- Boolean logic ---- */
function evalBool(str, env){
  var s = String(str).replace(/<->|<=>|↔|⇔|\biff\b/gi,'↔').replace(/->|=>|⇒|→/g,'→')
    .replace(/\bxor\b|⊕|⊻/gi,'⊕').replace(/\band\b|∧|&&?|\^|\*|·|\./gi,'∧').replace(/\bor\b|∨|\|\|?|\+/gi,'∨').replace(/\bnot\b|¬|~|!/gi,'¬');
  var t = [], i = 0;
  while (i < s.length){
    var c = s[i];
    if (/\s/.test(c)){ i++; continue; }
    if ('∧∨¬→↔⊕()\''.indexOf(c) >= 0 || c === '′'){ t.push(c === '′' ? "'" : c); i++; continue; }
    if (c === 'v' && !('v' in env)){ t.push('∨'); i++; continue; }
    if (/[A-Za-z]/.test(c)){ t.push({v:c}); i++; continue; }
    if (c==='T'||c==='1'){ t.push({c:true}); i++; continue; }
    if (c==='0'){ t.push({c:false}); i++; continue; }
    throw new Error('Ký hiệu không hợp lệ: ' + c);
  }
  var p = 0;
  function pk(){ return t[p]; }
  function iff(){ var a = imp(); while (pk()==='↔'){ p++; var b = imp(); a = (a===b); } return a; }
  function imp(){ var a = or(); if (pk()==='→'){ p++; var b = imp(); return (!a) || b; } return a; }
  function or(){ var a = xor(); while (pk()==='∨'){ p++; var b = xor(); a = a || b; } return a; }
  function xor(){ var a = and(); while (pk()==='⊕'){ p++; var b = and(); a = a !== b; } return a; }
  function and(){ var a = not(); for(;;){ if (pk()==='∧'){ p++; a = not() && a; } else if (pk() && (pk().v || pk()==='(' || pk()==='¬')){ a = not() && a; } else break; } return a; }
  function not(){ if (pk()==='¬'){ p++; return !not(); } var v = prim(); while (pk()==="'"){ p++; v = !v; } return v; }
  function prim(){
    var tk = t[p++];
    if (tk === '('){ var v = iff(); if (t[p] !== ')') throw new Error('Thiếu dấu )'); p++; return v; }
    if (tk && tk.v){ if (!(tk.v in env)) throw new Error('Biến lạ: ' + tk.v); return env[tk.v]; }
    if (tk && 'c' in tk) return tk.c;
    throw new Error('Cú pháp chưa đúng');
  }
  var r = iff(); if (p < t.length) throw new Error('Cú pháp chưa đúng'); return r;
}
function boolEquiv(a, b, vars){
  var n = vars.length;
  for (var m = 0; m < (1<<n); m++){
    var env = {}; vars.forEach(function(v, i){ env[v] = !((m >> (n-1-i)) & 1); });
    if (evalBool(a, env) !== evalBool(b, env)) return false;
  }
  return true;
}
function TFrows(vars){
  var n = vars.length, rows = [];
  for (var m = 0; m < (1<<n); m++){ var env = {}; vars.forEach(function(v, i){ env[v] = !((m >> (n-1-i)) & 1); }); rows.push(env); }
  return rows;
}
/* ---- graph helpers ---- */
function parseEdges(s){
  var out = [], str = String(s).toLowerCase();
  var re = /\(?\s*([a-z0-9]+)\s*[,\- ]\s*([a-z0-9]+)\s*\)?/g, m;
  var chunks = str.split(/[;\n]|\)\s*,?\s*\(|,(?=\s*\()/);
  chunks.forEach(function(ch){ ch = ch.replace(/[(){}]/g,' ').trim(); if (!ch) return;
    var mm = /^([a-z0-9]+)\s*[,\- ]?\s*([a-z0-9]+)$/.exec(ch.replace(/\s+/g,' ').replace(/ ?, ?/,','));
    if (mm) out.push([mm[1], mm[2]]);
    else if (/^[a-z]{2}$/.test(ch)) out.push([ch[0], ch[1]]);
    else { ch.split(/[\s,]+/).forEach(function(tok){ if (/^[a-z]{2}$/.test(tok)) out.push([tok[0], tok[1]]); else if (tok) throw new Error('Không đọc được cạnh "' + tok + '"'); }); }
  });
  return out;
}
function ekey(a, b){ return a < b ? a + b : b + a; }
function connectedCount(verts, edges){
  var parent = {}; verts.forEach(function(v){ parent[v] = v; });
  function f(x){ while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x; }
  var cyc = false;
  edges.forEach(function(e){ var a = f(e[0]), b = f(e[1]); if (a === b) cyc = true; else parent[a] = b; });
  var roots = {}; verts.forEach(function(v){ roots[f(v)] = 1; });
  return {parts: Object.keys(roots).length, cycle: cyc};
}
function parseWalk(s){ return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }

/* ---- main checker ---- */
function checkPart(part, input){
  var raw = (input == null ? '' : String(input));
  if (part.t === 'open') return {ok:null};
  if (!raw.trim()) return {ok:false, empty:true, msg:'Chưa có câu trả lời.'};
  try {
    var L = low(raw);
    if (part.impossible){ return IMPOSSIBLE_RE.test(L) ? {ok:true} : {ok:false, msg:'Hãy kiểm tra lại kích thước (cỡ) của hai ma trận.'}; }
    switch (part.t){
      case 'num': {
        if (part.inf) return {ok: INF_RE.test(L)};
        if (part.err && IMPOSSIBLE_RE.test(L)) return {ok:true};
        if (part.form === 'frac' && !/\//.test(raw)) return {ok:false, msg:'Đề yêu cầu viết dạng phân số (có dấu /).'};
        if (part.form === 'dec' && /\//.test(raw)) return {ok:false, msg:'Đề yêu cầu viết dạng số thập phân.'};
        if (part.form === 'plain' && /[eE^×x*]|10\s*\^/.test(raw.replace(/\.\.\./,''))) return {ok:false, msg:'Hãy viết số đầy đủ, không dùng lũy thừa của 10.'};
        if (part.form === 'sci'){
          var mm = /^\s*(-?\d(?:\.\d+)?)\s*(?:[×x*]\s*10\s*(?:\^\s*\(?\s*([+\-−]?\d+)\s*\)?|([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))|[eE]\s*([+\-]?\d+))\s*$/.exec(raw.replace(/−/g,'-'));
          if (!mm) return {ok:false, msg:'Dạng chuẩn là a × 10^n với 1 ≤ a < 10, ví dụ 3.8762 × 10^2.'};
        }
        if (part.dp != null){ var dps = (raw.trim().split('.')[1] || ''); if (dps.replace(/\D/g,'').length !== part.dp) return {ok:false, msg:'Cần đúng ' + part.dp + ' chữ số sau dấu thập phân.'}; }
        var v = parseNum(raw);
        if (!isFinite(v)) return {ok:false, msg:'Không đọc được số.'};
        return {ok: close(v, part.a, part.tol)};
      }
      case 'str': {
        var acc = (part.a || []).map(low);
        if (acc.indexOf(L) >= 0) return {ok:true};
        if (part.re && part.re.some(function(r){ return new RegExp(r, 'i').test(raw.trim()); })) return {ok:true};
        return {ok:false};
      }
      case 'set': {
        if (part.inf) return {ok: INF_RE.test(L)};
        var got = parseSet(raw), exp = part.a.map(function(x){ return low(x); });
        if (part.numeric){ got = got.map(function(x){ return String(parseNum(x)); }); exp = exp.map(function(x){ return String(parseNum(x)); }); }
        return {ok: sameSet(got, exp), msg: got.length !== exp.length ? ('Bạn liệt kê ' + got.length + ' phần tử, đáp án có ' + exp.length + '.') : null};
      }
      case 'pairs': { var g = parseTuples(raw), e = part.a.map(function(x){ return parseTuples(x)[0]; }); return {ok: sameSet(g, e), msg: g.length !== e.length ? ('Bạn có ' + g.length + ' cặp, cần ' + e.length + ' cặp.') : null}; }
      case 'roots': {
        var r = parseNumList(raw), ex = part.a.slice();
        if (!ex.length) return {ok: r.length === 0 || NONE_RE.test(L) || /noreal|vônghiệm|không có nghiệm thực/.test(L)};
        var uniq = []; r.forEach(function(x){ if (!uniq.some(function(y){ return close(x, y, part.tol); })) uniq.push(x); });
        if (uniq.length !== ex.length) return {ok:false, msg:'Số nghiệm chưa đúng (cần ' + ex.length + ').'};
        return {ok: ex.every(function(x){ return uniq.some(function(y){ return close(x, y, part.tol); }); })};
      }
      case 'vec': {
        var u = parseNumList(raw.replace(/[()\[\]]/g,'')); if (u.length !== part.a.length) return {ok:false, msg:'Cần ' + part.a.length + ' thành phần.'};
        return {ok: part.a.every(function(x, i){ return close(u[i], x, part.tol); })};
      }
      case 'pts': {
        var P = parseVecList(raw); if (P.length !== part.a.length) return {ok:false, msg:'Cần ' + part.a.length + ' điểm theo thứ tự P, Q, R, S.'};
        return {ok: part.a.every(function(pt, i){ return close(P[i][0], pt[0]) && close(P[i][1], pt[1]); })};
      }
      case 'matrix': {
        var M = parseMatrix(raw), E = part.a;
        if (M.length !== E.length || M.some(function(row, i){ return row.length !== E[i].length; })) return {ok:false, msg:'Kích thước chưa đúng: đáp án là ma trận ' + E.length + '×' + E[0].length + '.'};
        return {ok: E.every(function(row, i){ return row.every(function(x, j){ return close(M[i][j], x, 1e-6); }); })};
      }
      case 'logic': {
        var expr = raw.replace(/^.*?(=|≡)\s*/, function(m0){ return /^[^=≡]*[a-z]\s*$/i.test(m0.slice(0,-1).trim()) && m0.trim().length < 4 ? '' : m0; });
        return {ok: boolEquiv(expr, part.a, part.vars)};
      }
      case 'formula': {
        var ex2 = raw.replace(/^\s*[A-Za-z]\s*=\s*/, '');
        var pts = part.at || [];
        for (var k = 0; k < pts.length; k++){ var env = pts[k]; var gv = evalExpr(ex2, env), ev = part.f(env); if (!close(gv, ev, 1e-6)) return {ok:false}; }
        return {ok:true};
      }
      case 'tf': case 'choice': return {ok: String(raw) === String(part.a)};
      case 'fn': return part.f(raw);
      case 'grid': return {ok:null};
    }
  } catch (err){ return {ok:false, msg: err.message || 'Không đọc được câu trả lời.'}; }
  return {ok:false};
}
if (typeof module !== 'undefined') module.exports = {checkPart:checkPart, evalExpr:evalExpr, evalBool:evalBool, boolEquiv:boolEquiv, TFrows:TFrows, parseNum:parseNum, parseEdges:parseEdges, connectedCount:connectedCount, parseWalk:parseWalk, ekey:ekey, low:low};
