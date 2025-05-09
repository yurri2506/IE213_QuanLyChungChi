# [IE213.P21.Group100] - ĐỒ ÁN XÂY DỰNG HỆ THỐNG XÁC THỰC VĂN BẰNG CHỨNG CHỈ ÁP DỤNG CÔNG NGHỆ BLOCKCHAIN

- Trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh (ĐHQG-HCM)
- Khoa: Khoa học và Kỹ thuật Thông tin (KH&KTTT)
- GVHD: ThS. Võ Tấn Khoa
- Nhóm sinh viên thực hiện: Nhóm 100

## Danh sách thành viên

| STT |        Họ tên         |   MSSV    |   Chức vụ   |
| :-: | :-------------------: | :-------: | :---------: |
| 1.  |    Thạch Minh Luân    | 22520827  | Nhóm trưởng |
| 2.  | Nguyễn Lê Thanh Huyền | 225220590 | Thành viên  |
| 3.  |     Cao Quốc Kiệt     | 22520714  | Thành viên  |
| 4.  |      Lê Ngọc Lan      | 22520749  | Thành viên  |
| 5.  |   Đỗ Nguyên Phương    | 22521159  | Thành viên  |

## Công nghệ sử dụng

- [Node.js] - Xử lý API, Back-end
- [React.js] - Font-end
- [Express] - Framework nằm trên chức năng máy chủ web của NodeJS
- [MongoDB Compass] - Cung cấp giao diện xem cơ sở dữ liệu MongoDB
- [MongoDB] - Hệ quản trị cơ sở dữ liệu phi quan hệ sử dụng để lưu trữ dữ liệu cho trang web
- [HTML-CSS-JS] - Bộ ba công nghệ web, hiện thức hóa giao diện, dùng thêm bản mở rộng SCSS
- [zk-SNARK] - Tạo proof
- [Docker] - Containerization platform

## Mô hình kiến trúc hệ thống

![image](https://github.com/user-attachments/assets/6bfc0d84-d1f0-4282-9a29-46fbb0bd5a61)

### Các thành phần hệ thống

-	Tổ chức phát hành (Issuer): Là đơn vị chịu trách nhiệm tạo ra thông tin chứng chỉ có thể xác minh (verifiable credential) và cung cấp các chứng chỉ đó cho sinh viên – những người sẽ là chủ sở hữu.
-	Chủ sở hữu (Holder): Là một thực thể nắm giữ một hoặc nhiều chứng chỉ có thể xác minh và có khả năng tạo ra các bản trình bày (presentations) từ các chứng chỉ này.
-	Bên xác minh (Verifier): Là đơn vị hoặc cá nhân tiếp nhận các bản trình bày do người sở hữu cung cấp và thực hiện xác minh tính hợp lệ của chúng bằng các bằng chứng được tạo ra từ công nghệ ZKP.
-	Hợp đồng thông minh đăng ký DID (DIDRegistry): Đây là hợp đồng được sử dụng để đăng ký danh tính phi tập trung (DID) cho từng cá nhân. Nhằm đảm bảo tính chính xác và minh bạch của dữ liệu chứng chỉ.
-	Hợp đồng thông minh xác minh tuyên bố (VerificationCenter): Hợp đồng này có nhiệm vụ kiểm tra tính hợp lệ của các tuyên bố do người sở hữu tạo ra, dựa trên bằng chứng không tiết lộ (ZKP).

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- MongoDB
- npm hoặc yarn
- Docker (cho phương pháp cài đặt Docker)

### Phương pháp 1: Cài đặt thông thường

1. **Clone repository**

```bash
git clone https://github.com/yurri2506/IE213_QuanLyChungChi.git
cd IE213_QuanLyChungChi
```

2. **Cài đặt Backend**

```bash
cd Backend
npm install
```

3. **Cài đặt Frontend**

```bash
cd ../Frontend
npm install
```

4. **Cấu hình môi trường**

- Tạo file `.env` trong thư mục Backend với các biến môi trường cần thiết:

```
PORT = 3001
MONGO_DB = # Chuỗi kết nối đến cơ sở dữ liệu MongoDB
JWT_SECRET= # Khóa bí mật dùng để ký JWT (JSON Web Token)
REFRESH_TOKEN_SECRET= # Khóa bí mật dùng để tạo refresh token
RPC_URL = # URL của node blockchain để tương tác với smart contract
REGISTRYDID_ADDRESS = # Địa chỉ smart contract của Registry DID
VERIFICATIONCENTER_ADDRESS = # Địa chỉ smart contract của Verification Center
```

- Tạo file `.env` trong thư mục Frontend với các biến môi trường cần thiết:

```
REACT_APP_API_URL = # URL của API backend
REACT_APP_REGISTRYDID_ADDRESS =  # Địa chỉ smart contract của Registry DID
REACT_APP_VERIFYCATIONCENTER_ADDRESS = # Địa chỉ smart contract của Verification Center
REACT_APP_NETWORK_NAME= # Tên mạng blockchain đang sử dụng
REACT_APP_RPC_URL= # URL của node RPC để tương tác với blockchain
REACT_APP_BLOCK_EXPLORER= # URL của block explorer để xem giao dịch
```

5. **Khởi chạy ứng dụng**

- **Backend**:
```bash
cd Backend
npm run dev
```

- **Frontend** (trong terminal mới):
```bash
cd Frontend
npm start
```

### Phương pháp 2: Cài đặt với Docker

1. **Clone repository**
```bash
git clone https://github.com/yurri2506/IE213_QuanLyChungChi.git
cd IE213_QuanLyChungChi
```

2. **Cấu hình môi trường**
- Tạo các file `.env` như hướng dẫn ở trên

3. **Build và chạy Backend với Docker**
```bash
cd Backend
docker build -t backend .
docker run -p 3001:3001 --env-file .env backend
```

4. **Cài đặt và chạy Frontend**
```bash
cd ../Frontend
npm install
npm start
```

### Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Lưu ý

- Đảm bảo MongoDB đã được cài đặt và chạy trên máy local
- Các biến môi trường cần được cấu hình đúng trước khi chạy ứng dụng
- Để sử dụng các tính năng blockchain, cần cài đặt và cấu hình thêm các công cụ liên quan đến zk-SNARK
- Khi sử dụng Docker, đảm bảo Docker Desktop đã được cài đặt và đang chạy
- Không được có khoảng trắng xung quanh dấu '=' trong file .env

### Các lệnh Docker hữu ích

```bash
# Xem container đang chạy
docker ps

# Dừng container
docker stop <container_id>

# Xem logs
docker logs <container_id>

# Xóa container
docker rm <container_id>

# Xóa image
docker rmi backend
```
