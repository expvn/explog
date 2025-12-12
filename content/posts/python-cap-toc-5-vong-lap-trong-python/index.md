---
title: "[PYTHON CẤP TỐC #5] Vòng lặp trong Python"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "expvn"
  - "python"
  - "python-co-ban"
  - "vong-lap"
coverImage: "Python-la-gi.png"
---
Trong Python, chúng ta sử dụng các vòng lặp để lặp lại một khối mã nhiều lần. Dưới đây là hướng dẫn chi tiết về các loại vòng lặp trong Python và ví dụ minh họa cho mỗi loại:
## **1\. Vòng lặp for:**
Cú pháp:
```py
for item in sequence:
  # Thực hiện các lệnh bên trong vòng lặp
```
Ví dụ:
```py
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
```
## **2\. Vòng lặp while:**
Cú pháp:
```py
while condition:
  # Thực hiện các lệnh bên trong vòng lặp
  # Nếu điều kiện vẫn đúng, lặp lại quá trình
```
Ví dụ:
```
count = 1
while count <= 5:
    print(count)
    count += 1
```
## **3\. Câu lệnh break:**
Câu lệnh break được sử dụng để thoát khỏi vòng lặp hiện tại và tiếp tục thực hiện các lệnh phía sau vòng lặp.  
Ví dụ:
```
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    if fruit == "banana":
        break
    print(fruit)
```
## **4\. Câu lệnh continue:**
Câu lệnh continue được sử dụng để bỏ qua các lệnh phía sau và bắt đầu vòng lặp mới.  
Ví dụ:
```
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    if fruit == "banana":
        continue
    print(fruit)
```
## **5\. Câu lệnh else trong vòng lặp:**
Câu lệnh else có thể được sử dụng trong vòng lặp để thực hiện một khối mã khi vòng lặp kết thúc mà không gặp bất kỳ câu lệnh break nào.  
Ví dụ:
```
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
else:
    print("Không còn phần tử trong danh sách.")
```
## **6\. Vòng lặp for với hàm range():**
Hàm range() được sử dụng để tạo một dãy số nguyên từ một giá trị bắt đầu đến một giá trị kết thúc (không bao gồm).  
Ví dụ:
```
for i in range(1, 6):
    print(i)
```
Đây là những vòng lặp cơ bản trong Python. Bạn có thể sử dụng chúng để lặp lại một khối mã nhiều lần và thực hiện các tác vụ lặp lại trong chương trình của mình.
