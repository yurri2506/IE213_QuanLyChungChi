import React, { useState } from "react";
import PageHeader from "../PageHeader.js";
import IssuerSidebar from "./IssuerSidebar.js";

const NavigationIssuer = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-adminFont">
      <div className="flex w-full">
        <IssuerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <PageHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="main-content w-full mt-[64px] overflow-y-auto h-[calc(100%-64px)] ml-0 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavigationIssuer;
