import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPhoneNumber } from "../features/loginSlice";

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [phoneNumber, setphoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handlePhoneNumberChange = (e) => {
    setphoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = () => {
    dispatch(setPhoneNumber(phoneNumber));
    setOtpSent(true);
    // Implement actual OTP sending logic here
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here
    alert("OTP Verified");
    navigate("/admin/dashboard");
  };

  return (
    <main className="h-screen bg-[#303030] w-full flex flex-col rounded-lg items-center justify-between py-10">
      {/* Header */}
      <section className="flex flex-col justify-center items-center">
        <h3 className="font-semibold text-lg">Welcome to</h3>
        <span className="text-6xl font-bold text-teal-500">Admin Panel</span>
      </section>

      {/* OTP */}
      <section className="w-full flex flex-col justify-center items-center p-20 pt-28">
        {!otpSent ? (
          <input
            required
            type="text"
            className="w-full text-base p-2 rounded-md text-neutral-800"
            placeholder="Enter your Registered Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        ) : (
          <input
            type="text"
            className="w-full text-base p-2 rounded-md text-neutral-800"
            placeholder="Enter your OTP"
            value={otp}
            onChange={handleOtpChange}
          />
        )}

        <div className="flex gap-5 flex-row justify-end w-full">
          {otpSent && (
            <button className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5">
              Re-send OTP
            </button>
          )}
          <button
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5"
          >
            {!otpSent ? "Send OTP" : "Verify OTP"}
          </button>
        </div>
      </section>
      <div>
        <p>
          Trouble Logging In? <span>Contact Management</span>
        </p>
      </div>
    </main>
  );
};

export default Login;
