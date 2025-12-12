---
title: "[PYTHON CẤP TỐC #12] Đọc và ghi tập tin trong Python"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "doc-va-ghi"
  - "expvn"
  - "hoc-python"
  - "mo-file-trong-python"
  - "python-co-ban"
coverImage: "Python-la-gi.png"
---
## **1\. Đọc tập tin**
- Mở tập tin: Bạn có thể sử dụng hàm `open()` để mở một tập tin trong chế độ đọc. Ví dụ:
```
file = open("file.txt", "r")
```
- Đọc nội dung tập tin: Bạn có thể sử dụng phương thức `.read()` để đọc nội dung của tập tin. Ví dụ:
```
content = file.read()
```
- Đóng tập tin: Sau khi đọc xong, hãy đảm bảo đóng tập tin bằng cách sử dụng phương thức `.close()`. Ví dụ:
```
file.close()
```
Ví dụ hoàn chỉnh:
```
try:
    file = open("file.txt", "r")
    content = file.read()
    print(content)
finally:
    file.close()
```
## **2\. Ghi tập tin**
- Mở tập tin: Bạn có thể sử dụng hàm `open()` để mở một tập tin trong chế độ ghi. Ví dụ:
```
file = open("file.txt", "w")
```
- Ghi nội dung vào tập tin: Bạn có thể sử dụng phương thức `.write()` để ghi nội dung vào tập tin. Ví dụ:
```
file.write("Hello, world!")
```
- Đóng tập tin: Sau khi ghi xong, hãy đảm bảo đóng tập tin bằng cách sử dụng phương thức `.close()`. Ví dụ:
```
file.close()
```
Ví dụ hoàn chỉnh:
```
try:
    file = open("file.txt", "w")
    file.write("Hello, world!")
finally:
    file.close()
```
Lưu ý: Khi sử dụng `open()` để mở tập tin, bạn có thể sử dụng các chế độ khác nhau như "r" (đọc), "w" (ghi), "a" (ghi tiếp), "x" (tạo mới) và nhiều chế độ khác. Hãy đảm bảo bạn chọn chế độ phù hợp với nhu cầu của mình.
Vậy là chúng đã đã cơ bản biết về cách đọc và ghi tập tin trong Python. Bạn có thể sử dụng các ví dụ trên như một cơ sở để áp dụng vào công việc của mình và làm việc với tập tin trong Python một cách hiệu quả.
