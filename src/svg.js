/* ===== SVG helpers for worked solutions (pure string builders) ===== */
var G = (function(){
  function fmt(n){ return Math.round(n*100)/100; }
  function niceStep(span){ var raw = span/8, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw/p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
  function plot(o){
    var W = o.w || 360, H = o.h || 240, pad = 30;
    var x0 = o.xr[0], x1 = o.xr[1], y0 = o.yr[0], y1 = o.yr[1];
    function X(x){ return pad + (x - x0) / (x1 - x0) * (W - pad - 10); }
    function Y(y){ return H - pad - (y - y0) / (y1 - y0) * (H - pad - 10); }
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Đồ thị') + '">';
    var sx = o.xs || niceStep(x1 - x0), sy = o.ys || niceStep(y1 - y0);
    for (var gx = Math.ceil(x0/sx)*sx; gx <= x1 + 1e-9; gx += sx){ s += '<line class="g" x1="' + X(gx) + '" y1="' + Y(y0) + '" x2="' + X(gx) + '" y2="' + Y(y1) + '"/>'; s += '<text class="tk" x="' + X(gx) + '" y="' + (H - pad + 13) + '" text-anchor="middle">' + (o.xfmt ? o.xfmt(gx) : fmt(gx)) + '</text>'; }
    for (var gy = Math.ceil(y0/sy)*sy; gy <= y1 + 1e-9; gy += sy){ s += '<line class="g" x1="' + X(x0) + '" y1="' + Y(gy) + '" x2="' + X(x1) + '" y2="' + Y(gy) + '"/>'; s += '<text class="tk" x="' + (pad - 4) + '" y="' + (Y(gy) + 3) + '" text-anchor="end">' + fmt(gy) + '</text>'; }
    if (x0 <= 0 && x1 >= 0) s += '<line class="ax" x1="' + X(0) + '" y1="' + Y(y0) + '" x2="' + X(0) + '" y2="' + Y(y1) + '"/>';
    if (y0 <= 0 && y1 >= 0) s += '<line class="ax" x1="' + X(x0) + '" y1="' + Y(0) + '" x2="' + X(x1) + '" y2="' + Y(0) + '"/>';
    (o.polys || []).forEach(function(pg, i){ s += '<polygon class="poly c' + (pg.c != null ? pg.c : i) + '" points="' + pg.p.map(function(q){ return X(q[0]) + ',' + Y(q[1]); }).join(' ') + '"/>'; if (pg.t) s += '<text class="lbl c' + (pg.c != null ? pg.c : i) + 't" x="' + X(pg.p[0][0]) + '" y="' + (Y(pg.p[0][1]) + 13) + '">' + pg.t + '</text>'; });
    (o.bars || []).forEach(function(b){ var bw = (W - pad - 10) / (x1 - x0) * (b.w || 1) * 0.92; s += '<rect class="bar" x="' + (X(b.x) - bw/2) + '" y="' + Y(b.y) + '" width="' + bw + '" height="' + (Y(0) - Y(b.y)) + '"/>'; });
    (o.fns || []).forEach(function(fn, i){
      var d = '', pen = false, n = 240;
      for (var k = 0; k <= n; k++){ var x = x0 + (x1 - x0) * k / n, y = fn.f(x);
        if (!isFinite(y) || y < y0 - (y1-y0) || y > y1 + (y1-y0)){ pen = false; continue; }
        var yy = Math.max(y0 - (y1-y0)*0.05, Math.min(y1 + (y1-y0)*0.05, y));
        d += (pen ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(yy).toFixed(1); pen = true; }
      s += '<path class="fn c' + (fn.c != null ? fn.c : i) + '" d="' + d + '"/>';
    });
    (o.lines || []).forEach(function(ln, i){ s += '<polyline class="fn c' + (ln.c != null ? ln.c : i) + '" points="' + ln.p.map(function(q){ return X(q[0]) + ',' + Y(q[1]); }).join(' ') + '"/>'; if (ln.dots) ln.p.forEach(function(q){ s += '<circle class="dot c' + (ln.c != null ? ln.c : i) + 'f" cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="2.8"/>'; }); });
    (o.pts || []).forEach(function(q){ s += '<circle class="dot c0f" cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="3.2"/>'; });
    if (o.xl) s += '<text class="tk" x="' + (W - 10) + '" y="' + (H - 4) + '" text-anchor="end">' + o.xl + '</text>';
    if (o.yl) s += '<text class="tk" x="4" y="10">' + o.yl + '</text>';
    return s + '</svg>';
  }
  function legend(items){ return '<div class="legend">' + items.map(function(t, i){ return '<span><i class="sw c' + i + 'f"></i>' + t + '</span>'; }).join('') + '</div>'; }
  function bars(labels, vals, o){
    o = o || {}; var W = 360, H = 220, pad = 30, n = labels.length, max = o.max || Math.max.apply(null, vals) * 1.15;
    var bw = (W - pad - 10) / n, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Biểu đồ cột">';
    var st = niceStep(max);
    for (var g = 0; g <= max; g += st){ var y = H - pad - g / max * (H - pad - 10); s += '<line class="g" x1="' + pad + '" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '"/><text class="tk" x="' + (pad - 4) + '" y="' + (y + 3) + '" text-anchor="end">' + fmt(g) + '</text>'; }
    vals.forEach(function(v, i){ var h = v / max * (H - pad - 10), x = pad + i * bw + bw * 0.15; s += '<rect class="bar" x="' + x + '" y="' + (H - pad - h) + '" width="' + (bw * 0.7) + '" height="' + h + '"/><text class="tk" x="' + (x + bw * 0.35) + '" y="' + (H - pad + 13) + '" text-anchor="middle">' + labels[i] + '</text><text class="vl" x="' + (x + bw * 0.35) + '" y="' + (H - pad - h - 4) + '" text-anchor="middle">' + v + '</text>'; });
    return s + '<line class="ax" x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - 10) + '" y2="' + (H - pad) + '"/></svg>';
  }
  function pie(labels, vals){
    var W = 360, H = 220, cx = 110, cy = 110, r = 95, tot = vals.reduce(function(a, b){ return a + b; }, 0), a0 = -Math.PI/2, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Biểu đồ tròn">';
    vals.forEach(function(v, i){ var a1 = a0 + v / tot * 2 * Math.PI, large = (a1 - a0) > Math.PI ? 1 : 0;
      s += '<path class="slice c' + i + 'f" d="M' + cx + ' ' + cy + ' L' + (cx + r*Math.cos(a0)) + ' ' + (cy + r*Math.sin(a0)) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + (cx + r*Math.cos(a1)) + ' ' + (cy + r*Math.sin(a1)) + ' Z"/>';
      s += '<rect class="c' + i + 'f" x="225" y="' + (22 + i * 24) + '" width="11" height="11" rx="2"/><text class="tk2" x="242" y="' + (32 + i * 24) + '">' + labels[i] + ' ' + fmt(v / tot * 100) + '%</text>';
      a0 = a1; });
    return s + '</svg>';
  }
  function graph(nodes, edges, o){
    o = o || {}; var W = o.w || 300, H = o.h || 220, hl = {}; (o.hl || []).forEach(function(k){ hl[k] = 1; });
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Đồ thị">';
    edges.forEach(function(e){ var a = nodes[e[0]], b = nodes[e[1]], k = e[0] < e[1] ? e[0] + e[1] : e[1] + e[0];
      s += '<line class="edge' + (hl[k] ? ' hl' : (o.hl ? ' dim' : '')) + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      if (e[2] != null) s += '<text class="ew" x="' + ((a[0] + b[0]) / 2 + 4) + '" y="' + ((a[1] + b[1]) / 2 - 4) + '">' + e[2] + '</text>'; });
    Object.keys(nodes).forEach(function(k){ var p = nodes[k]; s += '<circle class="node" cx="' + p[0] + '" cy="' + p[1] + '" r="12"/><text class="nl" x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle">' + k + '</text>'; });
    return s + '</svg>';
  }
  function tree(t, root, o){
    o = o || {}; var pos = {}, depth = 0, order = 0;
    (function walk(n, d){ if (n == null) return; walk(t[n][0], d + 1); pos[n] = [order++, d]; depth = Math.max(depth, d); walk(t[n][1], d + 1); })(root, 0);
    var W = Math.max(300, order * (o.gap || 46) + 20), H = (depth + 1) * 54 + 16, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cây nhị phân">';
    function P(n){ return [20 + pos[n][0] * (W - 40) / Math.max(1, order - 1), 24 + pos[n][1] * 54]; }
    Object.keys(t).forEach(function(n){ t[n].forEach(function(c){ if (c != null){ var a = P(n), b = P(c); s += '<line class="edge" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; } }); });
    Object.keys(t).forEach(function(n){ var p = P(n), wd = Math.max(26, String(n).length * 7 + 12); s += '<rect class="node" x="' + (p[0] - wd/2) + '" y="' + (p[1] - 11) + '" width="' + wd + '" height="22" rx="11"/><text class="nl" x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle">' + n + '</text>'; });
    return '<div class="scroll">' + s + '</svg></div>';
  }
  function venn(region){
    var id = 'v' + Math.random().toString(36).slice(2, 7);
    var s = '<svg class="plot venn" viewBox="0 0 260 150" role="img" aria-label="Biểu đồ Venn"><defs><clipPath id="' + id + 'a"><circle cx="105" cy="78" r="48"/></clipPath><clipPath id="' + id + 'b"><circle cx="155" cy="78" r="48"/></clipPath></defs>';
    s += '<rect class="uni" x="6" y="6" width="248" height="138" rx="4"/>';
    if (region === 'B') s += '<circle class="shade" cx="155" cy="78" r="48"/>';
    if (region === 'AuB') s += '<circle class="shade" cx="105" cy="78" r="48"/><circle class="shade" cx="155" cy="78" r="48"/>';
    if (region === 'AnB') s += '<circle class="shade" cx="155" cy="78" r="48" clip-path="url(#' + id + 'a)"/>';
    s += '<circle class="ring" cx="105" cy="78" r="48"/><circle class="ring" cx="155" cy="78" r="48"/><text class="nl" x="70" y="34">A</text><text class="nl" x="186" y="34">B</text><text class="tk" x="14" y="20">U</text>';
    return s + '</svg>';
  }
  return {plot:plot, legend:legend, bars:bars, pie:pie, graph:graph, tree:tree, venn:venn};
})();
if (typeof module !== 'undefined') module.exports.G = G;
