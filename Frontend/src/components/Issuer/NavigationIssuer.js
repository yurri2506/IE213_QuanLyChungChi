import React from "react";
import PageHeader from "../PageHeader.js";
import IssuerSidebar from "./IssuerSidebar.js";

const NavigationIssuer = ({ children }) => {
  return (
    <div className="flex h-screen font-adminFont">
      <div className="flex w-full">
        <IssuerSidebar />
        <PageHeader />
        <main className="main-content w-full ml-48 mt-[64px] overflow-y-auto h-[calc(100%-64px)] ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavigationIssuer;
