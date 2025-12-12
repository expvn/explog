---
title: "Regular Expression: Các ký tự, ký hiệu, ví dụ đơn giản và bài tập"
template: post
date: 2023-06-25 09:00
category: develop
tags: 
  - "regex"
  - "regular-expression"
coverImage: "coderpad-regex-the-complete-guide.jpg"
---
Danh sách các từ khóa và ký hiệu trong Regex:
# **1\. Ký hiệu cơ bản**
`.`: Khớp với bất kỳ ký tự nào trừ ký tự xuống dòng.  
Ví dụ: `"a.b"` khớp với "aab", "abb", "acb", v.v.
`\d`: Khớp với chữ số (0-9).  
Ví dụ: `"\d+"` khớp với "123", "456", "789", v.v.
`\D`: Khớp với bất kỳ ký tự nào không phải là chữ số.  
Ví dụ: `"\D+"` khớp với "abc", "XYZ", "@#$", v.v.
`\w`: Khớp với chữ cái và chữ số (a-z, A-Z, 0-9) và gạch dưới (\_).  
Ví dụ: `"\w+"` khớp với "hello", "world", "123", v.v.
`\W`: Khớp với bất kỳ ký tự nào không phải là chữ cái, chữ số hoặc gạch dưới.  
Ví dụ: `"\W+"` khớp với "@#$%", "&\*()", v.v.
`\s`: Khớp với khoảng trắng, ký tự tab và ký tự xuống dòng.  
Ví dụ: `"\W+"` khớp với "@#$%", "&\*()", v.v.
`\S`: Khớp với bất kỳ ký tự nào không phải là khoảng trắng, ký tự tab hoặc ký tự xuống dòng.  
Ví dụ: `"\S+"` khớp với các ký tự không phải khoảng trắng.
# **2\. Ký hiệu kết hợp**
`|`: Khớp một trong các mẫu được liệt kê.  
Ví dụ: `"a|b"` khớp với "a" hoặc "b".
`[]`: Khớp bất kỳ ký tự nào trong dấu ngoặc vuông.  
Ví dụ: `"[aeiou]"` khớp với các ký tự nguyên âm "a", "e", "i", "o", "u".
`[^]`: Khớp bất kỳ ký tự nào không nằm trong dấu ngoặc vuông.  
Ví dụ: `"[^aeiou]"` khớp với các ký tự không phải nguyên âm.
`()`: Nhóm các ký tự lại với nhau và ghi nhớ kết quả.  
Ví dụ: `"a(bc)+"` khớp với "abc", "abcbc", "abcbcbc", v.v.
# 3\. Ký tự lặp
`*`: Khớp 0 hoặc nhiều lần.  
Ví dụ: `"a*"` khớp với "", "a", "aa", "aaa", v.v.
`+`: Khớp 1 hoặc nhiều lần.  
Ví dụ: `"a+"` khớp với "a", "aa", "aaa", v.v.
`?`: Khớp 0 hoặc 1 lần.  
Ví dụ: `"a?"` khớp với "" hoặc "a".
`{n}`: Khớp chính xác n lần.  
Ví dụ: `"a{3}"` khớp với "aaa".
`{n, m}`: Khớp từ n đến m lần.  
Ví dụ: `"a{2,4}"` khớp với "aa", "aaa", "aaaa".
# 4\. Lý tự đặc biệt
`\`: Sử dụng để thoát ký tự đặc biệt.  
Ví dụ: `"\\d"` khớp với ký tự "" và "d".
`.` (dot) có thể được sử dụng để khớp bất kỳ ký tự nào, nhưng nếu bạn muốn khớp với ký tự `.` thực tế, bạn cần sử dụng ký tự thoát `\.`.  
Ví dụ: `"a\.b"` khớp với "a.b".
# 5\. Ký tự bắt đầu và kết thúc
`^`: Khớp với chuỗi bắt đầu.  
Ví dụ: `"^abc"` khớp với "abc" ở đầu chuỗi.
`$`: Khớp với chuỗi kết thúc.  
Ví dụ: `"abc$"` khớp với "abc" ở cuối chuỗi.
`\b`: Khớp với ranh giới từ.  
Ví dụ: `"\bword\b"` khớp với từ "word" độc lập.
`\B`: Khớp với các vị trí không phải là ranh giới từ.  
Ví dụ: `"\Bword\B"` khớp với từ "word" không độc lập.
# 6\. Các từ khóa và biểu thức
`(?:pattern)`: Không ghi nhớ kết quả của nhóm.  
Ví dụ: `(?:ab)+` khớp với một chuỗi "ab" lặp lại một hoặc nhiều lần. Chuỗi "ababab" sẽ khớp với biểu thức này. Kết quả sẽ không lưu trữ giá trị nhóm của mỗi "ab" trong chuỗi.
`(?=pattern)`: Positive lookahead - Khớp với mẫu nếu nó tiếp theo là mẫu pattern.  
Ví dụ: `q(?=u)` khớp với "q" chỉ khi sau nó là "u". Chuỗi "quit" sẽ không khớp với biểu thức này. Chuỗi "queue" sẽ khớp với biểu thức này, vì sau "q" là "u".
`(?!pattern)`: Negative lookahead - Khớp với mẫu nếu nó tiếp theo không phải là mẫu pattern.  
Ví dụ: `q(?!u)` khớp với "q" chỉ khi sau nó không phải là "u". Chuỗi "quit" sẽ không khớp với biểu thức này. Chuỗi "queue" sẽ không khớp với biểu thức này, vì sau "q" là "u".
`(?<=pattern)`: Positive lookbehind - Khớp với mẫu nếu nó trước đó là mẫu pattern.  
Ví dụ: `(?<=a)b` khớp với "b" chỉ khi trước nó là "a". Chuỗi "abc" sẽ không khớp với biểu thức này. Chuỗi "bac" sẽ khớp với biểu thức này, vì trước "b" là "a".
`(?<!pattern)`: Negative lookbehind - Khớp với mẫu nếu nó trước đó không phải là mẫu pattern.  
Ví dụ: `(?<!a)b` khớp với "b" chỉ khi trước nó không phải là "a". Chuỗi "abc" sẽ không khớp với biểu thức này. Chuỗi "dbc" sẽ khớp với biểu thức này, vì trước "b" không phải là "a".
Đây chỉ là một số ký hiệu trong Regex. Regex rất mạnh mẽ và còn nhiều tính năng khác nhau để xử lý các tình huống phức tạp. Bạn có thể tìm hiểu thêm trong tài liệu chính thức của ngôn ngữ hoặc tham khảo các nguồn tài liệu và hướng dẫn trực tuyến để nắm vững Regex.
# **Dưới đây là 5 bài tập Regex từ cơ bản đến phức tạp**
1. **Bài tập cơ bản: Kiểm tra chuỗi có phải là một số nguyên dương hay không.**
    - Pattern: `^[1-9]\d*$`
    
    - Mô tả: Chuỗi bắt đầu bằng một chữ số từ 1-9, sau đó có thể có bất kỳ số chữ số nào (từ 0-9).
3. **Bài tập tìm kiếm: Tìm các từ trong một đoạn văn bắt đầu bằng chữ hoa.**
    - Pattern: `\b[A-Z]\w*\b`
    
    - Mô tả: Tìm các từ đứng độc lập trong đoạn văn mà bắt đầu bằng một chữ hoa, sau đó có thể chứa bất kỳ ký tự word nào (chữ hoa, chữ thường, chữ số) và kết thúc bằng một ký tự không phải word.
5. **Bài tập kiểm tra email: Kiểm tra tính hợp lệ của một địa chỉ email.**
    - Pattern: `^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$`
    
    - Mô tả: Kiểm tra xem chuỗi có phù hợp với cấu trúc một địa chỉ email hợp lệ hay không. Đây là một pattern đơn giản để kiểm tra và có thể không bắt được tất cả các trường hợp hợp lệ 100%.
7. **Bài tập ràng buộc mật khẩu: Kiểm tra tính hợp lệ của một mật khẩu theo các quy tắc nhất định.**
    - Pattern: `^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=])(?!.*\s).{8,}$`
    
    - Mô tả: Kiểm tra xem chuỗi có đáp ứng các yêu cầu sau không:
        - Ít nhất 8 ký tự.
        
        - Bao gồm ít nhất một chữ cái viết hoa và một chữ cái viết thường.
        
        - Bao gồm ít nhất một chữ số.
        
        - Bao gồm ít nhất một ký tự đặc biệt từ tập hợp \[@#$%^&+=\].
        
        - Không chứa khoảng trắng.
9. **Bài tập tách lấy tên miền từ địa chỉ URL.**
    - Pattern: `(?<=://)([a-zA-Z0-9.-]+)`
    
    - Mô tả: Tìm và trích xuất phần tên miền từ một địa chỉ URL. Pattern này sử dụng positive lookbehind `(?<=://)` để xác định vị trí sau dấu `://` và sau đó tìm các ký tự word và ký tự đặc biệt trong tên miền.
Lưu ý rằng mỗi ngôn ngữ và thư viện hỗ trợ Regex có thể có cú pháp và tính năng khác nhau. Vì vậy, khi sử dụng Regex trong ngôn ngữ cụ thể, hãy tham khảo tài liệu chính thức và tìm hiểu cú pháp đúng cho ngôn ngữ đó.
