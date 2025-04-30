import React, {useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/routes.js";
import RequireAuth from "./pages/requireAuth.js";
import Login from "./pages/login.js"; // 👈 import riêng login
import Home from "./pages/home.js";
import Features from "./pages/features.js";
import About from "./pages/about.js";
import Contact from "./pages/contact.js";
import SignUp from "./pages/signUp/index.js";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { logout, resetUser, updateUser } from "./redux/slices/userSlice.js";
import { getUserDetails, ensureValidToken } from "./services/apiAuth.js";
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        // Lấy refreshToken từ cookies
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
          dispatch(resetUser());
          return;
        }
  
        // Giải mã refreshToken để lấy thông tin expiration
        const decodedRefreshToken = JSON.parse(atob(refreshToken.split(".")[1]));
        const currentTime = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
  
        // Kiểm tra xem refreshToken có hết hạn không
        if (decodedRefreshToken.exp < currentTime) {
          dispatch(logout());
          // navigate('/sign-in')
          return;
        }

        const token = await ensureValidToken(dispatch, resetUser, refreshToken); // Kiểm tra và làm mới accessToken nếu cần
        if (token) { console.log(token); }
        // Sau khi có accessToken hợp lệ, lấy thông tin người dùng
        const decoded = JSON.parse(atob(refreshToken.split(".")[1]));
        if (decoded?.id) {
          const userDetails = await getUserDetails(decoded.id, token, decoded.role);
          dispatch(updateUser(userDetails));
        }
      } catch (error) {
        console.error("Error loading user details:", error);
      } finally {
        setIsLoading(false); // Đảm bảo kết thúc quá trình tải
      }
    };

    loadUserDetails();
  
    // Thiết lập lại kiểm tra mỗi 5 phút
    const interval = setInterval(() => {
      loadUserDetails();
    }, 5 * 60 * 1000); // Kiểm tra và làm mới mỗi 5 phút
  
    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [dispatch, resetUser]);

  return (
    <div style={{ overflow: "hidden" }}>
      <Router>
        <Routes>
          {/* Route công khai */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Các route cần xác thực */}
          {routes
            .filter(
              (route) =>
                route.path !== "/login" ||
                route.path !== "/" ||
                route.path !== "/signup" ||
                route.path !== "/features" ||
                route.path !== "/about" ||
                route.path !== "/contact"
            )
            .map((route) => {
              const Page = route.page;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <RequireAuth>
                      <Page />
                    </RequireAuth>
                  }
                />
              );
            })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
