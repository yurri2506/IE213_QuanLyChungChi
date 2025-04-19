import React from 'react';
import PageHeader from '../PageHeader.js';
import VerifierSidebar from './VerifierSidebar.js';

const NavigationVerifier = ({ children }) => {
  return (
    <div className="flex h-screen font-adminFont">
      <div className='flex w-full'>
        <VerifierSidebar /> 
        <PageHeader />        
        <main className="main-content w-full ml-48 mt-[64px] overflow-y-auto h-[calc(100%-64px)] ">{children}</main>
      </div>
    </div>
  );
};

export default NavigationVerifier;
