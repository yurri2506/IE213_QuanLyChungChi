import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice.js";

function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Xóa accessToken và refreshToken từ localStorage
    localStorage.removeItem("access_token");

    // Xóa toàn bộ cookie bằng cách đặt thời gian hết hạn trong quá khứ và không chỉ định domain
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    });
    console.log(document.cookie);
    // Dispatch action đăng xuất
    dispatch(logout());

    // Điều hướng về trang chủ
    navigate("/");
  }, [dispatch, navigate]);

  return null;
}

export default LogoutPage;
