import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faGear, faCircleUser } from '@fortawesome/free-solid-svg-icons';


const HolderSidebar = () => {

  return (
    <nav className="sidebar w-48 items-center text-white flex flex-col fixed left-0 top-16 bottom-0 bg-white shadow-lg z-50">
      <ul className="list-none ">
        <li className="my-2 ">
          <Link to="/info-holder" className="text-black no-underline text-xl p-2 block rounded font-bold hover:bg-blue-800 hover:text-white">
            <FontAwesomeIcon icon={faCircleUser} className='mr-2'/>
              Info</Link>
        </li>
        <li className="mb-2">
          <Link to="/degree-holder" className="text-black no-underline text-xl p-2 block rounded font-bold hover:bg-blue-800 hover:text-white">
          
          <FontAwesomeIcon icon={faGraduationCap} className='mr-2' />
            Degree</Link>
        </li>          
        <li className='mb-2 '>
          <Link to="/setting" className="text-black no-underline text-xl p-2 block rounded font-bold hover:bg-blue-800 hover:text-white">
            <FontAwesomeIcon icon={faGear} className='mr-2' />
            Setting</Link>
        </li>
      </ul>
    </nav>
  );
};

export default HolderSidebar;
