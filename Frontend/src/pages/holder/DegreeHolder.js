import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { FaAward } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { Helmet } from "react-helmet";
import { getDegreeInfo } from "../../services/apiHolder.js";

const DegreeCard = ({ name, degree }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`detail`, { state: { degree } });
  };

  return (
    <div
      className="border-2 border-blue-700 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <FaAward className="text-blue-700 text-xl" />
        <span className="text-sm font-medium text-gray-800">{name}</span>
        <HiChevronRight className="text-blue-700 text-xl ml-auto" />
      </div>
    </div>
  );
};

const DegreeHolder = () => {
  const [degreeInfo, setDegreeInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDegreeInfo = async () => {
      const response = await getDegreeInfo();
      if (response) {
        setDegreeInfo(response.data);
        console.log("Degree info:", response.data);
      } else {
        console.error("Error fetching degree info:", response.message);
      }
      setIsLoading(false);
    };
    fetchDegreeInfo();
  }, []);

  if (isLoading) {
    return (
      <NavigationHolder>
        <div className="flex justify-center items-center h-screen">
          <div className="loader" />
        </div>
      </NavigationHolder>
    );
  }

  return (
    <NavigationHolder>
      <Helmet>
        <title>Degrees</title>
      </Helmet>

      <div className="px-6 md:px-10 pt-10 min-h-[calc(100vh-64px)]">
        <h1 className="font-bold text-2xl mb-6">Your Degrees</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {degreeInfo.map((degree, index) => (
            <DegreeCard key={index} name="Bachelor of Degree" degree={degree} />
          ))}
        </div>
      </div>
    </NavigationHolder>
  );
};

export default DegreeHolder;
