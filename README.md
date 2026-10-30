# MATH1179 Workbook: tài liệu ôn tập tương tác

> **Đây là tài liệu ôn tập** cho học phần MATH1179 *Mathematics for Computer Science* (University of Greenwich). Toàn bộ bài tập trong workbook được chuyển sang một trang web để bạn điền đáp án trực tiếp, xem gợi ý và tự kiểm tra kết quả ngay trên trình duyệt.

**Mở trang ôn tập:** https://bennguyenru.github.io/math1179-workbook/

## Giới thiệu

Workbook gốc (Dr Yvonne Fryer, September 2025) là bản PDF để in ra và viết tay. Bản web này giữ nguyên nội dung 12 chương và thêm ba thứ mà bản giấy không có: bộ chấm tự động cho từng ý, gợi ý cách làm khi bạn bí, và lời giải chi tiết bằng tiếng Việt kèm hình minh họa (biểu đồ Venn, đồ thị hàm số, cây nhị phân, cây khung nhỏ nhất, biểu đồ thống kê). Đề bài giữ tiếng Anh như workbook để bạn quen với thuật ngữ khi đi thi.

Các chương: Sets, Numbers, Algebra, Logic (mệnh đề và vị từ), Relations and Functions, Trigonometry, Pattern Matching and Unification, Vectors and Matrices, Graph Theory, Algorithms, Data and Statistics, Probability, cùng một trang công thức tra cứu nhanh.

## Cách sử dụng

Mở đường link ở trên, đọc trang Giới thiệu rồi chọn chương ở cột bên trái. Tự làm từng câu, sau đó nhấn Enter hoặc bấm **Kiểm tra**. Ý đúng tô xanh, ý sai tô đỏ kèm lý do (sai định dạng, thiếu nghiệm, sai kích thước ma trận...). Bấm **Gợi ý** khi cần hướng đi, **Hiện đáp án** khi muốn đối chiếu. Những câu cần vẽ hình hoặc trả lời bằng lời có đáp án mẫu để bạn tự chấm.

Bộ chấm hiểu nhiều cách viết tương đương. Ô logic so sánh bảng chân trị, nên `p ∨ q` và `~(~p & ~q)` đều được tính đúng. Ô công thức thử biểu thức của bạn tại nhiều giá trị, nên `0.2(S − 6000)` và `0.2S − 1200` đều đúng. Các câu về đồ thị như walk, cây khung, cây khung nhỏ nhất được kiểm tra bằng thuật toán, nên mọi đáp án hợp lệ đều được chấp nhận.

| Loại đáp án | Ví dụ cách nhập |
|---|---|
| Phân số, hỗn số | `6/7`, `2 6/7` |
| Lũy thừa của 10 | `4.62×10^16`, `4.62e16` |
| Có π hoặc căn | `7π/6`, `7pi/6`, `-1/√3` |
| Tập hợp | `{1, 3, 5}`, `∅` |
| Logic | `¬p ∧ q`, `~p & q`, `p -> q` |
| Ma trận (theo hàng) | `1 2; 3 4` |
| Phép tính không thực hiện được | `impossible` |
| Cạnh hoặc walk trong đồ thị | `ab, bc, ce` hoặc `a, f, e` |

Thanh **Ký hiệu** ở cuối trang chèn nhanh ∪ ∩ ∅ ∈ ¬ ∧ → π √ vào ô đang gõ. Tiến độ được lưu trong trình duyệt (localStorage), không gửi đi đâu.

Muốn dùng không cần mạng, tải file `index.html` về và mở bằng trình duyệt là chạy (chỉ phông chữ cần mạng, thiếu mạng sẽ dùng phông hệ thống).

## Lưu ý quan trọng

Đây **không phải tài liệu chính thức** của University of Greenwich và không thay thế workbook, bài giảng trên Moodle hay hướng dẫn của giảng viên. Đáp án và lời giải do người biên soạn tự làm và đã được kiểm tra bằng máy, nhưng vẫn có thể còn sai sót. Nếu bạn thấy chỗ nào chưa đúng, hãy mở một [Issue](../../issues). Hãy dùng trang để tự luyện, không dùng để chép đáp án nộp bài.

Một số điểm cần biết khi ôn: câu 10 chương 5 dựa vào ví dụ trong bài giảng nên trang chỉ ghi cách làm; câu 12(ii) chương 4 được đọc theo hình là dây rẽ nhánh xuất phát từ p; câu 7 chương 12 có số liệu không nhất quán trong đề và lời giải có ghi chú điều này.

## Cấu trúc mã nguồn

Trang là một file HTML tự chứa, không cần thư viện ngoài. Mã nguồn tách thành các phần trong `src/`:

| File | Nội dung |
|---|---|
| `src/head.html` | Tiêu đề, CSS (sáng/tối), khung giao diện |
| `src/engine.js` | Bộ phân tích biểu thức số, logic, tập hợp, ma trận và hàm chấm điểm |
| `src/svg.js` | Vẽ hình minh họa cho lời giải (đồ thị, Venn, cây, biểu đồ) |
| `src/data0.js` | Hàm dựng các loại câu hỏi |
| `src/data1.js` ... `data3.js` | Nội dung 12 chương: đề, gợi ý, đáp án, lời giải |
| `src/formulae.js` | Trang công thức và trang giới thiệu |
| `src/ui.js` | Hiển thị, chấm điểm, lưu tiến độ |

Build và kiểm thử (cần Node.js 18 trở lên):

```bash
npm run build   # ghép src/ thành index.html
npm test        # build rồi chạy hai bộ kiểm thử
```

`tests/answers.test.js` đưa đáp án chuẩn của toàn bộ 490 ý qua bộ chấm để chắc chắn không có ý nào bị chấm sai. `tests/inputs.test.js` thử các cách nhập thực tế của sinh viên, gồm cả những cách nhập phải bị từ chối (ví dụ viết `0.6` khi đề yêu cầu phân số).

Để sửa nội dung một câu, mở file `src/dataN.js` của chương đó, sửa rồi chạy `npm test`.

## Bản quyền

Đề bài trích từ workbook MATH1179 thuộc bản quyền của University of Greenwich và được dùng ở đây cho mục đích ôn tập, phi thương mại. Nếu bạn là chủ sở hữu nội dung và muốn gỡ, vui lòng mở Issue, kho sẽ được gỡ ngay.

Phần mã nguồn (bộ chấm, giao diện, công cụ build) phát hành theo giấy phép MIT, xem `LICENSE`.
