---
title: "[PYTHON CẤP TỐC #10] Phạm vi truy cập thuộc tính và phương thức trong Python OOP"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "expvn"
  - "hoc-python"
  - "pham-vi-truy-cap-thuoc-tinh-va-phuong-thuc-trong-python"
  - "python-co-ban"
coverImage: "Python-la-gi.png"
---
Trong lập trình hướng đối tượng (OOP) trong Python, phạm vi truy cập thuộc tính và phương thức quyết định việc truy cập và sử dụng chúng từ bên trong hoặc bên ngoài các lớp.
## **1\. Public**
Các thuộc tính và phương thức công khai có thể truy cập từ bất kỳ đâu trong chương trình, bao gồm cả từ bên trong và bên ngoài lớp. Để khai báo một thuộc tính hoặc phương thức công khai, không cần sử dụng bất kỳ dấu gạch dưới nào. Ví dụ:
```
class Person:
    def __init__(self, name):
        self.name = name
    def greet(self):
        print(f"Hello, my name is {self.name}")
person = Person("Alice")
print(person.name)  # Kết quả: Alice
person.greet()  # Kết quả: Hello, my name is Alice
```
## **2\. Protected**
Các thuộc tính và phương thức được bảo vệ có thể truy cập từ bên trong lớp và các lớp con của nó. Để khai báo một thuộc tính hoặc phương thức bảo vệ, sử dụng dấu gạch dưới đơn (\_) trước tên thuộc tính hoặc phương thức. Tuy nhiên, đây chỉ là một quy ước và Python không ngăn chặn truy cập từ bên ngoài lớp. Ví dụ:
```
class Person:
    def __init__(self, name):
        self._name = name
    def _protected_method(self):
        print("This is a protected method")
class Employee(Person):
    def __init__(self, name, salary):
        super().__init__(name)
        self._salary = salary
employee = Employee("Bob", 5000)
print(employee._name)  # Kết quả: Bob
employee._protected_method()  # Kết quả: This is a protected method
```
## **3\. Private**
Các thuộc tính và phương thức riêng tư chỉ có thể truy cập từ bên trong lớp đó và không thể truy cập trực tiếp từ bên ngoài. Để khai báo một thuộc tính hoặc phương thức riêng tư, sử dụng dấu gạch dưới kép (\_\_) trước tên thuộc tính hoặc phương thức. Tuy nhiên, Python thực hiện một quá trình "name mangling" để thay đổi tên thực sự của thuộc tính hoặc phương thức. Mặc dù không thể truy cập trực tiếp, bạn vẫn có thể truy cập thông qua tên được thay đổi. Ví dụ:
```
class Foo:
    # Khai báo thuộc tính ở chuẩn private
    __name = "Foo"
    # Khai báo phương thức ở chuẩn private
    def __getName(self):
        # gọi thành phần trong class
        print(self.__name)
    # khai báo một phương thức ở dạng public để gọi thành phần private
    def get(self):
        self.__getName()
# gọi thành phần ngoài class
print(Foo().__name) # 'Foo' object has no attribute '__name'
Foo().__getName() # 'Foo' object has no attribute '__getName'
Foo().get() # Foo
class Bar(Foo):
    def getNameinFoo(self):
        self.__getName()
#test
Bar().getNameinFoo() # 'Bar' object has no attribute '_Bar__getName'
```
Lưu ý rằng việc sử dụng các phạm vi truy cập là để đảm bảo tính đóng gói và bảo mật trong lập trình hướng đối tượng. Tuy nhiên, Python không áp dụng một cách nghiêm ngặt quyền truy cập và tất cả các thuộc tính và phương thức vẫn có thể truy cập từ bên ngoài lớp nếu được gọi theo cú pháp chính xác.
