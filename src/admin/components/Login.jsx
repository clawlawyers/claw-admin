import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    let navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const handleChange = (e) => {
    setOtp(e.target.value);
  };
  const handleOtp = () => {
    setOtpSent(true);

    if(otpSent){

        alert("Otp Verified");
        navigate("/admin")
    }

  };
  const handleOtpSubmit = () => {
    console.log("Otp Submitted");
  };
  return (
    <main className="h-screen bg-[#303030] w-full flex flex-col rounded-lg items-center justify-between py-10">
      {/* header */}
      <section className="flex flex-col justify-center items-center">
        <h3 className="font-semibold text-lg">Welcome to </h3>
        <span className="text-6xl font-bold text-teal-500">Admin Panel</span>
      </section>

      {/* otp */}
      <section className="w-full flex flex-col justify-center items-center p-20 pt-28">
        {!otpSent ? (
          <input
            required
            className="w-full text-base p-2 rounded-md text-neutral-800 "
            placeholder="Enter your Registered Number"
            value={otp}
            onChange={handleChange}
          />
        ) : (
          <input
            className="w-full text-base p-2 rounded-md text-neutral-800 "
            placeholder="Enter your Otp"
            value={otp}
            onChange={handleOtpSubmit}
          />
        )}

        <div className="flex gap-5  flex-row justify-end w-full">
          {otpSent && (
            <button className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5">
              Re-sent Otp
            </button>
          )}
          <button
            onClick={handleOtp}
            className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5"
          >
            {!otpSent ? "Send Otp" : "Verify Otp"}
          </button>
        </div>
      </section>
      <div>
        <p>
          Trouble Loggin ? <span>Contact Management</span>
        </p>
      </div>
    </main>
  );
};

export default Login;
