---
title: "[GIT/GITHUB CẤP TỐC #1] - GIỚI THIỆU VỀ GIT/GITHUB"
template: post
date: 2023-07-23 09:00
category: game
coverImage: "22-221456_git-branch.jpg"
---
Chào các bạn,
Trong bài giới thiệu này, chúng ta sẽ khám phá một công cụ hữu ích và phổ biến trong lĩnh vực phát triển phần mềm - Git và GitHub.
**Git là gì?** Git là một hệ thống quản lý phiên bản mã nguồn mở, được sử dụng rộng rãi bởi các nhà phát triển phần mềm để theo dõi và quản lý mã nguồn. Nó giúp bạn lưu trữ các phiên bản của dự án của mình, giúp bạn theo dõi các thay đổi, và cho phép bạn làm việc song song với đồng đội một cách dễ dàng.
**GitHub là gì?** GitHub là một dịch vụ lưu trữ mã nguồn trực tuyến dựa trên Git. Nó cho phép bạn lưu trữ và quản lý mã nguồn của dự án của mình trên Internet. Bạn có thể tạo kho lưu trữ công khai hoặc riêng tư, làm việc cùng với nhóm, và chia sẻ mã nguồn của mình với cộng đồng phát triển toàn cầu.
**Vì sao Git và GitHub quan trọng?** Git và GitHub đã thay đổi cách chúng ta làm việc với mã nguồn. Điều quan trọng là chúng giúp chúng ta:
1. **Quản lý phiên bản**: Với Git, bạn có thể dễ dàng lưu trữ các phiên bản của dự án, giúp bạn kiểm soát thay đổi và quay lại bất kỳ lúc nào.
3. **Làm việc nhóm**: GitHub cho phép bạn và đồng đội làm việc cùng nhau trên cùng một dự án. Bạn có thể đồng bộ hóa thay đổi, xem và xem xét mã nguồn của nhau.
5. **Phát triển mở**: GitHub là cổng vào cộng đồng phát triển phần mềm rộng lớn. Bạn có thể chia sẻ mã nguồn, nhận phản hồi từ người dùng khác và đóng góp vào các dự án mã nguồn mở khác.
Để hiểu hơn về Git/GitHub thì chúng ta thử đọc qua câu chuyện (không có thật) sau đây:
**Câu chuyện: "Phép màu của Git trong công việc nhóm"**
Trong một nhóm phát triển phần mềm, có ba thành viên là Anna, Ben và Clara. Họ đang cùng nhau phát triển một ứng dụng đơn giản, một trình duyệt nhỏ giúp người dùng quản lý công việc cá nhân.
**Tình huống:**
1. **Bắt đầu dự án:** Anna quyết định tạo dự án mới trên GitHub và gửi lời mời Ben và Clara tham gia. Cả ba người đều rất hào hứng và muốn đóng góp vào dự án.
3. **Khởi tạo dự án:** Anna tạo một kho lưu trữ mới trên GitHub, đặt tên là "PersonalTaskManager". Sau đó, cô sao chép kho lưu trữ này xuống máy tính của mình bằng Git bằng cách chạy lệnh: `git clone https://github.com/anna/PersonalTaskManager.git`
5. **Thay đổi mã nguồn:** Mỗi thành viên bắt đầu viết mã cho một tính năng riêng trong dự án. Anna viết mã để thêm chức năng tạo công việc mới, Ben viết mã để sắp xếp công việc theo thời gian, và Clara viết mã để xóa công việc không cần thiết.
7. **Commit và lịch sử thay đổi:** Mỗi thành viên thực hiện "commit" khi hoàn thành một phần mã. Anna commit với thông điệp "Thêm chức năng tạo công việc mới", Ben commit với thông điệp "Thêm chức năng sắp xếp công việc", và Clara commit với thông điệp "Thêm chức năng xóa công việc". Nhờ Git, lịch sử các commit này được lưu giữ rõ ràng và dễ quản lý.
9. **Xử lý xung đột:** Một lúc sau, Anna và Ben đều hoàn thành mã của mình và push lên kho lưu trữ trên GitHub. Tuy nhiên, Clara cũng vừa hoàn thành công việc và cố gắng push lên, nhưng bỗng dưng một thông báo lỗi xuất hiện: "Kho lưu trữ của bạn đã cũ, vui lòng cập nhật trước khi push". Đó là xung đột, khi hai thành viên khác nhau cùng thay đổi mã nguồn trên cùng một dự án.
11. **Giải quyết xung đột:** Clara không nản lòng, cô sẵn lòng giải quyết xung đột một cách hợp tác. Cô chạy lệnh `git pull origin main` để kéo các thay đổi mới nhất từ GitHub về máy tính của mình. Sau đó, cô thực hiện commit lại và push một lần nữa. Bây giờ không còn xung đột nữa, và thay đổi của Clara được tích hợp vào dự án.
13. **Review và merge (hợp nhất):** Nhìn vào lịch sử commit trên GitHub, Anna thấy rõ các thay đổi của Clara và xem xét chúng. Cô cảm thấy rất hài lòng và sau đó thực hiện việc "merge" (hợp nhất) công việc của Clara vào nhánh chính của dự án.
Nhờ Git và GitHub, việc làm việc nhóm của Anna, Ben và Clara trở nên dễ dàng và hợp tác. Git giúp quản lý phiên bản mã nguồn một cách tự nhiên và an toàn. GitHub cung cấp một môi trường thuận tiện để làm việc cùng nhau, kiểm tra thay đổi và giải quyết xung đột. Cuối cùng, dự án PersonalTaskManager trở thành một ứng dụng nhỏ, đáng tin cậy, nhờ vào "phép màu" của Git trong công việc nhóm!
**Hãy bắt đầu khám phá Git và GitHub ngay hôm nay!**
\+ **Cài đặt Git:** Quản lý dự án của bạn bằng chế độ dòng lệnh. Để cài đặt Git trên máy tính của bạn, bạn có thể làm theo các bước sau:
1. **Windows:** Truy cập trang web chính thức của Git ([https://git-scm.com/](https://git-scm.com/)) và tải xuống trình cài đặt Git cho Windows. Sau đó, chạy trình cài đặt và làm theo hướng dẫn trên màn hình.
3. **MacOS:** Nếu bạn đang sử dụng MacOS, Git có thể được cài đặt một cách dễ dàng bằng cách sử dụng Homebrew. Mở Terminal và chạy lệnh `brew install git`.
5. **Linux:** Trên hầu hết các bản phân phối Linux, Git đã được cài đặt sẵn. Nếu chưa có, bạn có thể cài đặt Git bằng cách chạy lệnh trên Terminal: `sudo apt-get install git` (đối với Debian và Ubuntu) hoặc `sudo yum install git` (đối với CentOS và Fedora).
\+ **Cài đặt GitHub Desktop:** Để sử dụng GitHub một cách dễ dàng, bạn có thể cài đặt GitHub Desktop, một ứng dụng desktop với giao diện thân thiện để quản lý kho lưu trữ GitHub.
**Windows/MacOS:** Truy cập trang web GitHub Desktop ([https://desktop.github.com/](https://desktop.github.com/)) và tải xuống phiên bản phù hợp với hệ điều hành của bạn. Sau đó, chạy trình cài đặt và làm theo hướng dẫn trên màn hình.
