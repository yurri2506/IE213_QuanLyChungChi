import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/home.js";
import HomeIssuer from "../pages/issuer/ShowDegree.js";
import Login from "../pages/login.js";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/issuer" element={<HomeIssuer />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;
