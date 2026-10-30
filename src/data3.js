/* ================= 9: GRAPH THEORY ================= */
var G1E = 'ab ae af bc bf ce de ef';
var G1N = {a:[40,40], b:[150,28], c:[262,60], d:[262,186], e:[150,170], f:[50,160]};
var G1L = G1E.split(' ').map(function(e){ return [e[0], e[1]]; });
function inG1(e){ return G1E.split(' ').indexOf(ekey(e[0], e[1])) >= 0; }
function spanCheck(verts, edgeSetStr, weights, minW){
  return function(raw){
    var E = parseEdges(raw);
    if (!E.length) return {ok:false, msg:'Nhập các cạnh, ví dụ ab, bc, ...'};
    var allowed = edgeSetStr.split(' ');
    for (var i = 0; i < E.length; i++) if (allowed.indexOf(ekey(E[i][0], E[i][1])) < 0) return {ok:false, msg:'Cạnh ' + E[i].join('') + ' không có trong đồ thị.'};
    if (E.length !== verts.length - 1) return {ok:false, msg:'Cây khung trên ' + verts.length + ' đỉnh có đúng ' + (verts.length - 1) + ' cạnh.'};
    var cc = connectedCount(verts, E);
    if (cc.cycle || cc.parts !== 1) return {ok:false, msg:'Tập cạnh này có chu trình hoặc không nối hết các đỉnh.'};
    if (weights){ var w = E.reduce(function(s, e){ return s + weights[ekey(e[0], e[1])]; }, 0); if (w !== minW) return {ok:false, msg:'Đây là cây khung, nhưng tổng trọng số là ' + w + ', chưa nhỏ nhất.'}; }
    return {ok:true};
  };
}
var W7 = {ab:9, bc:4, ac:11, af:8, be:7, ce:3, cd:2, ef:5, de:4};
var W8 = {ab:52, ac:37, ad:16, bc:23, bd:12, be:15, ce:10, de:12};
function noneCell(v){ return v == null ? {a:['-','none','null','x','—','∅','no','không'], s:'-', empty:true} : {a:[String(v)], s:String(v)}; }
function bstRows(t, order){ return order.map(function(n){ return [String(n), noneCell(t[n][0]), noneCell(t[n][1])]; }); }
var T9 = {23:[15,43], 43:[37,46], 15:[12,18], 37:[25,null], 25:[null,null], 46:[null,67], 67:[null,null], 12:[null,null], 18:[null,null]};
var T10 = {find:['a','search'], a:[null,'binary'], binary:['as',null], search:['for','tree'], tree:['the','words'], 'for':[null,'in'], the:['sentence','this'], words:['use',null], 'in':[null,'root'], 'this':[null,null], sentence:[null,null], use:[null,null], as:[null,null], root:[null,null]};

CH.push({no:9, title:'Graph Theory and Networks', vi:'Lý thuyết đồ thị và mạng', intro:'Walk nhập dãy đỉnh như a, f, e. Tập cạnh nhập như ab, bc, ce hoặc (a,b), (b,c).', qs:[
{n:1, p:'Draw the graph with vertices a, b, c, d, e, f and edges (a,b), (a,e), (a,f), (b,c), (b,f), (c,e), (d,e), (e,f). Find one walk of length 2 and two walks of length 3 from a to e. Are any of these paths? Find a cycle.', fig: G.graph(G1N, G1L), hint:'Độ dài walk = số cạnh đi qua. Path không lặp đỉnh. Cycle là walk khép kín, không lặp đỉnh (trừ điểm đầu/cuối), có ít nhất 3 cạnh.',
 parts:[WALK('Walk of length 2 (a to e)', G1E, 'a', 'e', 2, 'a, f, e'), WALK('Walk of length 3 (a to e)', G1E, 'a', 'e', 3, 'a, b, c, e'), WALK('Another walk of length 3', G1E, 'a', 'e', 3, 'a, b, f, e'), O('Are any of these paths?', 'a-f-e, a-b-c-e và a-b-f-e đều là path vì không đỉnh nào lặp lại. Walk như a-e-a-e có độ dài 3 nhưng không phải path.'),
  FN('A cycle', function(raw){ var w = parseWalk(raw); if (w.length < 4 || w[0] !== w[w.length - 1]) return {ok:false, msg:'Cycle phải quay về đỉnh xuất phát và có ít nhất 3 cạnh, ví dụ a, b, f, a.'}; var inner = w.slice(0, -1); if (inner.some(function(v, i){ return inner.indexOf(v) !== i; })) return {ok:false, msg:'Cycle không được lặp đỉnh.'}; for (var i = 0; i < w.length - 1; i++) if (!inG1([w[i], w[i + 1]])) return {ok:false, msg:'Không có cạnh ' + w[i] + w[i + 1] + '.'}; return {ok:true}; }, 'a, b, f, a', 'VD: a, b, f, a')]},
{n:2, p:'Draw a graph which has 6 vertices, is not connected and has a cycle of length 4. Enter its edges using vertices a to f (isolated vertices need not be listed).', hint:'Một hình vuông a-b-c-d-a, còn e và f đứng riêng là đủ.',
 parts:[FN('Edges', function(raw){ var E = parseEdges(raw), V = 'abcdef'.split(''); if (E.some(function(e){ return V.indexOf(e[0]) < 0 || V.indexOf(e[1]) < 0 || e[0] === e[1]; })) return {ok:false, msg:'Chỉ dùng các đỉnh a đến f, không dùng khuyên.'}; if (connectedCount(V, E).parts < 2) return {ok:false, msg:'Đồ thị này liên thông, cần tách rời.'}; var S = {}; E.forEach(function(e){ S[ekey(e[0], e[1])] = 1; }); function h(x, y){ return S[ekey(x, y)]; } for (var i = 0; i < 6; i++) for (var j = 0; j < 6; j++) for (var k = 0; k < 6; k++) for (var l = 0; l < 6; l++){ var q = [V[i], V[j], V[k], V[l]]; if (i === j || i === k || i === l || j === k || j === l || k === l) continue; if (h(q[0], q[1]) && h(q[1], q[2]) && h(q[2], q[3]) && h(q[3], q[0])) return {ok:true}; } return {ok:false, msg:'Chưa tìm thấy chu trình độ dài 4.'}; }, 'ab, bc, cd, da (e và f cô lập)', 'VD: ab, bc, cd, da')].map(function(x){ x.ex = 'ab, bc, cd, da'; return x; })},
{n:3, p:'Draw all trees which have 4 vertices, then all trees which have 5 vertices (no isomorphisms).', hint:'Phân loại theo bậc lớn nhất của một đỉnh.',
 parts:[N('Number of trees with 4 vertices', 2), N('Number of trees with 5 vertices', 3)],
 sol:'<div class="figs"><figure>' + G.graph({a:[20,30], b:[70,30], c:[120,30], d:[170,30]}, [['a','b'],['b','c'],['c','d']], {w:190, h:60}) + '<figcaption>4 đỉnh: đường thẳng</figcaption></figure><figure>' + G.graph({a:[60,20], b:[20,60], c:[60,60], d:[100,60]}, [['a','b'],['a','c'],['a','d']], {w:120, h:80}) + '<figcaption>4 đỉnh: hình sao</figcaption></figure></div><div class="figs"><figure>' + G.graph({a:[20,30], b:[65,30], c:[110,30], d:[155,30], e:[200,30]}, [['a','b'],['b','c'],['c','d'],['d','e']], {w:220, h:60}) + '<figcaption>5 đỉnh: đường thẳng</figcaption></figure><figure>' + G.graph({a:[80,20], b:[20,70], c:[60,70], d:[100,70], e:[140,70]}, [['a','b'],['a','c'],['a','d'],['a','e']], {w:160, h:90}) + '<figcaption>5 đỉnh: hình sao</figcaption></figure><figure>' + G.graph({a:[20,30], b:[65,30], c:[110,30], d:[155,30], e:[110,75]}, [['a','b'],['b','c'],['c','d'],['c','e']], {w:175, h:95}) + '<figcaption>5 đỉnh: một đỉnh bậc 3</figcaption></figure></div>'},
{n:4, p:'Find two spanning trees for the graph in question 1.', fig: G.graph(G1N, G1L), hint:'Cây khung giữ đủ 6 đỉnh, dùng đúng 5 cạnh và không có chu trình.',
 parts:[FN('Spanning tree 1', spanCheck('abcdef'.split(''), G1E), 'ab, bc, ce, de, ef', 'VD: ab, bc, ...'), FN('Spanning tree 2', spanCheck('abcdef'.split(''), G1E), 'ae, af, bf, ce, de', 'VD: ae, af, ...')]},
{n:5, p:'Write down the adjacency matrix for the graph in question 1 (order a, b, c, d, e, f).', hint:'Ô (i, j) bằng 1 nếu có cạnh nối đỉnh i với đỉnh j. Đồ thị vô hướng nên ma trận đối xứng.',
 parts:[MX('Adjacency matrix', [[0,1,0,0,1,1],[1,0,1,0,0,1],[0,1,0,0,1,0],[0,0,0,0,1,0],[1,0,1,1,0,1],[1,1,0,0,1,0]], '0 1 0 0 1 1; 1 0 1 0 0 1; 0 1 0 0 1 0; 0 0 0 0 1 0; 1 0 1 1 0 1; 1 1 0 0 1 0')]},
{n:6, p:'A graph G with vertices v₁, v₂, v₃, v₄ has adjacency matrix A = (0 1 1 0; 1 0 0 0; 1 0 0 1; 0 0 1 0). Draw G. Find the number of walks of length 2 and 3 between v₁ and v₃ and identify them.', hint:'Số walk độ dài k từ vᵢ tới vⱼ là phần tử (i, j) của Aᵏ.',
 parts:[N('Walks of length 2 (v₁ to v₃)', 0), N('Walks of length 3 (v₁ to v₃)', 3), O('Identify the walks', 'v₁ v₂ v₁ v₃, v₁ v₃ v₁ v₃, v₁ v₃ v₄ v₃.')],
 sol:'<div class="figs"><figure>' + G.graph({v2:[30,40], v1:[110,40], v3:[190,40], v4:[270,40]}, [['v1','v2'],['v1','v3'],['v3','v4']], {w:300, h:80}) + '</figure></div><p>G là đường v₂ v₁ v₃ v₄. (A²)₁₃ = 0, (A³)₁₃ = 3.</p>'},
{n:7, p:'Find a minimum spanning tree for the weighted graph and its length.', fig: G.graph({a:[40,70], b:[150,20], c:[262,80], d:[282,196], e:[160,190], f:[46,186]}, [['a','b',9],['b','c',4],['a','c',11],['a','f',8],['b','e',7],['c','e',3],['c','d',2],['f','e',5],['e','d',4]]), hint:'Kruskal: sắp cạnh tăng dần theo trọng số, lần lượt chọn cạnh không tạo chu trình cho đến khi đủ 5 cạnh.',
 parts:[FN('MST edges', spanCheck('abcdef'.split(''), 'ab bc ac af be ce cd ef de', W7, 22), 'cd, ce, bc, ef, af', 'VD: cd, ce, ...'), N('Total length', 22)],
 sol:'<p>Thứ tự: cd 2 (chọn), ce 3 (chọn), bc 4 (chọn), de 4 (bỏ, tạo chu trình c-d-e), ef 5 (chọn), be 7 (bỏ), af 8 (chọn). Tổng 2 + 3 + 4 + 5 + 8 = 22.</p>' + '<div class="figs"><figure>' + G.graph({a:[40,70], b:[150,20], c:[262,80], d:[282,196], e:[160,190], f:[46,186]}, [['a','b',9],['b','c',4],['a','c',11],['a','f',8],['b','e',7],['c','e',3],['c','d',2],['f','e',5],['e','d',4]], {hl:['cd','ce','bc','ef','af']}) + '</figure></div>'},
{n:8, p:'Five computers A to E are to be connected. Costs: AB 52, AC 37, AD 16, BC 23, BD 12, BE 15, CE 10, DE 12. (i) Use Kruskal’s algorithm to find a minimum spanning tree. (ii) Find the minimum cost. (iii) If A must be connected to B, what difference does this make?', hint:'(iii) Bắt buộc lấy cạnh AB trước, rồi chạy Kruskal tiếp với các cạnh còn lại.',
 parts:[FN('(i) MST edges', spanCheck('abcde'.split(''), 'ab ac ad bc bd be ce de', W8, 50), 'CE, BD, DE, AD', 'VD: ce, bd, ...'), N('(ii) Minimum cost', 50), N('(iii) Minimum cost with AB', 86)],
 sol:'<p>(i) CE 10, BD 12, DE 12 chọn; BE 15 bỏ (B và E đã nối qua D); AD 16 chọn. Tổng 50. (iii) Lấy AB 52, sau đó CE 10, BD 12, DE 12 là đủ nối 5 máy (AD lúc này tạo chu trình). Tổng 86, tức đắt hơn 36.</p>' + '<div class="figs"><figure>' + G.graph({A:[40,40], B:[200,40], C:[260,150], D:[120,190], E:[60,150]}, [['A','B',52],['A','C',37],['A','D',16],['B','C',23],['B','D',12],['B','E',15],['C','E',10],['D','E',12]], {hl:['CE','BD','DE','AD']}) + '</figure></div>'},
{n:9, p:'Put the numbers 23, 43, 15, 37, 25, 46, 67, 12, 18 in a binary search tree with 23 as the root. Fill in the left and right child of each node ("-" for none).', hint:'Chèn theo đúng thứ tự cho trước. Nhỏ hơn đi trái, lớn hơn đi phải.',
 parts:[GRID('Children', ['Node','Left','Right'], bstRows(T9, [23,15,43,12,18,37,46,25,67]))],
 sol: G.tree(T9, 23)},
{n:10, p:'Find a binary search tree for the words in this sentence: "Find a binary search tree for the words in this sentence. Use ‘find’ as the root." Fill in the children of each node (lower case, "-" for none).', hint:'So sánh theo thứ tự từ điển. Bỏ qua từ lặp lại (find, the).',
 parts:[GRID('Children', ['Node','Left','Right'], bstRows(T10, ['find','a','binary','search','for','tree','in','the','words','as','root','sentence','this','use']))],
 sol: G.tree(T10, 'find', {gap:52})},
{n:11, p:'Using a binary tree evaluate (a → ¬b) ∨ ((¬c → a) ∧ b) when a and b are true and c is false.', hint:'Đánh giá từ lá lên gốc.',
 parts:[TF('a → ¬b', false), TF('¬c → a', true), TF('(¬c → a) ∧ b', true), TF('Whole expression', true)]}
]});

/* ================= 10: ALGORITHMS ================= */
CH.push({no:10, title:'Algorithms', vi:'Thuật toán', qs:[
{n:1, p:'Inputs come from N, with r > 2. For each algorithm (i) draw the design, (ii) describe the output in words, (iii) perform it with two sets of inputs.', fig:'<div class="algos"><pre>Algorithm a\nREAD ← p, q\nIF p > q THEN\n  DISPLAY p\nELSE\n  DISPLAY q\nENDIF</pre><pre>Algorithm b\nREAD ← r\ni ← 2\nAnswer ← "true"\nDO\n  IF r mod i = 0 THEN\n    Answer ← "false"\n  ENDIF\n  i ← i + 1\nLOOP UNTIL i = r\nDISPLAY Answer</pre><pre>Algorithm c\nREAD ← p, n\ni ← 1\nAnswer ← 1\nDO\n  Answer ← Answer * p\n  i ← i + 1\nLOOP UNTIL i > n\nDISPLAY Answer</pre></div>', hint:'Chạy tay từng bước, ghi giá trị biến sau mỗi vòng lặp (trace table).',
 parts:[CHO('(ii) Algorithm a', ['Displays the larger of p and q', 'Displays p + q', 'Displays the smaller of p and q'], 0), N('(iii) a with p = 7, q = 3', 7), N('(iii) a with p = 2, q = 9', 9),
  CHO('(ii) Algorithm b', ['Displays "true" if r is even', 'Displays "true" if r is prime, otherwise "false"', 'Counts the divisors of r'], 1), X('(iii) b with r = 7', ['true'], 'true'), X('(iii) b with r = 9', ['false'], 'false'),
  CHO('(ii) Algorithm c', ['Displays p × n', 'Displays n!', 'Displays pⁿ'], 2), N('(iii) c with p = 2, n = 5', 32), N('(iii) c with p = 3, n = 4', 81), O('(i) Designs', 'Vẽ lưu đồ: a là một nhánh IF; b là vòng lặp kiểm tra r mod i với i = 2 đến r − 1; c là vòng lặp nhân Answer với p đúng n lần.')]},
{n:2, p:'Linear search compares each item in an ordered list with the required data. In the worst case (last item or not in the list), how many comparisons are there for a list of (i) 8 items, (ii) n items?', hint:'Ví dụ cho sẵn: danh sách 7 phần tử cần 7 phép so sánh.',
 parts:[N('(i) 8 items', 8), X('(ii) n items', ['n'], 'n')]},
{n:3, p:'Binary search repeatedly halves the list. Worst-case comparisons for lists of (i) 8, (ii) 9, (iii) 20, (iv) 56, (v) n items?', hint:'Ví dụ cho sẵn: 7 phần tử cần 3 lần. Mỗi lần so sánh, danh sách còn khoảng một nửa.',
 parts:[N('(i) 8', 4), N('(ii) 9', 4), N('(iii) 20', 5), N('(iv) 56', 6), X('(v) n', ['⌊log₂n⌋+1','⌊log2n⌋+1','floor(log2n)+1','floor(log2(n))+1','⌊log2(n)⌋+1','⌊log₂(n)⌋+1','int(log2n)+1'], '⌊log₂ n⌋ + 1')],
 sol:'<p>Số lần so sánh tệ nhất = ⌊log₂ n⌋ + 1. 8: ⌊3⌋ + 1 = 4. 9: ⌊3.17⌋ + 1 = 4. 20: ⌊4.32⌋ + 1 = 5. 56: ⌊5.81⌋ + 1 = 6.</p>'},
{n:4, p:'State the big O for the linear search (Q2) and binary search (Q3).', hint:'Big O mô tả số bước tăng theo n như thế nào khi n lớn.',
 parts:[X('Linear search', ['o(n)'], 'O(n)'), X('Binary search', ['o(logn)','o(log2n)','o(log₂n)','o(lgn)'], 'O(log n)')]},
{n:5, p:'Turing machine T is defined by (s0,0,s1,1,R), (s0,1,s1,0,R), (s0,B,s1,0,R), (s1,0,s2,1,L), (s1,1,s1,0,R), (s1,B,s2,0,L). Starting at the leftmost non-blank cell in state s0, give the final tape when it halts.', hint:'Mỗi bộ năm là (trạng thái, ký hiệu đọc, trạng thái mới, ký hiệu ghi, hướng). Máy dừng ở s2 vì không có luật nào cho s2.',
 parts:[TAPE('i) B B 0 0 1 1 B B', 'BB1111BB'), TAPE('ii) B B 1 0 1 B B B', 'BB011BBB'), TAPE('iii) B B 1 1 B 0 1 B', 'BB00001B')],
 sol:'<p>(i) s0 đọc 0 → ghi 1, sang phải, s1. s1 đọc 0 → ghi 1, sang trái, s2: dừng. (iii) s0 đọc 1 → ghi 0, phải, s1. s1 đọc 1 → ghi 0, phải. s1 đọc B → ghi 0, trái, s2: dừng.</p>'}
]});
function TAPE(l, ans){
  var core = ans.replace(/^B+|B+$/g, '');
  return FN(l, function(raw){ var c = String(raw).toUpperCase().replace(/[^01B]/g, ''); return {ok: c.replace(/^B+|B+$/g, '') === core}; }, ans.split('').join(' '), 'VD: B B 1 0 1 B B B');
}

/* ================= 11: DATA AND STATISTICS ================= */
var HGT = [176,187,152,170,195,158,175,169,190,155], WGT = [80,98,45,76,112,65,78,70,105,50];
CH.push({no:11, title:'Data and Statistics', vi:'Dữ liệu và thống kê', intro:'Các câu vẽ biểu đồ có hình mẫu trong phần lời giải để bạn đối chiếu với Excel. Độ lệch chuẩn chấp nhận cả công thức chia n và chia n − 1.', qs:[
{n:1, p:'Heights (cm) 176 187 152 170 195 158 175 169 190 155 and weights (kg) 80 98 45 76 112 65 78 70 105 50. Draw a scatter graph. Does it suggest a connection? Would this be expected?', hint:'Trong Excel: chọn hai cột, Insert → Scatter.',
 parts:[CHO('Connection', ['Strong positive correlation: taller people tend to be heavier', 'Negative correlation', 'No clear connection'], 0), O('Expected?', 'Có, người cao hơn thường có khối xương và cơ lớn hơn. Hệ số tương quan r ≈ 0.99.')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[145,200], yr:[40,120], xs:10, ys:20, pts:HGT.map(function(h, i){ return [h, WGT[i]]; }), xl:'Height (cm)', yl:'kg'}) + '</figure></div>'},
{n:2, p:'Draw a line graph of average London temperature: Jan 7, Feb 7, Mar 9, Apr 11, May 14, Jun 16, Jul 19, Aug 19, Sep 17, Oct 13, Nov 10, Dec 7 (°C).', hint:'Insert → Line chart, trục ngang là tháng.',
 parts:[O('Line graph', 'Đường tăng từ 7°C tháng 1 lên đỉnh 19°C tháng 7 và 8, rồi giảm về 7°C tháng 12.')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[1,12], yr:[0,20], xs:1, ys:5, lines:[{p:[7,7,9,11,14,16,19,19,17,13,10,7].map(function(v, i){ return [i + 1, v]; }), dots:true}], xfmt:function(m){ return 'JFMAMJJASOND'[m - 1]; }, yl:'°C'}) + '</figure></div>'},
{n:3, p:'Draw a bar chart of the Computer Society election votes: Adam 17, Bilal 24, Charlotte 22, Deborah 13, Evgeniya 18.', hint:'Insert → Column chart.',
 parts:[O('Bar chart', 'Bilal thắng với 24 phiếu, sau đó Charlotte 22.')], sol:'<div class="figs"><figure>' + G.bars(['Adam','Bilal','Charlotte','Deborah','Evgeniya'], [17,24,22,13,18]) + '</figure></div>'},
{n:4, p:'Draw a pie chart of predicted Premier League winners: Chelsea 35%, Manchester City 25%, Manchester United 15%, Arsenal 10%, Tottenham Hotspur 10%, Others 5%.', hint:'Mỗi 1% ứng với 3.6°.',
 parts:[O('Pie chart', 'Chelsea chiếm 126°, Man City 90°, Man United 54°, Arsenal và Tottenham mỗi đội 36°, Others 18°.')], sol:'<div class="figs"><figure>' + G.pie(['Chelsea','Man City','Man United','Arsenal','Tottenham','Others'], [35,25,15,10,10,5]) + '</figure></div>'},
{n:5, p:'You got 48% in Mathematics and 65% in Computer Programming. Which should please you more? What statistics would help you decide?', hint:'So sánh vị trí của bạn so với cả lớp ở từng môn, không chỉ điểm thô.',
 parts:[O('Your reasoning', 'Cần điểm trung bình và độ lệch chuẩn (hoặc trung vị và các tứ phân vị) của mỗi bài thi. Tính z = (điểm − trung bình)/độ lệch chuẩn cho từng môn; môn có z cao hơn là kết quả tốt hơn so với bạn cùng lớp. Ví dụ nếu toán có trung bình 35, SD 8 thì 48% là z ≈ 1.6, rất tốt.')]},
{n:6, p:'The company removes the worst 10% under its productivity measure. Your measure is 5.7. Is it better for you if (a) the average is 7 and the standard deviation 1.5, or (b) the average is 6 and the standard deviation 0.1? Assume a roughly normal distribution.', hint:'10% thấp nhất của phân phối chuẩn nằm dưới z ≈ −1.28.',
 parts:[CHO('Better for you', ['(a) mean 7, SD 1.5', '(b) mean 6, SD 0.1'], 0)],
 sol:'<p>(a) z = (5.7 − 7)/1.5 ≈ −0.87, cao hơn −1.28, nên an toàn (ngưỡng ≈ 7 − 1.28 × 1.5 = 5.08). (b) z = (5.7 − 6)/0.1 = −3, nằm sâu trong 10% thấp nhất (ngưỡng ≈ 5.87), bị loại.</p>'},
{n:7, p:'Number of children in 50 families: 4 5 2 2 3 4 4 3 5 4 / 7 3 3 4 2 2 2 2 2 6 / 3 2 3 3 1 2 3 2 2 6 / 5 5 3 2 4 4 2 4 1 2 / 2 2 1 3 3 2 2 4 5 3. Construct the frequency distribution, draw a bar chart and pie chart, and calculate the mean and mode.', hint:'Excel: =COUNTIF(range, 1) cho từng giá trị; =AVERAGE(range); =MODE(range).',
 parts:[GRID('Frequency', ['Children','1','2','3','4','5','6','7'], [['Families'].concat([3,18,12,9,5,2,1].map(function(v){ return {a:[String(v)], s:String(v)}; }))]), N('Mean', 3.1), N('Mode', 2)],
 sol:'<p>Σfx = 3 + 36 + 36 + 36 + 25 + 12 + 7 = 155, mean = 155/50 = 3.1. Mode = 2 (18 gia đình).</p><div class="figs"><figure>' + G.bars(['1','2','3','4','5','6','7'], [3,18,12,9,5,2,1]) + '</figure><figure>' + G.pie(['1','2','3','4','5','6','7'], [3,18,12,9,5,2,1]) + '</figure></div>'},
{n:8, p:'Class test marks: 5 10 25 25 25 30 30 30 35 35. Find the mean, median and mode.', hint:'10 giá trị nên trung vị là trung bình của giá trị thứ 5 và thứ 6.',
 parts:[N('Mean', 25), N('Median', 27.5), S('Mode(s)', [25,30], '25 và 30 (bimodal)', {numeric:true})]},
{n:9, p:'Lives of 120 circuit components (hours): 660-669: 3, 670-679: 10, 680-689: 16, 690-699: 23, 700-709: 34, 710-719: 21, 720-729: 9, 730-739: 4. State class intervals and marks, construct the cumulative frequency, estimate the median and the inter-quartile range.', hint:'Biên lớp là 659.5, 669.5, ... Trung vị ở vị trí 60, Q1 ở 30, Q3 ở 90. Nội suy tuyến tính trong lớp chứa vị trí đó.',
 parts:[GRID('Cumulative frequency', ['Upper boundary','669.5','679.5','689.5','699.5','709.5','719.5','729.5','739.5'], [['Cum. freq'].concat([3,13,29,52,86,107,116,120].map(function(v){ return {a:[String(v)], s:String(v)}; }))]), N('Median (hours)', 701.9, '≈ 701.9', {tol:1}), N('Lower quartile', 689.9, '≈ 689.9', {tol:1.2}), N('Upper quartile', 711.4, '≈ 711.4', {tol:1.2}), N('IQR', 21.5, '≈ 21.5', {tol:2}), O('Class intervals and class marks', 'Khoảng lớp 659.5-669.5, 669.5-679.5, ...; class mark (điểm giữa) 664.5, 674.5, 684.5, 694.5, 704.5, 714.5, 724.5, 734.5.')],
 sol:'<p>Median = 699.5 + (60 − 52)/34 × 10 ≈ 701.9. Q1 = 689.5 + (30 − 29)/23 × 10 ≈ 689.9. Q3 = 709.5 + (90 − 86)/21 × 10 ≈ 711.4. Đọc từ đồ thị thì chênh lệch nhỏ là bình thường.</p><div class="figs"><figure>' + G.plot({xr:[659.5,739.5], yr:[0,120], xs:10, ys:20, lines:[{p:[[659.5,0],[669.5,3],[679.5,13],[689.5,29],[699.5,52],[709.5,86],[719.5,107],[729.5,116],[739.5,120]], dots:true}], xfmt:function(x){ return Math.round(x); }, xl:'hours'}) + '</figure></div>'},
{n:10, p:'A zoologist weighs 100 eggs: 24-29 g: 11, 30-35: 23, 36-41: 36, 42-47: 21, 48-53: 9. Give the class marks and find the mean and standard deviation to 2 decimal places.', hint:'Class mark = trung điểm, ví dụ (24 + 29)/2 = 26.5. Dùng σ = √(Σfx²/n − x̄²).',
 parts:[S('Class marks', [26.5,32.5,38.5,44.5,50.5], null, {numeric:true}), N('Mean', 38.14, '38.14', {tol:0.01}), N('Standard deviation', 6.67, '6.67 (chia n), 6.71 (chia n − 1)', {tol:0.05})]},
{n:11, p:'Three groups sit a test (marks out of 50). Class intervals 11-15 to 41-45. A: 5, 15, 10, 0, 0, 0, 0. B: 2, 10, 10, 5, 3, 0, 0. C: 1, 2, 5, 10, 10, 1, 1. Calculate the mean and standard deviation of each group and compare.', hint:'Class marks 13, 18, 23, 28, 33, 38, 43. Excel: =SUMPRODUCT(f, x)/SUM(f).',
 parts:[N('A mean', 18.83, '18.83', {tol:0.01}), N('A SD', 3.44, '3.44', {tol:0.06}), N('B mean', 22.5), N('B SD', 5.38, '5.38', {tol:0.1}), N('C mean', 28.5), N('C SD', 6.10, '6.10', {tol:0.12}), O('Compare', 'C có điểm trung bình cao nhất nhưng phân tán nhất; A thấp nhất và đồng đều nhất.')]},
{n:12, p:'Copy the 100 values into Excel. Use the Data Analysis tool to form a histogram with suitable classes, then draw a frequency polygon.', hint:'Chọn bins 10, 20, ..., 100 (lớp 1-10, 11-20, ...). Frequency polygon nối trung điểm đỉnh các cột.',
 parts:[O('Histogram and polygon', 'Với lớp 1-10, ..., 91-100 tần số là 8, 9, 13, 8, 10, 12, 10, 11, 11, 8. Phân phối gần đều (uniform).')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[0,100], yr:[0,15], xs:10, ys:5, bars:[8,9,13,8,10,12,10,11,11,8].map(function(v, i){ return {x:5.5 + i*10, y:v, w:10}; }), lines:[{p:[[-4.5,0]].concat([8,9,13,8,10,12,10,11,11,8].map(function(v, i){ return [5.5 + i*10, v]; })).concat([[105.5,0]]).filter(function(q){ return q[0] >= 0 && q[0] <= 100; }), dots:true, c:1}]}) + '</figure></div>'},
{n:13, p:'What is wrong with these statements? "In Lake Woebegone all the children are above average." "We don’t stock that size as there’s no demand for it." "If his average was 2 marks more he would have passed, if only he had got 40 for his project rather than 38."', hint:'Nghĩ về định nghĩa trung bình, vòng lặp nhân quả, và việc tăng một điểm thành phần ảnh hưởng thế nào tới trung bình.',
 parts:[O('Your answer', '(1) Không thể mọi phần tử đều trên trung bình của chính nhóm đó. (2) Lập luận vòng: không có hàng thì không bán được, nên không có dữ liệu "nhu cầu". (3) Tăng 2 điểm ở một thành phần chỉ làm trung bình tăng một phần của 2 điểm (trừ khi chỉ có một thành phần).')]}
]});

/* ================= 12: PROBABILITY ================= */
CH.push({no:12, title:'Probability', vi:'Xác suất', intro:'Nhập xác suất dạng phân số (5/26) hoặc thập phân.', qs:[
{n:1, p:'What is the probability of choosing a vowel from the alphabet?', hint:'5 nguyên âm trong 26 chữ.', parts:[N('P', 5/26, '5/26', {tol:1e-4})]},
{n:2, p:'A number from 1 to 11 is chosen at random. What is the probability of choosing an odd number?', hint:'Đếm 1, 3, 5, ..., 11.', parts:[N('P', 6/11, '6/11', {tol:1e-4})]},
{n:3, p:'A class has 17 boys and 13 girls. 4 boys and 5 girls got an A. What is the probability of choosing a girl or an A student?', hint:'P(G ∪ A) = P(G) + P(A) − P(G ∩ A).', parts:[N('P', 17/30, '17/30', {tol:1e-4})], sol:'<p>13/30 + 9/30 − 5/30 = 17/30.</p>'},
{n:4, p:'After throwing a dice, what is the probability that the number shown is divisible by 3?', hint:'Chỉ có 3 và 6.', parts:[N('P', 1/3, '1/3', {tol:1e-4})]},
{n:5, p:'A loaded dice has P(1) = 0.1, P(2) = 0.2, P(3) = 0.1, P(4) = 0.2, P(5) = 0.1, P(6) = 0.3. Is an even number or a number greater than 3 more probable?', hint:'Cộng xác suất của các mặt tương ứng.',
 parts:[N('P(even)', 0.7), N('P(> 3)', 0.6), CHO('More probable', ['Even', 'Greater than 3', 'Equal'], 0)]},
{n:6, p:'A fair coin is tossed three times. (i) P(at least two consecutive heads)? (ii) P(exactly two heads)?', hint:'Liệt kê 8 kết quả HHH, HHT, ..., TTT.',
 parts:[N('(i)', 3/8, '3/8'), N('(ii)', 3/8, '3/8')], sol:'<p>(i) HHH, HHT, THH. (ii) HHT, HTH, THH.</p>'},
{n:7, p:'On New Year’s Eve P(car accident) = 0.09, P(driving while intoxicated) = 0.32, P(accident while intoxicated) = 0.15. What is the probability of driving while intoxicated or having an accident?', hint:'P(I ∪ A) = P(I) + P(A) − P(I ∩ A).',
 parts:[N('P', 0.26)], sol:'<p>0.32 + 0.09 − 0.15 = 0.26. Lưu ý: số liệu của đề không nhất quán, vì P(I ∩ A) = 0.15 lớn hơn P(A) = 0.09, điều không thể xảy ra. Đáp án 0.26 là theo cách đề muốn bạn áp dụng công thức.</p>'},
{n:8, p:'A drawer holds one pair of socks of each colour: blue, brown, red, white, black. You choose a pair, replace it, then choose again. P(red both times)?', hint:'Hai lần độc lập vì có hoàn lại.', parts:[N('P', 1/25, '1/25')]},
{n:9, p:'A jar has 3 red, 5 green, 2 blue and 6 yellow marbles. One is chosen, replaced, then a second is chosen. P(green then yellow)?', hint:'16 viên tất cả.', parts:[N('P', 15/128, '15/128', {tol:1e-5})], sol:'<p>5/16 × 6/16 = 30/256 = 15/128.</p>'},
{n:10, p:'Three cards are chosen from a deck of 52 without replacement. P(3 aces)?', hint:'Sau mỗi lần rút, số át và tổng số lá đều giảm 1.', parts:[N('P', 1/5525, '1/5525', {tol:1e-7})], sol:'<p>4/52 × 3/51 × 2/50 = 24/132 600 = 1/5525.</p>'},
{n:11, p:'Calculate using your calculator and Excel (FACT, PERMUT, COMBIN). Explain any errors or unexpected answers.', hint:'ⁿPᵣ = n!/(n − r)!, ⁿCᵣ = n!/(r!(n − r)!). Không thể chọn 8 từ 4 phần tử.',
 parts:[N('6!', 720), N('12!', 479001600), N('0!', 1), {t:'str', impossible:true, l:'(−1)!', s:'Error: giai thừa không xác định cho số âm'}, N('⁶P₃', 120), N('⁷P₄', 840), N('⁶P₆', 720), {t:'str', impossible:true, l:'⁴P₈', s:'Error (#NUM!): r > n'}, N('⁶C₃', 20), N('⁷C₄', 35), N('⁶C₆', 1), N('⁴C₈', 0, '0 hoặc Error (#NUM!): r > n', {err:true})],
 sol:'<p>0! = 1 theo quy ước. (−1)! không xác định. ⁴P₈ và ⁴C₈ không có nghĩa vì chọn 8 từ 4 phần tử; Excel báo #NUM!, một số máy tính trả về 0 cho ⁴C₈.</p>'},
{n:12, p:'A Formula 1 race has 22 cars. (i) Qualifying eliminates the slowest 6 (order does not matter): in how many ways? (ii) The second part eliminates another 6 from the remaining 16. (iii) The remaining 10 are ordered by fastest time. (iv) In how many ways can the podium (1st, 2nd, 3rd in order) be formed?', hint:'Không quan tâm thứ tự: tổ hợp C. Có thứ tự: chỉnh hợp P hoặc giai thừa.',
 parts:[N('(i) ²²C₆', 74613), N('(ii) ¹⁶C₆', 8008), N('(iii) 10!', 3628800), N('(iv) ²²P₃', 9240)]},
{n:13, p:'Roll a die: a 1 wins immediately. Otherwise roll again: a 1 or 2 wins, anything else loses. Draw the probability tree. What is the probability of winning?', hint:'Thắng = thắng lần 1, hoặc thua lần 1 rồi thắng lần 2.',
 parts:[N('P(win)', 4/9, '4/9', {tol:1e-4})], sol:'<p>1/6 + 5/6 × 2/6 = 6/36 + 10/36 = 16/36 = 4/9.</p>'},
{n:14, p:'Expected value of: (i) a die with sides 1, 2, 3, 4, 4, 4; (ii) a die with sides 2, 4, 6, 8, 10, 12; (iii) the sum of two standard dice.', hint:'E(X) = Σ x P(x). Kỳ vọng của tổng bằng tổng các kỳ vọng.',
 parts:[N('(i)', 3), N('(ii)', 7), N('(iii)', 7)], sol:'<p>(i) 18/6 = 3. (ii) 42/6 = 7. (iii) 3.5 + 3.5 = 7.</p>'},
{n:15, p:'Five boxes contain £1, £10, £100, £1000 and £10 000. Your box has £1000. Take it, or reject it and open another box? Decide under each criterion.', hint:'Nếu đổi, bạn nhận ngẫu nhiên một trong 4 hộp còn lại: 1, 10, 100, 10 000.',
 parts:[CHO('(i) Expected value', ['Keep £1000', 'Switch'], 1), CHO('(ii) Maximax', ['Keep £1000', 'Switch'], 1), CHO('(iii) Minimax (best worst case)', ['Keep £1000', 'Switch'], 0), CHO('(iv) Regret (minimax regret)', ['Keep £1000', 'Switch'], 1)],
 sol:'<p>(i) E(đổi) = (1 + 10 + 100 + 10 000)/4 = 2527.75 &gt; 1000. (ii) Tốt nhất khi đổi là 10 000 &gt; 1000. (iii) Tệ nhất khi đổi là £1 &lt; 1000, nên giữ. (iv) Hối tiếc lớn nhất khi giữ là 10 000 − 1000 = 9000; khi đổi là 1000 − 1 = 999. Chọn hối tiếc nhỏ hơn: đổi.</p>'},
{n:16, p:'The Monty Hall problem: three doors, one car and two goats. You choose a door; the host opens another door showing a goat. Should you switch or stay?', hint:'Lúc đầu bạn chọn đúng xe với xác suất 1/3. Người dẫn chương trình luôn mở cửa có dê.',
 parts:[CHO('Best choice', ['Stay', 'Switch', 'It does not matter'], 1), N('P(win) if you switch', 2/3, '2/3', {tol:1e-4})],
 sol:'<p>Nếu ban đầu chọn dê (xác suất 2/3), người dẫn buộc phải mở cửa dê còn lại, nên đổi chắc chắn được xe. Vậy đổi thắng với xác suất 2/3, giữ nguyên chỉ 1/3.</p>'}
]});
