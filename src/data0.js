/* ===== Part constructors ===== */
function N(l, a, s, o){ return Object.assign({t:'num', l:l, a:a, s:(s != null ? s : String(a))}, o || {}); }
function S(l, a, s, o){ return Object.assign({t:'set', l:l, a:a.map(String), s:(s || ('{' + a.join(', ') + '}'))}, o || {}); }
function X(l, acc, s, o){ return Object.assign({t:'str', l:l, a:acc, s:(s || acc[0])}, o || {}); }
function TF(l, b, s){ return {t:'tf', l:l, a:(b ? 'T' : 'F'), s:(s || (b ? 'True' : 'False'))}; }
function CHO(l, opts, i){ return {t:'choice', l:l, opts:opts, a:String(i), s:opts[i]}; }
function O(l, model, ph){ return {t:'open', l:l, s:model, ph:ph}; }
function LG(l, e, vars, s){ return {t:'logic', l:l, a:e, vars:vars, s:(s || e), ph:'VD: ¬p ∧ q'}; }
function FM(l, f, vars, s, ph){
  var at = [];
  for (var i = 0; i < 4; i++){ var env = {}; vars.forEach(function(v, j){ env[v] = 1.37 + i * 2.91 + j * 0.53 + (v === 'S' || v === 'M' ? 4e5 + i * 1234.5 : 0) + (v === 'W' ? 300 + i * 17 : 0) + (v === 'H' ? 41 + i * 3 : 0); }); at.push(env); }
  return {t:'formula', l:l, f:f, at:at, s:s, ph:(ph || 'Nhập công thức')};
}
function MX(l, a, s){ return {t:'matrix', l:l, a:a, s:s, ph:'VD: 1 2; 3 4'}; }
function IMP(l){ return {t:'str', impossible:true, l:l, s:'Không thực hiện được', ph:'Kết quả hoặc "impossible"'}; }
function RT(l, a, s, tol, ph){ return {t:'roots', l:l, a:a, s:s, tol:tol, ph:(ph || 'Các nghiệm, cách nhau bởi dấu phẩy')}; }
function PR(l, a, s){ return {t:'pairs', l:l, a:a, s:(s || a.join(', ')), ph:'(a,b), (c,d), ...'}; }
function FN(l, f, s, ph){ return {t:'fn', l:l, f:f, s:s, ph:ph}; }
function GRID(l, head, rows, o){ return Object.assign({t:'grid', l:l, head:head, rows:rows}, o || {}); }
var TACC = ['t','true','1','đ','đúng','d'], FACC = ['f','false','0','s','sai'];
function TT(l, vars, cols){
  var head = vars.concat(cols.map(function(c){ return c.h; }));
  var rows = TFrows(vars).map(function(env){
    return vars.map(function(v){ return env[v] ? 'T' : 'F'; }).concat(cols.map(function(c){ var v = evalBool(c.e, env); return {a:(v ? TACC : FACC), s:(v ? 'T' : 'F')}; }));
  });
  return GRID(l, head, rows, {tt:true});
}
function B(l, val, base){
  return FN(l, function(raw){
    var c = String(raw).toUpperCase().replace(/[₀-₉]|\(\d+\)|_\d+$/g, '').replace(/\s+/g, '');
    var digits = '0123456789ABCDEF'.slice(0, base);
    if (!c.length || c.split('').some(function(ch){ return digits.indexOf(ch) < 0; })) return {ok:false, msg:'Chỉ dùng các chữ số ' + (base === 16 ? '0-9 và A-F' : '0-' + (base - 1)) + '.'};
    return {ok: parseInt(c, base) === val};
  }, val.toString(base).toUpperCase(), 'Cơ số ' + base);
}
function BIND(l, exp, s){
  return FN(l, function(raw){
    var L = low(raw);
    var isFail = /fail|nomatch|không|khong|cannot|impossible|×|✗/.test(L);
    if (exp === 'fail') return {ok: isFail};
    if (isFail) return {ok:false};
    var map = {};
    L.replace(/π/g, 'pi').split(/[,;]|and|và/).forEach(function(b){ var kv = b.split('='); if (kv.length === 2 && kv[0] !== kv[1]) map[kv[0]] = kv[1]; });
    var ek = Object.keys(exp);
    if (Object.keys(map).length !== ek.length) return {ok:false};
    return {ok: ek.every(function(k){ return [].concat(exp[k]).indexOf(map[k]) >= 0; })};
  }, s, 'VD: X = a, Y = b  hoặc  fail');
}
function NODE(name){ return name; }
function WALK(l, edgesStr, from, to, len, s, mustBePath){
  var E = {}; edgesStr.split(' ').forEach(function(e){ E[ekey(e[0], e[1])] = 1; });
  return FN(l, function(raw){
    var w = parseWalk(raw);
    if (w[0] !== from || w[w.length - 1] !== to) return {ok:false, msg:'Walk phải bắt đầu tại ' + from + ' và kết thúc tại ' + to + '.'};
    if (w.length - 1 !== len) return {ok:false, msg:'Độ dài walk = số cạnh = ' + (w.length - 1) + ', cần ' + len + '.'};
    for (var i = 0; i < w.length - 1; i++) if (!E[ekey(w[i], w[i + 1])]) return {ok:false, msg:'Không có cạnh (' + w[i] + ',' + w[i + 1] + ').'};
    return {ok:true};
  }, s, 'VD: a, f, e');
}
