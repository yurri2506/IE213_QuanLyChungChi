import React from 'react';
import HolderSidebar from './HolderSidebar.js';
import PageHeader from '../PageHeader.js';

const NavigationHolder = ({ children }) => {
  return (
    <div className="flex h-screen font-adminFont">
      <div className='flex w-full'>
        <HolderSidebar />
        <PageHeader />        
        <main className="main-content w-full ml-48 mt-[64px] overflow-y-auto h-[calc(100%-64px)] ">{children}</main>
      </div>
    </div>
  );
};

export default NavigationHolder;
