import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#00040c] text-whitetext-center py-3">
      <div>
        <p className="text-center text-xl">
          Zuni &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
