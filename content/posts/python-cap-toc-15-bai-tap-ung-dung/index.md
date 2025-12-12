---
title: "[PYTHON CẤP TỐC #15] Bài tập ứng dụng"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "bai-tap-python"
  - "bai-tap-ung-dung-python-co-ban"
  - "expvn"
  - "python-cap-toc"
coverImage: "Python-la-gi.png"
---
Dưới đây là 10 bài tập thực hành Python cơ bản, có tính ứng dụng thực tế và mức độ khó từ đơn giản đến phức tạp. Bạn có thể thử giải và kiểm tra đáp án sau mỗi bài tập.
**Bài tập 1:** Tính tổng các số chẵn từ 1 đến n. Viết một chương trình Python nhận vào một số nguyên dương n và tính tổng các số chẵn từ 1 đến n.
Đáp án:
```
def sum_even_numbers(n):
    total = 0
    for i in range(2, n+1, 2):
        total += i
    return total
n = int(input("Nhập vào một số nguyên dương: "))
result = sum_even_numbers(n)
print("Tổng các số chẵn từ 1 đến", n, "là:", result)
```
**Bài tập 2:** Đảo ngược chuỗi. Viết một chương trình Python để đảo ngược một chuỗi được nhập từ người dùng.
Đáp án:
```
def reverse_string(input_string):
    return input_string[::-1]
string = input("Nhập vào một chuỗi: ")
reversed_string = reverse_string(string)
print("Chuỗi đảo ngược là:", reversed_string)
```
**Bài tập 3:** Kiểm tra số nguyên tố. Viết một chương trình Python nhận vào một số nguyên dương n và kiểm tra xem nó có phải là số nguyên tố hay không.
Đáp án:
```
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
n = int(input("Nhập vào một số nguyên dương: "))
if is_prime(n):
    print(n, "là số nguyên tố")
else:
    print(n, "không phải là số nguyên tố")
```
**Bài tập 4:** Đếm số lần xuất hiện của từng ký tự trong một chuỗi. Viết một chương trình Python nhận vào một chuỗi và đếm số lần xuất hiện của từng ký tự trong chuỗi đó.
Đáp án:
```
def count_characters(input_string):
    char_count = {}
    for char in input_string:
        char_count[char] = char_count.get(char, 0) + 1
    return char_count
string = input("Nhập vào một chuỗi: ")
result = count_characters(string)
print("Số lần xuất hiện của từng ký tự trong chuỗi:")
for char, count in result.items():
    print(char, ":", count)
```
**Bài tập 5:** Tìm số lớn nhất trong một danh sách. Viết một chương trình Python nhận vào một danh sách các số nguyên và tìm số lớn nhất trong danh sách đó.
Đáp án:
```
def find_max_number(numbers):
    max_number = float('-inf')
    for number in numbers:
        if number > max_number:
            max_number = number
    return max_number
numbers = [int(x) for x in input("Nhập vào các số nguyên, cách nhau bởi dấu cách: ").split()]
max_num = find_max_number(numbers)
print("Số lớn nhất trong danh sách là:", max_num)
```
**Bài tập 6:** Kiểm tra một chuỗi có phải là palindrome hay không. Viết một chương trình Python nhận vào một chuỗi và kiểm tra xem chuỗi đó có phải là palindrome hay không (chuỗi đọc xuôi hay đọc ngược đều giống nhau).
Đáp án:
```
def is_palindrome(input_string):
    return input_string == input_string[::-1]
string = input("Nhập vào một chuỗi: ")
if is_palindrome(string):
    print(string, "là một chuỗi palindrome")
else:
    print(string, "không phải là một chuỗi palindrome")
```
**Bài tập 7:** Đổi đơn vị nhiệt độ. Viết một chương trình Python nhận vào một giá trị nhiệt độ theo đơn vị Celsius và chuyển đổi thành Fahrenheit và Kelvin.
Đáp án:
```
def celsius_to_fahrenheit(celsius):
    return (celsius * 9/5) + 32
def celsius_to_kelvin(celsius):
    return celsius + 273.15
celsius = float(input("Nhập vào giá trị nhiệt độ (đơn vị Celsius): "))
fahrenheit = celsius_to_fahrenheit(celsius)
kelvin = celsius_to_kelvin(celsius)
print("Nhiệt độ Fahrenheit tương ứng:", fahrenheit)
print("Nhiệt độ Kelvin tương ứng:", kelvin)
```
**Bài tập 8:** Tính giai thừa của một số. Viết một chương trình Python nhận vào một số nguyên dương n và tính giai thừa của n (n!).
Đáp án:
```
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)
n = int(input("Nhập vào một số nguyên dương: "))
result = factorial(n)
print("Giai thừa của", n, "là:", result)
```
**Bài tập 9:** Kiểm tra chuỗi con. Viết một chương trình Python nhận vào một chuỗi và kiểm tra xem một chuỗi con cho trước có tồn tại trong chuỗi đó hay không.
Đáp án:
```
def check_substring(string, substring):
    if substring in string:
        return True
    else:
        return False
string = input("Nhập vào một chuỗi: ")
substring = input("Nhập vào một chuỗi con: ")
if check_substring(string, substring):
    print(substring, "tồn tại trong chuỗi", string)
else:
    print(substring, "không tồn tại trong chuỗi", string)
```
**Bài tập 10:** Đảo ngược danh sách. Viết một chương trình Python nhận vào một danh sách và đảo ngược thứ tự các phần tử trong danh sách đó.
Đáp án:
```
def reverse_list(input_list):
    return input_list[::-1]
numbers = [int(x) for x in input("Nhập vào các số nguyên, cách nhau bởi dấu cách: ").split()]
reversed_numbers = reverse_list(numbers)
print("Danh sách đảo ngược là:", reversed_numbers)
```
Hy vọng những bài tập trên sẽ giúp bạn ôn tập và ứng dụng các kiến thức Python cơ bản.
