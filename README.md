## Giới thiệu  
Hệ thống quản lý task được xây dựng với mục tiêu tối ưu hóa việc quản lý tác vụ, sử dụng TypeScript để đảm bảo tính chặt chẽ và dễ bảo trì. Dự án này bao gồm:  
- **Quản lý Task**: Thêm, sửa, xóa task.  
- **Phân công User**: Gán hoặc hủy gán user cho task.  

---

## Cấu trúc dự án  

- **`interfaces/`**:  
  Chứa định nghĩa các kiểu dữ liệu sử dụng trong toàn dự án (Task, User).  
- **`storage/`**:  
  Chứa các lớp lưu trữ (JSON Storage) cho Task và User.  
- **`services/`**:  
  Xử lý logic ứng dụng, như thêm/sửa/xóa task hoặc user.  
- **`data/`**:  
  Chứa file JSON lưu dữ liệu User và Task.  
- **`app.ts`**:  
  Entry point của ứng dụng, nơi tích hợp tất cả các thành phần và khởi chạy hệ thống.  

## Cách chạy ứng dụng
- Cài đặt TypeScript: npm install -g typescript
biên dịch sang js:tsc
node dist/app.js để chạy terminal 
- hoặc:
run node client/server.js
live server client/index.html

## Các kiến thức TypeScript được áp dụng
- Interface
Interface được sử dụng để định nghĩa cấu trúc dữ liệu rõ ràng cho Task và User.
- Module và Export/Import
Chia nhỏ code thành các module giúp dễ quản lý và tái sử dụng.
- Optional Properties
Dùng ? để đánh dấu thuộc tính không bắt buộc.
