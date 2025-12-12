---
title: "[PYTHON CẤP TỐC #2] Các kiểu dữ liệu và cách gán kiểu dữ liệu trong Python"
template: post
date: 2023-06-14 09:00
category: develop
tags: 
  - "expvn-python"
  - "kieu-du-lieu-trong-python"
  - "python"
coverImage: "Python-la-gi.png"
---
## **1\. Các kiểu dữ liệu**
Python hỗ trợ nhiều kiểu dữ liệu khác nhau, bao gồm các kiểu dữ liệu số học, chuỗi, danh sách, bộ, tập hợp và boolean. Dưới đây là một số kiểu dữ liệu cơ bản trong Python:
- Kiểu số: int (số nguyên), float (số thực), complex (số phức).
- Kiểu chuỗi: str (chuỗi ký tự).
- Kiểu danh sách: list (danh sách các phần tử có thứ tự và có thể thay đổi).
- Kiểu bộ: tuple (danh sách các phần tử có thứ tự và không thể thay đổi).
- Kiểu tập hợp: set (danh sách các phần tử không có thứ tự và không thể lặp lại).
- Kiểu boolean: bool (giá trị đúng hoặc sai).  
    
Mỗi kiểu dữ liệu sẽ có các tính năng và phương thức riêng. Khi sử dụng một biến trong Python, bạn không cần khai báo kiểu dữ liệu trước. Python sẽ tự động nhận diện kiểu dữ liệu dựa trên giá trị được gán cho biến đó.
Để khởi tạo một biến trong Python, bạn có thể sử dụng dấu bằng (=) để gán giá trị cho biến đó. Ví dụ:
```
# khai báo biến x là số nguyên
x = 10 
# khai báo biến y là số thực
y = 3.14 
# khai báo biến z là chuỗi ký tự
z = "Hello, world!" 
# khai báo biến a là một danh sách các số nguyên
a = [1, 2, 3, 4, 5] 
# khai báo biến b là một bộ chứa các số thực
b = (1.0, 2.0, 3.0) 
# khai báo biến c là một tập hợp chứa các chuỗi ký tự
c = {"apple", "banana", "orange"} 
# khai báo biến d là một giá trị boolean
d = True
```
Ví dụ:
Bạn sử dụng đoạn code dưới đây:
```
x = 10
y = 3.14
kq = x + y
print(f'Tong = {kq}')
print(f'Loai = {type(x)}')
print(f'Loai = {type(y)}')
print(f'Loai = {type(kq)}')
```
![](image-15-1024x619.png)
Bạn có thể thấy, khi khai báo thì Python tự hiểu x là dạng số nguyên còn y là dạng số thực, Python cho phép cộng 2 số ở 2 kiểu dữ liệu này với nhau và ra kết quả là số thực.
## 2\. Cách gán
Trong Python, biến là một vật chứa giá trị có thể được sử dụng trong các tính toán và phép gán. Khi bạn khai báo một biến, Python sẽ tự động xác định kiểu dữ liệu của biến đó dựa trên giá trị được gán cho nó.
Để khai báo một biến trong Python, bạn chỉ cần gán giá trị cho tên biến. Ví dụ:
```
x = 5
y = "Hello, world!"
```
Trong ví dụ trên, biến `x` được khai báo là một số nguyên có giá trị là 5, và biến `y` được khai báo là một chuỗi ký tự có giá trị là "Hello, world!".
Nếu bạn muốn biết kiểu dữ liệu của một biến, bạn có thể sử dụng hàm `type()`. Ví dụ:
```
x = 5
y = "Hello, world!"
print(type(x)) # int
print(type(y)) # str
```
Bên cạnh đó, trong Python, bạn có thể gán nhiều giá trị cho nhiều biến cùng một lúc bằng cách sử dụng dấu phẩy (,). Ví dụ:
```
x, y, z = 1, 2, 3
```
Ví dụ trên, biến `x` được gán giá trị 1, biến `y` được gán giá trị 2 và biến `z` được gán giá trị 3.
Bạn cũng có thể gán cùng một giá trị cho nhiều biến bằng cách sử dụng dấu bằng (=). Ví dụ:
```
x = y = z = 0
```
Trong ví dụ trên, biến `x`, `y` và `z` được gán giá trị 0.
