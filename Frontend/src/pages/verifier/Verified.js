import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCopy,
  faSyncAlt,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import NavigationVerifier from "../../components/Verified/NavigationVerifier.js";

const data = [
  {
    id: 1,
    holderDID: "96b717df...95cd0e85",
    holderName: "Tran Huy Duc",
    major: "Telecommunications",
    issuerDID: "9e5a7451...327e1128",
    issuerName: "HCMUT",
    status: "Valid",
    verifiedTime: "11:59:29 AM 6/1/2023"
  },
  {
    id: 2,
    holderDID: "0701b8c...0de95f9a",
    holderName: "Trịnh Gia Bảo",
    major: "Information Technology",
    issuerDID: "9e5a7451...327e1128",
    issuerName: "NA",
    status: "Valid",
    verifiedTime: "7:46:01 AM 6/1/2023"
  },
  {
    id: 3,
    holderDID: "23fff4e0...1ec21f99",
    holderName: "Huy Duc",
    major: "Computer Science",
    issuerDID: "9e5a7451...327e1128",
    issuerName: "NA",
    status: "Valid",
    verifiedTime: "9:39:34 PM 5/30/2023"
  },
  {
    id: 4,
    holderDID: "45410f02...b8a9f886",
    holderName: "Nguyễn Bình An",
    major: "",
    issuerDID: "",
    issuerName: "NA",
    status: "Pending",
    verifiedTime: "2:10:54 PM 5/30/2023"
  },
];

const Verified = () => {
  const [search, setSearch] = useState("");

  return (
    <NavigationVerifier>
        <div className="mx-10 mt-10">
            <div className="flex flex-row justify-between mb-4">
                <h1 className="font-bold text-2xl">Verified Degrees</h1>
                <div className="flex flex-row items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Input DID to search"
                            className="rounded-lg px-4 py-1 w-80 border-2 focus:outline-none focus:border-blue-700 border-blue-600 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="absolute right-3 top-1 text-gray-500">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                    <button className="text-gray-600 hover:text-gray-900 text-lg">
                    <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                </div>
            </div>


            <table className="w-full text-sm table-auto border-collapse shadow rounded bg-gray-200">
                <thead className=" text-gray-700 font-semibold text-sm">
                    <tr>
                    <th className="px-3 py-2 my-1">No</th>
                    <th className="px-3 py-2 my-1">Holder DID</th>
                    <th className="px-3 py-2 my-1">Holder Name</th>
                    <th className="px-3 py-2 my-1">Major</th>
                    <th className="px-3 py-2 my-1">Issuer DID</th>
                    <th className="px-3 py-2 my-1">Issuer Name</th>
                    <th className="px-3 py-2 my-1">Status</th>
                    <th className="px-3 py-2 my-1">Verified Time</th>
                    </tr>
                </thead>
                <tbody >
                    {data
                        .filter((row) => row.holderDID.includes(search))
                        .map((row, index) => (
                        <tr key={row.id} className="text-center bg-white rounded-3xl  ">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 flex items-center justify-center gap-3 rounded shadow my-2">
                                <span>{row.holderDID}</span>
                                <FontAwesomeIcon icon={faCopy} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                            </td>
                            <td className="px-2 py-3">{row.holderName}</td>
                            <td className="px-2 py-3">
                            {row.major || (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">NOT YET VERIFIED</span>
                            )}
                            </td>
                            
                            {row.issuerDID ? (
                                <td className="p-2 flex items-center justify-center gap-2 rounded shadow my-2">
                                <>
                                {row.issuerDID}
                                <FontAwesomeIcon icon={faCopy} className="text-gray-500 hover:text-gray-700 cursor-pointer " />
                                </>
                                </td>
                            ) : (
                                <span className="px-2 py-1 bg-green-100 text-blue-800 rounded text-xs shadow-none m-0">NOT YET VERIFIED</span>
                            )}
                           
                            <td className="px-2 py-3">{row.issuerName}</td>
                            <td className="px-2 py-3">
                            {row.status === "Valid" ? (
                                <span className="text-blue-600 font-medium flex items-center justify-center gap-1 text-sm">
                                <FontAwesomeIcon icon={faCheckCircle} /> Valid
                                </span>
                            ) : (
                                <span className="text-yellow-500 font-medium flex items-center justify-center gap-2 text-sm">
                                <FontAwesomeIcon icon={faExclamationTriangle} /> Pending
                                <button className="px-2 py-1 rounded border border-purple-500 text-purple-600 hover:bg-purple-100 text-xs">VERIFY</button>
                                </span>
                            )}
                            </td>
                            <td className="px-2 py-3">{row.verifiedTime}</td>
                        </tr>
                        ))}
                    </tbody>

            </table>
        </div>
    </NavigationVerifier>
  );
};

export default Verified;
