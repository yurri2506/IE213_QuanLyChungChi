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
          <div className="loader"></div>
        </div>
      </NavigationHolder>
    );
  }
  return (
    <NavigationHolder>
      <Helmet>
        <title>Danh sách văn bằng</title>
      </Helmet>
      <h1 className="font-bold text-2xl mt-10 ml-10 ">Your degrees</h1>
      <div className="holder-degree m-10 px-10 grid grid-cols-1 md:grid-cols-4 gap-10 ">
        {degreeInfo.map((degree, index) => (
          <DegreeCard key={index} name="Bacherlor of degree" degree={degree} /> // Assuming degree.name is the name of the degree
        ))}
      </div>
    </NavigationHolder>
  );
};

export default DegreeHolder;
