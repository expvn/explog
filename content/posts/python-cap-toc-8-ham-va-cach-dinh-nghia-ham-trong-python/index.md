---
title: "[PYTHON CẤP TỐC #8] Hàm và cách định nghĩa hàm trong Python"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "dinh-nghia-ham"
  - "expvn"
  - "ham-trong-python"
  - "hoc-python"
  - "python-co-ban"
coverImage: "Python-la-gi.png"
---
Trong bài này, EXPVN sẽ hướng dẫn bạn về hàm và cách định nghĩa hàm nhé.
## **1\. Định nghĩa hàm**
Để định nghĩa một hàm trong Python, bạn sử dụng từ khóa `def` và sau đó là tên hàm, danh sách các tham số (nếu có) và dấu hai chấm. Ví dụ:
```
def greet():
    print("Hello, world!")
```
Trong ví dụ trên, chúng ta đã định nghĩa một hàm có tên là `greet()` mà in ra chuỗi "Hello, world!" khi được gọi.
## **2\. Gọi hàm**
Để gọi một hàm, bạn chỉ cần viết tên hàm theo sau là dấu ngoặc đơn `()`. Ví dụ:
```
greet()  # Kết quả: Hello, world!
```
## **3\. Tham số trong hàm**
Một hàm có thể nhận tham số, là các giá trị đầu vào mà bạn truyền cho hàm khi gọi nó. Ví dụ:
```
def greet(name):
    print("Hello,", name)
greet("Alice")  # Kết quả: Hello, Alice
```
Trong ví dụ trên, hàm `greet()` nhận một tham số `name` và in ra chuỗi "Hello," cùng với giá trị của `name` khi được gọi.
## **4\. Giá trị trả về**
Một hàm có thể trả về một giá trị bằng cách sử dụng từ khóa `return`. Ví dụ:
```
def add(a, b):
    return a + b
result = add(3, 4)
print(result)  # Kết quả: 7
```
Trong ví dụ trên, hàm `add()` nhận hai tham số `a` và `b`, và trả về tổng của chúng.
## **5\. Tham số mặc định**
Bạn có thể định nghĩa giá trị mặc định cho các tham số của hàm. Giá trị mặc định sẽ được sử dụng khi không có giá trị được truyền cho tham số tương ứng. Ví dụ:
```
def greet(name="world"):
    print("Hello,", name)
greet()       # Kết quả: Hello, world
greet("Alice")  # Kết quả: Hello, Alice
```
Trong ví dụ trên, hàm `greet()` có tham số `name` với giá trị mặc định là "world". Khi gọi hàm không truyền tham số, giá trị mặc định sẽ được sử dụng.
Vậy là trong bài viết này, bạn đã học cách định nghĩa hàm, gọi hàm, sử dụng tham số và giá trị trả về trong hàm. Hàm là một khái niệm quan trọng trong Python và giúp bạn tổ chức và tái sử dụng mã của mình một cách hiệu quả.
