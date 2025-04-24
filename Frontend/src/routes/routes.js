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
import InfoIssuer from "../pages/issuer/InfoIssuer.js";
import SignIn from "../pages/signIn/index.js";
export const routes = [
  {
    path: "/",
    page: Home,
  },
  {
    path: "/features",
    page: Features,
  },
  {
    path: "/about",
    page: About,
  },
  {
    path: "/contact",
    page: Contact,
  },
  {
    path: "/issuer",
    page: HomeIssuer,
  },
  {
    path: "/login",
    page: Login,
  },
  {
    path: "/info-holder",
    page: Info,
  },
  {
    path: "/info-issuer",
    page: InfoIssuer,
  },
  {
    path: "/degree-holder",
    page: DegreeHolder,
  },
  {
    path: "/degree-holder/detail",
    page: DetailDegree,
  },
  {
    path: "/create-proof",
    page: CreateProof,
  },
  {
    path: "/change-password",
    page: ChangePassword,
  },
  {
    path: "/info-verifier",
    page: InfoVerifier,
  },
  {
    path: "/submited-proofs",
    page: Verified,
  },
  {
    path: "/signin",
    page: SignIn,
  },
  // Redirect to Home for any other route
  {
    path: "*",
    page: Home,  // Redirect to Home
  }
];