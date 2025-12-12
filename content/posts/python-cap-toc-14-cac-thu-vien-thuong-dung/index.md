---
title: "[PYTHON CẤP TỐC #14] Các thư viện thường dùng"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "expvn"
  - "python-cap-toc"
  - "thu-vien-python"
coverImage: "Python-la-gi.png"
---
## 1\. **Thư viện `math`**
- Mô tả: Thư viện `math` cung cấp các hàm và phép toán số học.
- Ví dụ:
```
import math
# Tính căn bậc hai của một số
x = 16
square_root = math.sqrt(x)
print(square_root)
# Tính sin của một góc (đơn vị: radian)
angle = math.pi / 2
sine = math.sin(angle)
print(sine)
```
## **2\. Thư viện `random`**
- Mô tả: Thư viện `random` cung cấp các chức năng liên quan đến số ngẫu nhiên.
- Ví dụ:
```
import random
# Sinh số ngẫu nhiên trong khoảng [0, 1)
random_number = random.random()
print(random_number)
# Sinh số ngẫu nhiên trong khoảng [1, 10]
random_number = random.randint(1, 10)
print(random_number)
# Lấy ngẫu nhiên một phần tử từ danh sách
fruits = ["apple", "banana", "orange"]
random_fruit = random.choice(fruits)
print(random_fruit)
```
## **3\. Thư viện `datetime`**
- Mô tả: Thư viện `datetime` cung cấp các công cụ để làm việc với thời gian và ngày tháng.
- Ví dụ:
```
import datetime
# Lấy thời gian hiện tại
current_time = datetime.datetime.now()
print(current_time)
# Tạo một đối tượng ngày tháng
date = datetime.date(2023, 4, 23)
print(date)
# Tính khoảng thời gian giữa hai ngày
start_date = datetime.date(2023, 4, 20)
end_date = datetime.date(2023, 4, 25)
duration = end_date - start_date
print(duration.days)
```
## **4\. Thư viện `re`**
- Mô tả: Thư viện `re` cung cấp các chức năng liên quan đến biểu thức chính quy và xử lý chuỗi.
- Ví dụ:
```
import re
# Tìm kiếm một từ trong một chuỗi
text = "Hello, world!"
pattern = r"world"
match = re.search(pattern, text)
if match:
    print("Match found!")
# Tách chuỗi thành danh sách các từ
sentence = "This is a sentence."
words = re.split(r"\s", sentence)
print(words)
```
## **5\. Thư viện `json`**
- Mô tả: Thư viện `json` cung cấp các chức năng để làm việc với định dạng JSON.
- Ví dụ:
```
import json
# Chuyển đổi từ đối tượng Python sang JSON
data = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
json_data = json.dumps(data)
print(json_data)
# Chuyển đổi từ JSON sang đối tượng Python
json_data = '{"name": "John", "age": 30, "city": "New York"}'
data = json.loads(json_data)
print(data)
```
## **6\. Thư viện `numpy`**
- Mô tả: Thư viện `numpy` cung cấp hỗ trợ cho việc làm việc với mảng và ma trận nhiều chiều, cung cấp các phép toán số học và thống kê.
- Ví dụ:
```
import numpy as np
# Tạo một mảng numpy
arr = np.array([1, 2, 3, 4, 5])
# Thực hiện các phép toán trên mảng
print(arr.sum())  # Tính tổng các phần tử
print(arr.mean())  # Tính trung bình
print(arr.max())  # Tìm giá trị lớn nhất
```
## **7\. Thư viện `pandas`**
- Mô tả: Thư viện `pandas` cung cấp các cấu trúc dữ liệu và công cụ xử lý dữ liệu linh hoạt, phục vụ cho việc phân tích dữ liệu và xây dựng mô hình.
- Ví dụ:
```
import pandas as pd
# Tạo một DataFrame từ một dictionary
data = {
    'Name': ['John', 'Alice', 'Bob'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Paris']
}
df = pd.DataFrame(data)
# Hiển thị thông tin của DataFrame
print(df.head())  # Hiển thị 5 dòng đầu tiên
print(df.describe())  # Tổng quan dữ liệu
# Truy cập vào dữ liệu
print(df['Name'])  # Truy cập cột 'Name'
print(df.loc[0])  # Truy cập dòng đầu tiên
```
## **8\. Thư viện `request`**
- Mô tả: Thư viện `requests` cung cấp các chức năng để gửi các yêu cầu HTTP và xử lý phản hồi từ các API và trang web.
- Ví dụ:
```
import requests
# Gửi yêu cầu GET đến một API
response = requests.get('https://api.example.com/users')
# Kiểm tra mã trạng thái của phản hồi
if response.status_code == 200:
    data = response.json()  # Chuyển đổi phản hồi thành dạng JSON
    print(data)
else:
    print('Error:', response.status_code)
```
Có rất nhiều thư viện khác trong Python phục vụ cho nhiều mục đích khác nhau. Tùy thuộc vào nhu cầu của bạn, hãy tìm hiểu và khám phá các thư viện phù hợp để làm việc hiệu quả trong dự án của mình.
