import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, navigate]);

  if (isLoading) return null;

  return (
    <>
      {location.pathname !== "/login" || location.pathname !== "/"}
      {children}
    </>
  );
};

export default RequireAuth;
