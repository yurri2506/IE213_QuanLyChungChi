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
import CreateProof from "../pages/holder/CreateProof.js";
import ChangePassword from "../pages/holder/ChangePassword.js";
import InfoVerifier from "../pages/verifier/InfoVerifier.js";
import Verified from "../pages/verifier/Verified.js";
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
      <Route path="/create-proof" element={<CreateProof />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/info-verifier" element={<InfoVerifier />} />
      <Route path="/submited-proofs" element={<Verified />} />{" "}
      {/* Redirect to Home for any other route */}
    </Routes>
  );
};

export default Router;
