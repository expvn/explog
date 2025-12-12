---
title: "[PYTHON CẤP TỐC #13] Thư viện trong Python"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "expvn"
  - "mot-so-thu-vien-python"
  - "python-cap-toc"
  - "thu-vien-trong-python"
coverImage: "Python-la-gi.png"
---
Trước tiên, bạn cần tìm kiếm thư viện phù hợp với nhu cầu của mình. Có nhiều nguồn tài nguyên để tìm kiếm thư viện, bao gồm trang chủ PyPI (Python Package Index), trang web chính thức của thư viện, tìm kiếm trên công cụ tìm kiếm và các diễn đàn, cộng đồng lập trình.
**Website**: [PyPI · The Python Package Index](https://pypi.org/)
Khi bạn tìm thấy thư viện phù hợp, hãy đọc tài liệu đi kèm để hiểu cách cài đặt và sử dụng thư viện. Tài liệu thường cung cấp thông tin về các tính năng, cách cài đặt, cách import, các lớp, phương thức và hàm có sẵn, ví dụ về việc sử dụng và các tùy chọn cấu hình.
## **1\. Cài đặt thư viện**
Để cài đặt thư viện, bạn có thể sử dụng trình quản lý gói mặc định của Python là `pip`. Mở terminal hoặc command prompt và chạy câu lệnh sau:
```
pip install <tên_thư_viện>
```
Thay `<tên_thư_viện>` bằng tên thư viện mà bạn muốn cài đặt. Nếu bạn muốn cài đặt một phiên bản cụ thể của thư viện, bạn có thể chỉ định phiên bản sau tên thư viện. Ví dụ:
```
pip install numpy
pip install pandas==1.2.4
```
Pip sẽ tự động tải xuống và cài đặt thư viện cùng với các phụ thuộc nếu có.
## **2\. Import thư viện**
Import thư viện: Sau khi cài đặt, bạn có thể import thư viện vào mã Python của mình bằng cách sử dụng câu lệnh `import`. Ví dụ:
```
import numpy
import pandas
```
Để import chỉ một phần của một thư viện trong Python, bạn có thể sử dụng từ khóa `from` trong câu lệnh `import`. Đây là cách bạn có thể làm:
```
from <tên_thư_viện> import <tên_phần_thư_viện>
```
Thay `<tên_thư_viện>` bằng tên thư viện bạn muốn import và `<tên_phần_thư_viện>` bằng tên của phần thư viện bạn muốn sử dụng. Ví dụ:
```
from math import sqrt
```
Trong ví dụ trên, chúng ta chỉ import phần `sqrt` từ thư viện `math`. Bây giờ, bạn có thể sử dụng hàm `sqrt` để tính căn bậc hai của một số:
```
result = sqrt(9)
print(result)  # Output: 3.0
```
Lưu ý rằng khi sử dụng `from <tên_thư_viện> import <tên_phần_thư_viện>`, bạn không cần phải sử dụng tên thư viện khi gọi các phương thức hay lớp từ phần thư viện đã import.
Bạn cũng có thể sử dụng từ khóa `as` để đặt tên viết tắt cho thư viện khi import. Ví dụ:
```
import numpy as np
import pandas as pd
```
Khi đã import thư viện thành công, bạn có thể sử dụng các hàm, phương thức và lớp từ thư viện trong mã Python của mình. Hãy xem tài liệu thư viện và các ví dụ đi kèm để hiểu cách sử dụng chúng.
## **3\. Cập nhật hoặc gỡ cài đặt:**
Cập nhật và gỡ cài đặt:
- Để cập nhật thư viện đã cài đặt, bạn có thể chạy lệnh:
```
pip install --upgrade <tên_thư_viện>
```
- Để gỡ cài đặt thư viện, bạn có thể chạy lệnh:
```
pip uninstall <tên_thư_viện>
```
Hãy thực hành và khám phá các thư viện phù hợp với nhu cầu của bạn để tăng cường khả năng lập trình của mình.
