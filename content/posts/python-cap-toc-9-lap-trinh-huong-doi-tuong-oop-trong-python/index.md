---
title: "[PYTHON CẤP TỐC #9] Lập trình hướng đối tượng (OOP) trong Python"
template: post
date: 2023-06-26 09:00
category: develop
tags: 
  - "expvn"
  - "huong-doi-tuong-trong-python"
  - "lap-trinh-python"
  - "python-co-ban"
coverImage: "Python-la-gi.png"
---
## **1\. Lớp và Đối tượng**
- Để tạo một lớp trong Python, bạn sử dụng từ khóa `class` và sau đó là tên lớp. Ví dụ:
```
class Dog:
    pass
```
- Để tạo một đối tượng từ lớp, bạn sử dụng cú pháp `tên_lớp()`. Ví dụ:
```
my_dog = Dog()
```
**2\. Thuộc tính và Phương thức**
- Thuộc tính là các biến được liên kết với một đối tượng. Bạn có thể định nghĩa thuộc tính trong phương thức khởi tạo của lớp. Ví dụ:
```
class Dog:
    def __init__(self, name):
        self.name = name
my_dog = Dog("Buddy")
print(my_dog.name)  # Kết quả: Buddy
```
- Phương thức là các hàm được định nghĩa bên trong lớp và có thể được gọi trên đối tượng của lớp đó. Ví dụ:
```
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        print("Woof!")
my_dog = Dog("Buddy")
my_dog.bark()  # Kết quả: Woof!
```
## **3\. Kế thừa**
- Kế thừa cho phép bạn tạo ra một lớp mới dựa trên một lớp hiện có và sử dụng lại các thuộc tính và phương thức của lớp đó. Ví dụ:
```
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        print("The animal makes a sound.")
class Dog(Animal):
    def bark(self):
        print("Woof!")
my_dog = Dog("Buddy")
my_dog.speak()  # Kết quả: The animal makes a sound.
my_dog.bark()  # Kết quả: Woof!
```
## **4\. Đa hình**
- Đa hình cho phép các đối tượng thuộc các lớp khác nhau có thể được xử lý bằng cách sử dụng các phương thức có cùng tên. Ví dụ:
```
class Animal:
    def speak(self):
        print("The animal makes a sound.")
class Dog(Animal):
    def speak(self):
        print("Woof!")
class Cat(Animal):
    def speak(self):
        print("Meow!")
def make_animal_speak(animal):
    animal.speak()
my_animal = Animal()
my_dog = Dog()
my_cat = Cat()
make_animal_speak(my_animal)  # Kết quả: The animal makes a sound.
make_animal_speak(my_dog)  # Kết quả: Woof!
make_animal_speak(my_cat)  # Kết quả: Meow!
```
## **5\. Đóng gói, bảo vệ và kế thừa đa cấp**
- Trong Python, các thuộc tính và phương thức có thể được gắn các mức độ truy cập khác nhau để đảm bảo tính đóng gói và bảo vệ dữ liệu của lớp. Ví dụ:
```
class Person:
    def __init__(self, name, age):
        self._name = name  # Mức truy cập bảo vệ (_)
        self.__age = age  # Mức truy cập đóng gói (__)        
    def display_info(self):
        print(f"Name: {self._name}, Age: {self.__age}")
class Student(Person):
    def display_info(self):
        print(f"Student Name: {self._name}, Student Age: {self.__age}")
person = Person("Alice", 25)
person.display_info()  # Kết quả: Name: Alice, Age: 25
student = Student("Bob", 20)
student.display_info()  # Kết quả: Student Name: Bob, Student Age: 20
```
## **6\. Phương thức tĩnh và biến lớp**
- Phương thức tĩnh là các phương thức thuộc về lớp chứ không phải đối tượng. Bạn có thể gọi phương thức tĩnh mà không cần tạo đối tượng từ lớp. Ví dụ:
```
class MathUtils:
    @staticmethod
    def add_numbers(a, b):
        return a + b
result = MathUtils.add_numbers(2, 3)
print(result)  # Kết quả: 5
```
- Biến lớp là các biến được chia sẻ giữa tất cả các đối tượng thuộc lớp đó. Bạn có thể truy cập biến lớp thông qua tên lớp hoặc từ một đối tượng thuộc lớp đó. Ví dụ:
```
class Car:
    wheels = 4
my_car = Car()
print(my_car.wheels)  # Kết quả: 4
print(Car.wheels)  # Kết quả: 4
```
Trên đây là một hướng dẫn tổng quan về lập trình hướng đối tượng trong Python với các ví dụ ngắn gọn và dễ hiểu. Bạn có thể áp dụng các khái niệm này để xây dựng các ứng dụng phức tạp hơn và tận dụng được tính linh hoạt của lập trình hướng đối tượng trong Python.
* * *
**self**: self là một tham số đặc biệt được sử dụng trong các phương thức của lớp. Nó tham chiếu đến đối tượng hiện tại được tạo từ lớp đó. Khi bạn gọi một phương thức trên một đối tượng, self sẽ tự động truyền vào phương thức đó để đại diện cho đối tượng đó. Ví dụ:
```
class food():
 
# init method or constructor
def __init__(self, fruit, color):
self.fruit = fruit
self.color = color
 
def show(self):
print("Fruit is", self.fruit)
print("Color is", self.color )
 
apple = food("apple", "red")
grapes = food("grapes", "green")
 
apple.show()
grapes.show()
```
Kết quả:
```
Fruit is apple
Color is red
Fruit is grapes
Color is green
```
