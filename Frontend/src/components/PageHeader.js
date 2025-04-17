import React from "react";

const PageHeader = () => {  
    return (
        <header className="header bg-white fixed top-0 w-full h-16 flex justify-between items-center p-5 border-b border-gray-300">
            <h1 className="text-2xl text-left font-bold  z-50">
                ZUNI CLIENT
            </h1>
            <div className="flex items-center space-x-1">
                <div>Hello, <span className="font-bold">Holder</span>  </div>
                <img src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg" alt="Avatar" className="avatar w-10 h-10 rounded-full mr-2 border-2" />
            </div>            
        </header>
    );
};

export default PageHeader;
