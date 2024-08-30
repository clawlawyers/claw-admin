import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "../../utils/firebase";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import toast from "react-hot-toast";
import { login } from "../features/loginSlice";

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [phoneNumber, setphoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const adminUsersNumber = useSelector(
    (state) => state.adminUsersNumber.adminUsers
  );

  const handlePhoneNumberChange = (e) => {
    setphoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Function to clear children of an element
  function clearRecaptchaChildren() {
    const recaptchaElement = document.getElementById("recaptcha");

    if (recaptchaElement) {
      while (recaptchaElement.firstChild) {
        recaptchaElement.removeChild(recaptchaElement.firstChild);
      }
    } else {
      console.warn('Element with ID "recaptcha" not found.');
    }
  }

  const checkAdmin = () => {
    console.log(phoneNumber.toString());
    console.log(adminUsersNumber);
    // Implement actual check logic here
    if (adminUsersNumber.includes(phoneNumber.toString())) {
      console.log("true");
      return true;
    } else {
      console.log("false");

      return false;
    }
  };

  const handleSendOtp = async () => {
    // Implement actual OTP sending logic here
    if (!checkAdmin()) {
      toast.error("You are not Admin!");
      return;
    }

    // Example usage
    clearRecaptchaChildren();

    console.log("sendOTP");

    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log(response);
      },
      auth,
    });

    signInWithPhoneNumber(auth, "+91" + phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        alert("OTP sent!");
        setOtpSent(true);
      })
      .catch((error) => {
        alert("Error during OTP request");
        console.error("Error during OTP request:", error);
        setOtpSent(false);
      });
  };

  const handleVerifyOtp = () => {
    // Implement OTP verification logic here

    const credential = PhoneAuthProvider.credential(verificationId, otp);

    signInWithCredential(auth, credential)
      .then(async (userCredential) => {
        const user = userCredential.user;
        alert("Phone number verified successfully!");

        const props = await fetch(`${NODE_API_ENDPOINT}/admin/login`, {
          method: "POST",
          body: JSON.stringify({ phoneNumber }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!props.ok) {
          alert("User not found!");
          return;
        }
        const parsedProps = await props.json();
        console.log(parsedProps.data);
        dispatch(login({ user: parsedProps.data }));
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        console.error("Error during OTP verification:", error);
        // setProceedToPayment(false);
      });
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
          <div id="recaptcha"></div>
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
