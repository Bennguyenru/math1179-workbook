/* ================= 5: RELATIONS, MAPPINGS AND FUNCTIONS ================= */
CH.push({no:5, title:'Relations, Mappings and Functions', vi:'Quan hệ, ánh xạ và hàm', qs:[
{n:1, p:'A = {s, t, u, v}, B = {5, 6, 7, 8}. g: A → B is defined by g(s) = 5, g(t) = 5, g(u) = 6, g(v) = 7.', hint:'Range là tập các giá trị thực sự được g "chạm tới", có thể nhỏ hơn co-domain.',
 parts:[X('i) Domain of g', ['a','{s,t,u,v}'], 'A'), X('i) Co-domain of g', ['b','{5,6,7,8}'], 'B'), N('ii) Image of t', 5), S('iii) Range of g', [5,6,7], null, {numeric:true})]},
{n:2, p:'B = {5, 6, 7, 8}, C = {1, 2, ..., 40}. f: B → C is defined by f(a) = 4a + 1.', hint:'Thay từng phần tử của B vào 4a + 1.',
 parts:[N('f(5)', 21), N('f(7)', 29), N('Image of 6', 25), S('Domain of f', [5,6,7,8], null, {numeric:true}), S('Range of f', [21,25,29,33], null, {numeric:true})]},
{n:3, p:'Are the functions g (question 1) and f (question 2) onto? One-one?', hint:'Onto: mọi phần tử của co-domain đều có tạo ảnh. One-one: hai phần tử khác nhau cho hai ảnh khác nhau.',
 parts:[CHO('g onto?', ['Yes','No'], 1), CHO('g one-one?', ['Yes','No'], 1), CHO('f onto?', ['Yes','No'], 1), CHO('f one-one?', ['Yes','No'], 0)],
 sol:'<p>g không onto vì 8 không có tạo ảnh; không one-one vì g(s) = g(t) = 5. f không onto vì range {21, 25, 29, 33} nhỏ hơn C; f là one-one vì 4a + 1 tăng thật sự.</p>'},
{n:4, p:'Using f and g from questions 1 and 2, find f ∘ g. Why is it not possible to define g ∘ f?', hint:'f ∘ g nghĩa là làm g trước rồi f: (f ∘ g)(x) = f(g(x)).',
 parts:[PR('f ∘ g as pairs (x, f(g(x)))', ['(s,21)','(t,21)','(u,25)','(v,29)']), O('Why not g ∘ f?', 'g ∘ f cần g(f(x)), nhưng f cho giá trị trong C (21, 25, ...) mà các số này không thuộc miền xác định A của g.')]},
{n:5, p:'Find the inverses where possible.', hint:'Hàm có ngược khi là song ánh (one-one và onto). Với f(x) = 2x − 1, đặt y = 2x − 1 rồi giải x theo y.',
 parts:[PR('(i) h⁻¹ where h(a) = y, h(b) = x, h(c) = z', ['(y,a)','(x,b)','(z,c)'], '(y,a), (x,b), (z,c)'), FM('(ii) f⁻¹(x) for f(x) = 2x − 1', function(e){ return (e.x + 1)/2; }, ['x'], 'f⁻¹(x) = (x + 1)/2', 'f⁻¹(x) = ...'), CHO('(iii) g(x) = 2x² − 1 on R', ['Inverse is √((x + 1)/2)', 'No inverse: g is not one-one'], 1)],
 sol:'<p>(iii) g(1) = g(−1) = 1, nên g không one-one và không có hàm ngược trên R (trừ khi giới hạn miền xác định, ví dụ x ≥ 0).</p>'},
{n:6, p:'For each function find f(3), f(−2), f(0), sketch the graph and find the range: (i) f(x) = x − 2, (ii) f(x) = 2x² + 4, (iii) f(x) = x² − 6x + 5, (iv) f(x) = 4ˣ.', hint:'(iii) Hoàn thành bình phương: x² − 6x + 5 = (x − 3)² − 4. 4ˣ luôn dương.',
 parts:[N('(i) f(3)', 1), N('(i) f(−2)', -4), N('(i) f(0)', -2), X('(i) Range', ['r','ℝ','(-∞,∞)','allrealnumbers','f(x)∈r','y∈r'], 'ℝ (all real numbers)'),
  N('(ii) f(3)', 22), N('(ii) f(−2)', 12), N('(ii) f(0)', 4), X('(ii) Range', ['f(x)≥4','y≥4','[4,∞)','≥4','f≥4'], 'f(x) ≥ 4'),
  N('(iii) f(3)', -4), N('(iii) f(−2)', 21), N('(iii) f(0)', 5), X('(iii) Range', ['f(x)≥-4','y≥-4','[-4,∞)','≥-4','f≥-4'], 'f(x) ≥ −4'),
  N('(iv) f(3)', 64), N('(iv) f(−2)', 1/16, '1/16'), N('(iv) f(0)', 1), X('(iv) Range', ['f(x)>0','y>0','(0,∞)','>0','f>0'], 'f(x) > 0')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[-4,6], yr:[-6,24], fns:[{f:function(x){return x-2;}, c:0}, {f:function(x){return 2*x*x+4;}, c:1}, {f:function(x){return x*x-6*x+5;}, c:2}, {f:function(x){return Math.pow(4,x);}, c:3}]}) + G.legend(['x − 2','2x² + 4','x² − 6x + 5','4ˣ']) + '</figure></div>'},
{n:7, p:'Plot the graphs (in Excel or similar) of y = x + 2, y = 2x, y = x², y = 2ˣ.', hint:'Lập bảng giá trị x từ −3 đến 3 rồi chèn biểu đồ Scatter with smooth lines.',
 parts:[O('Plots', 'So sánh với hình trong lời giải: hai đường thẳng, một parabol và một đường cong mũ.')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[-3,3], yr:[-4,9], fns:[{f:function(x){return x+2;}}, {f:function(x){return 2*x;}}, {f:function(x){return x*x;}}, {f:function(x){return Math.pow(2,x);}}]}) + G.legend(['x + 2','2x','x²','2ˣ']) + '</figure></div>'},
{n:8, p:'Write down log₂16, log₂0.25, log₂3.5.', hint:'log₂ N là số mũ k sao cho 2ᵏ = N. log₂3.5 = ln 3.5 / ln 2.',
 parts:[N('log₂ 16', 4), N('log₂ 0.25', -2), N('log₂ 3.5', 1.807, '1.807', {tol:0.001})]},
{n:9, p:'Find the amplitude, period and frequency of y = 4 sin πt, y = 2 sin 3πt, y = 2 sin (πt/2).', hint:'y = a sin(ωt): biên độ a, chu kỳ T = 2π/ω, tần số f = 1/T.',
 parts:[N('4 sin πt: amplitude', 4), N('4 sin πt: period', 2), N('4 sin πt: frequency', 0.5), N('2 sin 3πt: amplitude', 2), N('2 sin 3πt: period', 2/3, '2/3'), N('2 sin 3πt: frequency', 1.5), N('2 sin (πt/2): amplitude', 2), N('2 sin (πt/2): period', 4), N('2 sin (πt/2): frequency', 0.25)],
 sol:'<div class="figs"><figure>' + G.plot({xr:[0,4], yr:[-4.5,4.5], fns:[{f:function(t){return 4*Math.sin(Math.PI*t);}}, {f:function(t){return 2*Math.sin(3*Math.PI*t);}}, {f:function(t){return 2*Math.sin(Math.PI*t/2);}}], xl:'t'}) + G.legend(['4 sin πt','2 sin 3πt','2 sin (πt/2)']) + '</figure></div>'},
{n:10, p:'In the example on relations (from the lecture), find p₂ ∘ p₁⁻¹(Stephen).', hint:'p₁⁻¹(Stephen) là tập các cặp có thành phần đầu là Stephen; p₂ lấy thành phần thứ hai của các cặp đó.',
 parts:[O('Answer', 'Cần dữ liệu ví dụ trong bài giảng trên Moodle. Cách làm: liệt kê mọi cặp (Stephen, y) trong quan hệ, đáp án là tập các y.')]},
{n:11, p:'Bob, Carol, Ted and Alice work on projects V1 to V6: V1: Bob, Ted, Carol. V2: Alice. V3: Bob, Carol. V4: Bob, Alice. V5: Bob, Ted. V6: Bob, Carol, Ted, Alice. Find the relation (a subset of V × R) and use projection mappings.', hint:'Mỗi cặp (dự án, lập trình viên) là một phần tử. Có 14 cặp.',
 parts:[PR('Relation', ['(V1,Bob)','(V1,Ted)','(V1,Carol)','(V2,Alice)','(V3,Bob)','(V3,Carol)','(V4,Bob)','(V4,Alice)','(V5,Bob)','(V5,Ted)','(V6,Bob)','(V6,Carol)','(V6,Ted)','(V6,Alice)']), S('(i) Programmers on V3: p₂(p₁⁻¹(V3))', ['Bob','Carol']), S('(ii) Projects of Ted: p₁(p₂⁻¹(Ted))', ['V1','V5','V6'])]}
]});

/* ================= 6: TRIGONOMETRY ================= */
CH.push({no:6, title:'Trigonometry', vi:'Lượng giác', intro:'Có thể nhập π trực tiếp, ví dụ 7π/6 hoặc 7pi/6.', qs:[
{n:1, p:'Convert from degrees to radians.', hint:'Nhân với π/180.',
 parts:[N('720°', 4*Math.PI, '4π'), N('210°', 7*Math.PI/6, '7π/6'), N('180°', Math.PI, 'π'), N('90°', Math.PI/2, 'π/2'), N('135°', 3*Math.PI/4, '3π/4'), N('315°', 7*Math.PI/4, '7π/4'), N('30°', Math.PI/6, 'π/6'), N('0°', 0)]},
{n:2, p:'Convert from radians to degrees.', hint:'Nhân với 180/π, tức là thay π bằng 180°.',
 parts:[N('7π/4', 315), N('10π/3', 600), N('π/3', 60), N('π', 180), N('7π/6', 210), N('π/2', 90), N('5π/2', 450), N('5π', 900)]},
{n:3, p:'A silver pendant is a sector of a circle with radius 3 cm and area 6 cm². Find θ in radians.', hint:'Diện tích hình quạt = ½ r² θ.',
 parts:[N('θ (rad)', 4/3, '4/3 ≈ 1.333', {tol:0.005})], sol:'<p>½ × 3² × θ = 6 ⇒ 4.5θ = 6 ⇒ θ = 4/3 rad.</p>'},
{n:4, p:'An oil drum of diameter 60 cm floats with chord PQ on the surface; the arc PQ under the water is 50 cm. (i) Find θ in radians. (ii) The drum is 1 metre long; find the volume below the surface.', hint:'Cung = rθ với r = 30. Phần chìm là viên phân (segment): ½ r²(θ − sin θ), rồi nhân chiều dài 100 cm.',
 parts:[N('(i) θ (rad)', 5/3, '5/3 ≈ 1.667', {tol:0.005}), N('(ii) Volume (cm³)', 30207, '≈ 30 207 cm³ (khoảng 30.2 lít)', {tol:60})],
 sol:'<p>θ = 50/30 = 5/3 rad. Diện tích viên phân = ½ × 900 × (5/3 − sin(5/3)) = 450 × (1.6667 − 0.9954) ≈ 302.07 cm². Thể tích ≈ 302.07 × 100 ≈ 30 207 cm³ = 0.0302 m³. Nhớ đặt máy tính ở chế độ radian khi tính sin(5/3).</p>'},
{n:5, p:'Show sin 30° = ½, and then derive cos 30°.', hint:'Lấy tam giác đều cạnh 2, chia đôi bằng đường cao.',
 parts:[N('sin 30°', 0.5, '1/2'), N('cos 30°', Math.sqrt(3)/2, '√3/2 ≈ 0.866', {tol:0.001})],
 sol:'<p>Tam giác đều cạnh 2 có các góc 60°. Đường cao chia nó thành hai tam giác vuông với góc 30°, cạnh huyền 2, cạnh đối diện góc 30° bằng 1. Vậy sin 30° = 1/2. Đường cao = √(2² − 1²) = √3, nên cos 30° = √3/2.</p>'},
{n:6, p:'Given tan 45° = 1 and tan 30° = 1/√3, find without a calculator: tan 135° and tan 150°.', hint:'tan(180° − α) = −tan α. Góc phần tư thứ hai, tan âm.',
 parts:[N('tan 135°', -1), N('tan 150°', -1/Math.sqrt(3), '−1/√3', {tol:0.001})]},
{n:7, p:'Solve 3 cos x = −0.6 for 0 ≤ x ≤ 360°, giving answers to 1 decimal place.', hint:'cos x = −0.2. cos âm ở góc phần tư II và III; nghiệm thứ hai là 360° − x₁.',
 parts:[RT('x (degrees)', [101.5, 258.5], '101.5°, 258.5°', 0.06)]},
{n:8, p:'Solve tan x = −2 where x is in radians and −2π ≤ x ≤ 2π.', hint:'tan có chu kỳ π: lấy nghiệm cơ bản rồi cộng/trừ π cho tới khi ra khỏi khoảng.',
 parts:[RT('x (radians)', [-4.2487, -1.1071, 2.0344, 5.1760], '−4.249, −1.107, 2.034, 5.176', 0.005)],
 sol:'<p>tan⁻¹(−2) = −1.1071. Cộng/trừ bội số của π: −1.1071 − π = −4.2487, −1.1071 + π = 2.0344, −1.1071 + 2π = 5.1760. Bốn nghiệm.</p>'},
{n:9, p:'Find all solutions between 0° and 360° of cos x sin x = 3 cos x.', hint:'Đừng chia hai vế cho cos x (sẽ mất nghiệm). Chuyển vế và đặt nhân tử chung.',
 parts:[RT('x (degrees)', [90, 270], '90°, 270°')], sol:'<p>cos x (sin x − 3) = 0. sin x = 3 vô nghiệm, nên cos x = 0 ⇒ x = 90° hoặc 270°.</p>'},
{n:10, p:'Find all solutions between 0° and 360° to 3 cos x = 2 sin² x.', hint:'Thay sin² x = 1 − cos² x để được phương trình bậc hai theo cos x.',
 parts:[RT('x (degrees)', [60, 300], '60°, 300°')], sol:'<p>2cos² x + 3cos x − 2 = 0 ⇒ (2cos x − 1)(cos x + 2) = 0. cos x = −2 vô nghiệm, cos x = 1/2 ⇒ x = 60° hoặc 300°.</p>'}
]});

/* ================= 7: PATTERN MATCHING ================= */
CH.push({no:7, title:'Pattern Matching and Unification', vi:'So khớp mẫu và hợp nhất', intro:'Nhập phép gán dạng X = a, Y = b. Nếu không khớp được, nhập fail.', qs:[
{n:1, p:'Given a pattern and a value, determine the result (the example X with 1 gives X = 1).', hint:'Chỉ biến trong pattern được gán. Một biến xuất hiện nhiều lần phải nhận cùng một giá trị.',
 parts:[BIND('X + 2X  with  a + 2a', {x:'a'}, 'X = a'), BIND('X + X  with  m + n', 'fail', 'fail (X không thể vừa là m vừa là n)'), BIND('sin(X)  with  sin(2π)', {x:['2pi','2*pi']}, 'X = 2π'), BIND('X  with  a + 100', {x:'a+100'}, 'X = a + 100')]},
{n:2, p:'Use unification on the two patterns to determine the result (the example X with Y gives X = Y).', hint:'Hợp nhất cho phép biến ở CẢ HAI phía được gán.',
 parts:[BIND('X + a  with  b + Y', {x:'b', y:'a'}, 'X = b, Y = a'), BIND('X + Y  with  a + Y', {x:'a'}, 'X = a'), BIND('X + s  with  t + X', 'fail', 'fail (X = t và X = s mâu thuẫn)'), BIND('likes(X, pizza)  with  likes(Fred, Y)', {x:'fred', y:'pizza'}, 'X = Fred, Y = pizza'), BIND('X  with  Y + a', {x:'y+a'}, 'X = Y + a')]}
]});

/* ================= 8: VECTORS AND MATRICES ================= */
CH.push({no:8, title:'Vectors and Matrices', vi:'Vectơ và ma trận', intro:'Nhập ma trận theo hàng, ngăn cách hàng bằng dấu chấm phẩy: 1 2; 3 4. Phần tử có thể là phân số. Nếu phép tính không thực hiện được, nhập "impossible".', qs:[
{n:1, p:'p = (10, 3), q = (−2, 5), r = (3, −2). Find p + 3q, q − r, p + q − r.', hint:'Cộng trừ theo từng thành phần.',
 parts:[{t:'vec', l:'p + 3q', a:[4,18], s:'(4, 18)', ph:'(x, y)'}, {t:'vec', l:'q − r', a:[-5,7], s:'(−5, 7)', ph:'(x, y)'}, {t:'vec', l:'p + q − r', a:[5,10], s:'(5, 10)', ph:'(x, y)'}]},
{n:2, p:'A = (1 1; −2 5), B = (6 1; 2 −3; 2 1), C = (2 0 4), D = (3; 1; −2), E = (1 −5 8 1 0; 2 1 2 −2 5), F = (2 6; 4 3). Evaluate where possible.', hint:'Cộng/trừ cần cùng kích thước. Tích m×n với p×q cần n = p, kết quả m×q.',
 parts:[MX('i) 2A', [[2,2],[-4,10]], '2 2; −4 10'), IMP('ii) A + B'), MX('iii) BF', [[16,39],[-8,3],[8,15]], '16 39; −8 3; 8 15'), MX('iv) CD', [[-2]], '−2'), MX('v) DC', [[6,0,12],[2,0,4],[-4,0,-8]], '6 0 12; 2 0 4; −4 0 −8'), IMP('vi) B − A'), IMP('vii) E + F'), MX('viii) AE', [[3,-4,10,-1,5],[8,15,-6,-12,25]], '3 −4 10 −1 5; 8 15 −6 −12 25'), IMP('ix) ED'), MX('x) F²', [[28,30],[20,33]], '28 30; 20 33'), MX('xi) A⁻¹', [[5/7,-1/7],[2/7,1/7]], '5/7 −1/7; 2/7 1/7')],
 sol:'<p>A là 2×2, B là 3×2, C là 1×3, D là 3×1, E là 2×5, F là 2×2. A + B và B − A khác kích thước. E + F khác kích thước. ED: E có 5 cột nhưng D có 3 hàng. A⁻¹: det A = 1×5 − 1×(−2) = 7, nên A⁻¹ = (1/7)(5 −1; 2 1).</p>'},
{n:3, p:'Rectangle R has corners P(1,1), Q(5,1), R(5,2), S(1,2). Find its position after each transformation (start from R each time). W = (0 1; 1 0), V = (0 −1; 1 0), U = (−2 0; 0 −2), translation m = (−3, 2). Then with F = (−1 0; 0 1) form FV, apply it to R and comment.', hint:'Nhân ma trận với từng điểm (x, y) viết dạng cột. Phép tịnh tiến thì cộng vectơ.',
 parts:[{t:'pts', l:'W(R): P, Q, R, S', a:[[1,1],[1,5],[2,5],[2,1]], s:'(1,1), (1,5), (2,5), (2,1)', ph:'(x,y), (x,y), (x,y), (x,y)'}, {t:'pts', l:'V(R)', a:[[-1,1],[-1,5],[-2,5],[-2,1]], s:'(−1,1), (−1,5), (−2,5), (−2,1)', ph:'(x,y), ...'}, {t:'pts', l:'U(R)', a:[[-2,-2],[-10,-2],[-10,-4],[-2,-4]], s:'(−2,−2), (−10,−2), (−10,−4), (−2,−4)', ph:'(x,y), ...'}, {t:'pts', l:'R + m', a:[[-2,3],[2,3],[2,4],[-2,4]], s:'(−2,3), (2,3), (2,4), (−2,4)', ph:'(x,y), ...'},
  MX('FV', [[0,1],[1,0]], '0 1; 1 0'), O('Describe each effect and comment on FV', 'W: phản xạ qua đường y = x. V: quay 90° ngược chiều kim đồng hồ quanh O. U: phóng to hệ số −2 (gấp đôi và quay 180°). m: dời 3 sang trái, 2 lên trên. FV = W: quay 90° rồi phản xạ qua trục y cho cùng kết quả với phản xạ qua y = x.')],
 sol:'<div class="figs"><figure>' + G.plot({xr:[-11,6], yr:[-5,6], xs:2, ys:2, polys:[{p:[[1,1],[5,1],[5,2],[1,2]], c:4, t:'R'}, {p:[[1,1],[1,5],[2,5],[2,1]], c:0, t:'W'}, {p:[[-1,1],[-1,5],[-2,5],[-2,1]], c:1, t:'V'}, {p:[[-2,-2],[-10,-2],[-10,-4],[-2,-4]], c:2, t:'U'}, {p:[[-2,3],[2,3],[2,4],[-2,4]], c:3, t:'+m'}]}) + '</figure></div>'},
{n:4, p:'Solve the simultaneous equations using matrices: (i) 2x + 3y = 8, x + 4y = 9; (ii) 4x − y = 21, −10x + 3y = −53; (iii) 5x + y = 23, 3x + y = 15.', hint:'Viết dạng AX = B rồi X = A⁻¹B. Với ma trận 2×2 (a b; c d), A⁻¹ = (1/(ad − bc))(d −b; −c a).',
 parts:[N('(i) x', 1), N('(i) y', 2), N('(ii) x', 5), N('(ii) y', -1), N('(iii) x', 4), N('(iii) y', 3)],
 sol:'<p>(i) det = 2×4 − 3×1 = 5. X = (1/5)(4 −3; −1 2)(8; 9) = (1/5)(5; 10) = (1; 2). (ii) det = 12 − 10 = 2, X = (1/2)(3 1; 10 4)(21; −53) = (5; −1). (iii) det = 2, X = (4; 3).</p>'},
{n:5, p:'Let q = (0 −1; 1 0). Construct a multiplication table using q as the starting element and show it is closed. Use the labels I, q, q², q³ (q² = −I, q³ = −q).', hint:'Tính q² và q³ trước. q⁴ = I, nên qᵃ × qᵇ = q^((a + b) mod 4).',
 parts:[GRID('× table', ['×','I','q','q²','q³'], [['I'].concat([0,1,2,3].map(Q)), ['q'].concat([1,2,3,0].map(Q)), ['q²'].concat([2,3,0,1].map(Q)), ['q³'].concat([3,0,1,2].map(Q))])],
 sol:'<p>q² = (−1 0; 0 −1) = −I, q³ = (0 1; −1 0), q⁴ = I. Bảng chỉ chứa 4 ma trận này nên tập {I, q, q², q³} đóng với phép nhân.</p>'}
]});
function Q(k){ var acc = [['i','q0','q^0','e','q⁴','q4'], ['q','q1','q^1'], ['q²','q2','q^2','-i'], ['q³','q3','q^3','-q']]; return {a:acc[k], s:['I','q','q²','q³'][k]}; }
