import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/routes.js";
import RequireAuth from "./pages/requireAuth.js";
import Login from "./pages/login.js"; // 👈 import riêng login
import Home from "./pages/home.js";
import Features from "./pages/features.js";
import About from "./pages/about.js";
import Contact from "./pages/contact.js";
import SignUp from "./pages/signUp/index.js";

function App() {
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
