---
title: "[PYTHON CẤP TỐC #3] Các toán tử"
template: post
date: 2023-06-25 09:00
category: develop
tags: 
  - "cac-toan-tu-trong-python"
  - "python"
  - "python-co-ban"
coverImage: "Python-la-gi.png"
---
Dưới đây là một hướng dẫn chi tiết về các toán tử trong Python cùng với ví dụ ngắn gọn và dễ hiểu cho mỗi toán tử:
## **1\. Toán tử số học:**
- Toán tử cộng (+): Thực hiện phép cộng giữa hai giá trị.  
    Ví dụ:
```
a = 5
b = 3
c = a + b
print(c) # Output: 8
```
- Toán tử trừ (-): Thực hiện phép trừ giữa hai giá trị.  
    Ví dụ:
```
a = 5
b = 3
c = a - b
print(c) # Output: 2
```
- Toán tử nhân (\*): Thực hiện phép nhân hai giá trị.  
    Ví dụ:
```
a = 5
b = 3
c = a * b
print(c) # Output: 15
```
- Toán tử chia (/): Thực hiện phép chia hai giá trị.  
    Ví dụ:
```
a = 5
b = 2
c = a / b
print(c) # Output: 2.5
```
- Toán tử chia lấy phần nguyên (//): Thực hiện phép chia lấy phần nguyên hai giá trị.  
    Ví dụ:
```
a = 5
b = 2
c = a // b
print(c) # Output: 2
```
- Toán tử chia lấy phần dư (%): Thực hiện phép chia lấy phần dư hai giá trị.  
    Ví dụ:
```
a = 5
b = 2
c = a % b
print(c) # Output: 1
```
- Toán tử mũ (\*\*): Thực hiện phép tính lũy thừa của một giá trị.  
    Ví dụ:
```
a = 2
b = 3
c = a ** b
print(c) # Output: 8
```
## **2\. Toán tử gán:**
- Toán tử gán (=): Gán giá trị bên phải cho biến bên trái.  
    Ví dụ:
```
a = 5
b = a
print(b) # Output: 5
```
- Toán tử gán kết hợp (+=, -=, \*=, /=): Thực hiện phép gán kết hợp với phép toán tương ứng.  
    Ví dụ:
```
a = 5
a += 3 # Tương đương với a = a + 3
print(a) # Output: 8
```
## **3\. Toán tử so sánh:**
- Toán tử bằng (==): Kiểm tra xem hai giá trị có bằng nhau hay không.  
    Ví dụ:
```
a = 5
b = 3
print(a == b) # Output: False
```
- Toán tử khác (!=): Kiểm tra xem hai giá trị có khác nhau hay không.  
    Ví dụ:
```
a = 5
b = 3
print(a != b) # Output: True
```
- Toán tử lớn hơn (>), nhỏ hơn (<), lớn hơn hoặc bằng (>=), nhỏ hơn hoặc bằng (<=): So sánh hai giá trị với nhau.  
    Ví dụ:
```
a = 5
b = 3
print(a > b) # Output: True
print(a < b) # Output: False print(a >= b) # Output: True
print(a <= b) # Output: False
```
## **4\. Toán tử logic:**
- Toán tử và (and): Kiểm tra xem cả hai biểu thức có đúng cùng lúc hay không.  
    Ví dụ:
```
a = 5
b = 3
c = 7
print(a > b and a < c) # Output: True
```
- Toán tử hoặc (or): Kiểm tra xem ít nhất một trong hai biểu thức có đúng hay không.  
    Ví dụ:
```
a = 5
b = 3
c = 7
print(a > b or a > c) # Output: True
```
- Toán tử phủ định (not): Đảo ngược giá trị của một biểu thức logic.  
    Ví dụ:
```
a = 5
b = 3
print(not a > b) # Output: False
```
  
Đây chỉ là một số ví dụ về các toán tử trong Python. Có nhiều toán tử khác và cách sử dụng phụ thuộc vào tình huống và mục đích của bạn trong lập trình.
