import React, { useState } from "react";
import { Helmet } from "react-helmet";
import NavigationHolder from "../../components/Holder/NavigationHolder.js";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
    });
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    // Bấm xác nhận
    const handleSubmit = async (e) => {
        
         navigate("/login")

    };

    return (
        <NavigationHolder>
            <Helmet>
                <title>Thay đổi mật khẩu</title>
            </Helmet>
            <h1 className="font-bold text-2xl mt-10 ml-10 ">Thay đổi mật khẩu</h1>
            <div className="bg-white m-10 p-10 rounded-xl shadow-lg items-center justify-center">
                <form
                    className="desktop:w-[60%] flex-col items-center justify-center mx-auto border-5"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4 mobile:w-[80%] ipad:w-2/3 mx-auto">
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="password_old"
                        >
                            <span className="text-red-500">*</span>Mật khẩu hiện
                            tại
                        </label>
                        <input
                            value={formData.old_password}
                            onChange={(e) => {
                                const value = e.target.value;
                                const trueValue = value.replace(/\s/g, "");
                                setFormData({
                                    ...formData,
                                    old_password: trueValue,
                                });
                            }}
                            type="password"
                            id="password_old"
                            className="w-full px-3 py-2 border-2 rounded-md focus:outline-none  focus:border-blue-400"
                        />
                        {errors.old_password && (
                            <p className=" text-[12px] text-red-500">
                                {errors.old_password}
                            </p>
                        )}
                    </div>
                    <div className="mb-4 mobile:w-[80%] ipad:w-2/3 mx-auto">
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="password_new"
                        >
                            <span className="text-red-500">*</span>Mật khẩu mới
                        </label>
                        <input
                            value={formData.new_password}
                            onChange={(e) => {
                                const value = e.target.value;
                                const trueValue = value.replace(/\s/g, "");
                                setFormData({
                                    ...formData,
                                    new_password: trueValue,
                                });
                            }}
                            type="password"
                            id="password_new"
                            className="w-full px-3 py-2 border-2 rounded-md focus:outline-none  focus:border-blue-400"
                        />
                        {errors.new_password && (
                            <p className=" text-[12px] text-red-500">
                                {errors.new_password}
                            </p>
                        )}
                    </div>
                    <div className="mb-4 mobile:w-[80%] ipad:w-2/3 mx-auto">
                        <label
                            className="block text-gray-700 mb-2"
                            htmlFor="confirm_password"
                        >
                            <span className="text-red-500">*</span>Nhập lại mật
                            khẩu mới
                        </label>
                        <input
                            value={formData.new_password_confirmation}
                            onChange={(e) => {
                                const value = e.target.value;
                                const trueValue = value.replace(/\s/g, "");
                                setFormData({
                                    ...formData,
                                    new_password_confirmation: trueValue,
                                });
                            }}
                            type="password"
                            id="confirm_password"
                            className="w-full px-3 py-2 border-2 rounded-md focus:outline-none  focus:border-blue-400"
                        />
                        {errors.new_password_confirmation && (
                            <p className=" text-[12px] text-red-500">
                                {errors.new_password_confirmation}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className=" px-5 bg-blue-500 my-6 font-semibold text-white py-2 rounded-md hover:bg-blue-600 transition 
                            outline-none ring-indigo-500/70 ring-offset-2 focus-visible:ring-2 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Xác nhận
                        </button>
                    </div>

                </form>
            </div>
        </NavigationHolder>
    );
};

export default ChangePassword;
