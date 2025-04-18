import React from "react";  
import { useNavigate } from "react-router-dom";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { FaAward } from 'react-icons/fa';
import { HiChevronRight } from "react-icons/hi";
import { Helmet } from "react-helmet";

const DegreeCard = ({ name }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(`detail`);
    };
  
    return (
      <div
        className="border-2 border-blue-700 rounded-lg p-5 max-w-md hover:shadow-md transition cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <FaAward className="text-blue-700 text-xl" />
          <span className="text-sm font-medium text-gray-800">{name}</span>
          <HiChevronRight className="text-blue-700 text-xl" />
        </div>
      </div>
    );
  };
const DegreeHolder = () => {
    
    return (
        <NavigationHolder>
          <Helmet>
              <title>Danh sách văn bằng</title>
          </Helmet>
            <h1 className="font-bold text-2xl mt-10 ml-10 ">Your degrees</h1>
            <div className="holder-degree m-10 px-10 grid grid-cols-1 md:grid-cols-4 gap-10 ">
                <DegreeCard name="Bachelor of degree" />
                <DegreeCard name="Master of degree" />
                <DegreeCard name="Doctor of degree" />
                <DegreeCard name="PhD of degree" />
            </div> 
        </NavigationHolder>
    );
};

export default DegreeHolder;