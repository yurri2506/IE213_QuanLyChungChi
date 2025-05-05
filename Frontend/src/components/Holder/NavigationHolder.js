import React, { useState } from 'react';
import HolderSidebar from './HolderSidebar.js';
import PageHeader from '../PageHeader.js';

const NavigationHolder = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-adminFont">
      {/* Sidebar responsive */}
      <HolderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <PageHeader setIsSidebarOpen={setIsSidebarOpen} />
      <main className="main-content w-full mt-[64px] overflow-y-auto h-[calc(100%-64px)] ml-0 ">
        {children}
      </main>
    </div>
  );
};

export default NavigationHolder;
