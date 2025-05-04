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

### Các bước cài đặt

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
MONGO_DB = 
JWT_SECRET=
REFRESH_TOKEN_SECRET=
RPC_URL = 
REGISTRYDID_ADDRESS = 
VERIFICATIONCENTER_ADDRESS = 
```

- Tạo file `.env` trong thư mục Frontend với các biến môi trường cần thiết:

```
REACT_APP_API_URL = http://localhost:3001/api
REACT_APP_REGISTRYDID_ADDRESS = 
REACT_APP_VERIFYCATIONCENTER_ADDRESS = 
REACT_APP_NETWORK_NAME=
REACT_APP_RPC_URL=
REACT_APP_BLOCK_EXPLORER=
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

6. **Truy cập ứng dụng**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Lưu ý

- Đảm bảo MongoDB đã được cài đặt và chạy trên máy local
- Các biến môi trường cần được cấu hình đúng trước khi chạy ứng dụng
- Để sử dụng các tính năng blockchain, cần cài đặt và cấu hình thêm các công cụ liên quan đến zk-SNARK
