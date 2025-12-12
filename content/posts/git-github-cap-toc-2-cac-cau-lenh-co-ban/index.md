---
title: "[GIT/GITHUB CẤP TỐC #2] – GIT BASH: CÁC CÂU LỆNH CƠ BẢN"
template: post
date: 2023-07-25 09:00
category: game
coverImage: "22-221456_git-branch.jpg"
---
**Bước 1: Thiết lập thông tin cá nhân** Sau khi cài đặt, hãy cấu hình thông tin cá nhân của bạn. Chạy các lệnh sau trong dòng lệnh, thay thế thông tin của bạn vào:
```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
**Bước 2: Tạo một kho lưu trữ (repository) mới** Kho lưu trữ là nơi bạn lưu trữ mã nguồn và lịch sử thay đổi của dự án. Tạo thư mục mới cho dự án của bạn và di chuyển vào thư mục đó. Sau đó, chạy lệnh sau để khởi tạo một kho lưu trữ mới:
```
git init
```
**Bước 3: Thêm và commit các tệp** Thêm các tệp vào kho lưu trữ bằng cách chạy lệnh sau:
```
git add .
```
Lưu ý rằng dấu chấm trong lệnh trên cho phép Git thêm tất cả các tệp thay đổi vào commit. Nếu bạn muốn thêm chỉ một tệp cụ thể, hãy thay thế dấu chấm bằng tên tệp. VD:
```
git add test.txt
```
Commit các thay đổi đã thêm:
```
git commit -m "Mô tả thay đổi của bạn ở đây"
```
**Bước 4: Xem lịch sử và trạng thái** Để xem lịch sử commit và trạng thái của kho lưu trữ, sử dụng các lệnh sau:
```
git log # Xem lịch sử commit
git status # Xem trạng thái của kho lưu trữ
```
**Bước 5: Tạo và chuyển nhánh (branch)** Nhánh giúp bạn phát triển các tính năng mới mà không làm ảnh hưởng đến phần còn lại của dự án. Để tạo một nhánh mới, sử dụng lệnh:
```
git branch <branch-name>
```
Để chuyển sang một nhánh, sử dụng:
```
git checkout <branch-name>
```
Hoặc sử dụng lệnh rút gọn:
```
git checkout -b <branch-name>
```
**Bước 6: Merge và rebase** Merge và rebase đều là cách để hợp nhất các nhánh vào nhau. Merge giữ nguyên lịch sử commit của cả hai nhánh, trong khi rebase "chèn" lịch sử commit của một nhánh vào trước nhánh khác.
Để merge một nhánh vào nhánh hiện tại:
```
git merge <branch-name>
```
Để rebase nhánh hiện tại lên một nhánh khác:
```
git rebase <branch-name>
```
**Bước 7: Remote repositories** Git cho phép bạn làm việc với kho lưu trữ từ xa. Để thêm một kho lưu trữ từ xa (remote repository), sử dụng:
```
git remote add <remote-name> <remote-url>
```
Sau đó, bạn có thể đẩy (push) và kéo (pull) dữ liệu từ kho lưu trữ từ xa:
```
git push <remote-name> <branch-name>
git pull <remote-name> <branch-name>
```
**Bước 8: Git stash** Khi bạn muốn tạm thời lưu trữ các thay đổi chưa commit mà không muốn commit chúng ngay lập tức, bạn có thể sử dụng git stash:
```
git stash # Tạm thời lưu trữ các thay đổi
git stash apply # Áp dụng các thay đổi đã lưu trữ vào lại kho lưu trữ
```
**Bước 9: Git cherry-pick** Cherry-pick cho phép bạn chọn một commit từ một nhánh và áp dụng nó vào một nhánh khác:
```
git cherry-pick <commit-hash>
```
Đây chỉ là một số khái niệm và lệnh cơ bản của Git. Git là một công cụ mạnh mẽ và linh hoạt, và để sử dụng hiệu quả, bạn nên tiếp tục tìm hiểu và thực hành thêm.
Các câu lệnh cơ bản thường sử dụng:
- **git init:** Khởi tạo một kho lưu trữ Git mới trong thư mục hiện tại. Câu lệnh này tạo ra một thư mục .git, trong đó chứa toàn bộ thông tin của kho lưu trữ.
- **git add:** Thêm các thay đổi trong thư mục làm việc vào vùng chưa chuẩn bị (staging area). Điều này chuẩn bị các thay đổi để được commit.
- **git commit:** Tạo một commit từ các thay đổi đã chuẩn bị trong vùng chưa chuẩn bị. Commit là một hình ảnh chụp lại trạng thái của mã nguồn tại thời điểm đó, kèm theo thông điệp để mô tả các thay đổi.
- **git status:** Hiển thị trạng thái của kho lưu trữ. Nó cho bạn biết những tập tin đã thay đổi và tập tin nào đang trong vùng chưa chuẩn bị.
- **git log:** Xem lịch sử commit của kho lưu trữ. Nó hiển thị danh sách các commit được thực hiện, bao gồm thông tin về tác giả, thời gian và thông điệp commit.
- **git branch:** Liệt kê các nhánh hiện có trong kho lưu trữ. Nhánh là cách để phân tách và quản lý các tính năng và phiên bản của mã nguồn.
- **git checkout:** Chuyển đổi giữa các nhánh hoặc di chuyển đến một commit cụ thể. Câu lệnh này cho phép bạn di chuyển trong lịch sử commit của kho lưu trữ.
- **git push:** Đẩy các commit đã tạo lên kho lưu trữ từ máy tính cá nhân lên kho lưu trữ từ xa trên GitHub hoặc GitLab.
- **git pull:** Kéo các commit mới nhất từ kho lưu trữ từ xa về máy tính cá nhân. Điều này đồng nghĩa với việc cập nhật kho lưu trữ của bạn với phiên bản mới nhất trên GitHub hoặc GitLab.
- **git clone:** Sao chép một kho lưu trữ từ xa từ GitHub hoặc GitLab xuống máy tính cá nhân. Câu lệnh này tạo một bản sao của kho lưu trữ, cho phép bạn làm việc trên mã nguồn một cách độc lập.
- **git merge**: Hợp nhất các commit từ một nhánh vào nhánh hiện tại. Câu lệnh này được sử dụng để kết hợp các tính năng hoặc sửa lỗi từ các nhánh khác vào nhánh chính.
- **git remote:** Xem và quản lý các kho lưu trữ từ xa. Nó cho phép bạn liên kết kho lưu trữ của bạn với các kho lưu trữ từ xa trên GitHub hoặc GitLab.
- **git fetch:** Lấy các commit mới nhất từ kho lưu trữ từ xa, nhưng không hợp nhất vào nhánh hiện tại. Câu lệnh này cho phép bạn xem trước các thay đổi trước khi hợp nhất.
- **git stash:** Tạm ẩn các thay đổi chưa commit khi bạn muốn chuyển đổi giữa các nhánh hoặc commit trên một nhánh khác mà không muốn lưu trữ các thay đổi chưa hoàn thành.
- **git config:** Thiết lập hoặc xem cấu hình Git, bao gồm tên người dùng, địa chỉ email và cấu hình khác.
- **git rm:** Xóa tập tin khỏi kho lưu trữ và thư mục làm việc. Câu lệnh này cũng giúp bạn xóa tập tin sao chép theo dõi và thực hiện commit để xóa nó khỏi kho lưu trữ.
