import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import WaitingList from "./pages/WaitingList";
import IssuerDetails from "./pages/IssuerDetails";
import RemoveIssuer from "./pages/RemoveIssuer";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/waiting-list" element={<WaitingList />} />
            <Route path="/issuer/:did" element={<IssuerDetails />} />
            <Route path="/remove-issuer" element={<RemoveIssuer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
