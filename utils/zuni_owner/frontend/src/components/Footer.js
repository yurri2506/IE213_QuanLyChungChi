import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0">DID Registry &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
