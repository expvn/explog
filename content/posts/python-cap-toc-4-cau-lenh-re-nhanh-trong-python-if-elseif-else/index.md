---
title: "[PYTHON CẤP TỐC #4] Câu lệnh rẽ nhánh trong Python (if, elseif, else)"
template: post
date: 2023-06-25 09:00
category: develop
tags: 
  - "cau-lenh-re-nhanh"
  - "else"
  - "elseif"
  - "hoc-python-co-ban"
  - "if"
  - "python"
coverImage: "Python-la-gi.png"
---
Trong Python, điều kiện và rẽ nhánh được thực hiện bằng cách sử dụng câu lệnh `if`, `elif` và `else`. Dưới đây là hướng dẫn chi tiết về các điều kiện và rẽ nhánh trong Python, kèm theo ví dụ ngắn gọn và dễ hiểu cho mỗi điều kiện:
## **1\. Câu lệnh if:**
Cú pháp:
```
if condition:
    # Thực hiện khi điều kiện đúng
```
Ví dụ:
```
age = 18
if age >= 18:
    print("Bạn đã đủ tuổi để lái xe.")
```
## **2\. Câu lệnh if-else:**
Cú pháp:
```
if condition:
    # Thực hiện khi điều kiện đúng
else:
    # Thực hiện khi điều kiện sai
```
Ví dụ:
```
age = 15
if age >= 18:
    print("Bạn đã đủ tuổi để lái xe.")
else:
    print("Bạn chưa đủ tuổi để lái xe.")
```
## **3\. Câu lệnh if-elif-else:**
Cú pháp:
```
if condition1:
    # Thực hiện khi điều kiện 1 đúng
elif condition2:
    # Thực hiện khi điều kiện 1 sai và điều kiện 2 đúng
else:
    # Thực hiện khi cả hai điều kiện 1 và điều kiện 2 đều sai
```
Ví dụ:
```
score = 85
if score >= 90:
    print("Bạn đã đạt điểm A.")
elif score >= 80:
    print("Bạn đã đạt điểm B.")
elif score >= 70:
    print("Bạn đã đạt điểm C.")
else:
    print("Bạn đã đạt điểm D hoặc thấp hơn.")
```
## **4\. Toán tử ba ngôi (Ternary operator):**
Cú pháp:
```
result = value_if_true if condition else value_if_false
```
Ví dụ:
```
age = 20
message = "Bạn đã đủ tuổi để lái xe." if age >= 18 else "Bạn chưa đủ tuổi để lái xe."
print(message)
```
## **5\. Câu lệnh pass:**
Câu lệnh pass được sử dụng khi bạn muốn có một khối mã không thực hiện bất kỳ thao tác nào, nhưng cú pháp Python yêu cầu có một khối mã.
Ví dụ:
```
age = 20
if age >= 18:
    pass  # Không có hành động cụ thể được thực hiện khi điều kiện đúng
else:
    print("Bạn chưa đủ tuổi để lái xe.")
```
Đây là những điều kiện và rẽ nhánh cơ bản trong Python. Bạn có thể kết hợp các điều kiện và rẽ nhánh này để xử lý các tình huống phức tạp hơn trong chương trình của mình.
