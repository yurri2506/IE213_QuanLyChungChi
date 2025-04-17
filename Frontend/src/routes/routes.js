import { Route, Routes } from "react-router-dom";
import Login from "../pages/login.js";
import Home from "../pages/home.js";
import HomeIssuer from "../pages/issuer/ShowDegree.js";
import Features from "../pages/features.js";
import About from "../pages/about.js";
import Contact from "../pages/contact.js";
import Info from "../pages/holder/InfoHolder.js";
import DegreeHolder from "../pages/holder/DegreeHolder.js";
import DetailDegree from "../pages/holder/DetailDegree.js";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/issuer" element={<HomeIssuer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/info-holder" element={<Info />} />
      <Route path="/degree-holder" element={<DegreeHolder />} />
      <Route path="/degree-holder/detail" element={<DetailDegree />} />
    </Routes>
  );
};

export default Router;
