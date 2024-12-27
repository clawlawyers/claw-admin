import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "../../utils/firebase";
import { NODE_API_ENDPOINT, OTP_ENDPOINT } from "../../utils/utils";
import toast from "react-hot-toast";
import { login , retrieveAuth } from "../features/loginSlice";


const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [phoneNumber, setphoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [sendingOtp, setSendingOtp] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [otpToken, setOtpToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const adminUsersNumber = useSelector(
    (state) => state.adminUsersNumber.adminUsers
  );
  // const auth = useSelector((state)=>state.adminAuthUser.user)
  const user = localStorage.getItem("auth-courtroom-admin");
  useEffect(()=>{
    if (user) {
      navigate("/admin/dashboard");
    }
    },[])

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
    setSendingOtp(1);

    try {
      const handleOTPsend = await fetch(`${OTP_ENDPOINT}/generateOTPmobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          siteName: "www.admin.clawlaw.in",
        }),
      });

      if (!handleOTPsend.ok) {
        console.error("Failed to send OTP");
        toast.error("Failed to send OTP");
        throw new Error("Failed to send OTP");
      }
      const data = await handleOTPsend.json();
      if (data.authtoken) {
        setOtpToken(data.authtoken);
      }

      toast.success("OTP sent successfully!");
      // alert("OTP sent!");
      setSendingOtp(0);

      setIsDisabled(true);
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP");
      // alert("Error during OTP request");
      console.error("Error during OTP request:", error);
      setSendingOtp(0);
      setOtpSent(false);
    }

    // console.log("sendOTP");
    // console.log(window.recaptchaVerifier);

    // if (!window.recaptchaVerifier) {
    //   console.log("recaptchaVerifier");
    //   window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
    //     size: "invisible",
    //     callback: (response) => {
    //       // reCAPTCHA solved, allow signInWithPhoneNumber.
    //       console.log(response);
    //     },
    //     auth,
    //   });
    // }

    // signInWithPhoneNumber(auth, "+91" + phoneNumber, window.recaptchaVerifier)
    //   .then((confirmationResult) => {
    //     setVerificationId(confirmationResult.verificationId);
    //     alert("OTP sent!");
    //     setOtpSent(true);
    //   })
    //   .catch((error) => {
    //     alert("Error during OTP request");
    //     console.error("Error during OTP request:", error);
    //     setOtpSent(false);
    //   });
  };

  const handleReSendOtp = async () => {
    // Implement actual OTP sending logic here
    if (!checkAdmin()) {
      toast.error("You are not Admin!");
      return;
    }

    try {
      const handleOTPsend = await fetch(`${OTP_ENDPOINT}/generateOTPmobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          siteName: "www.admin.clawlaw.in",
        }),
      });

      if (!handleOTPsend.ok) {
        console.error("Failed to send OTP");
        toast.error("Failed to send OTP");
        throw new Error("Failed to send OTP");
      }
      const data = await handleOTPsend.json();
      if (data.authtoken) {
        setOtpToken(data.authtoken);
      }

      toast.success("OTP sent successfully!");
      // alert("OTP sent!");
      setOtpSent(true);
    } catch (error) {
      toast.error("Failed to send OTP");
      // alert("Error during OTP request");
      console.error("Error during OTP request:", error);
      setOtpSent(false);
    }

    // console.log("sendOTP");
    // console.log(window.recaptchaVerifier);

    // if (!window.recaptchaVerifier) {
    //   console.log("recaptchaVerifier");
    //   window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
    //     size: "invisible",
    //     callback: (response) => {
    //       // reCAPTCHA solved, allow signInWithPhoneNumber.
    //       console.log(response);
    //     },
    //     auth,
    //   });
    // }

    // signInWithPhoneNumber(auth, "+91" + phoneNumber, window.recaptchaVerifier)
    //   .then((confirmationResult) => {
    //     setVerificationId(confirmationResult.verificationId);
    //     alert("OTP Resent!");
    //     setOtpSent(true);
    //   })
    //   .catch((error) => {
    //     alert("Error during OTP request");
    //     console.error("Error during OTP request:", error);
    //     setOtpSent(false);
    //   });
  };

  const handleVerifyOtp = async () => {
    // Implement OTP verification logic here

    try {
      if (otp.length === 6) {
        const verifyOTPResponse = await fetch(
          `${OTP_ENDPOINT}/verifyotpmobile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": otpToken,
            },
            body: JSON.stringify({
              otp: otp,
            }),
          }
        );

        if (!verifyOTPResponse.ok) {
          const err = verifyOTPResponse.json();
          toast.error(err.error);
          return;
        }

        const OTPdata = await verifyOTPResponse.json();
        console.log(OTPdata);
        if (OTPdata.authtoken) {
          console.log(verifyToken);
          // await loginToUser(OTPdata.authtoken);

          setVerifyToken(OTPdata.authtoken);
        }
        console.log(verifyToken);
        toast.success("Phone number verified successfully!");
        // setOtpLoading(false);
        // setOtpVerifySuccess(true);
        // setOtp("");
        // setOtpSuccess(false);
        await loginToAdmin();
      } else throw new Error("Otp length should be of 6");
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("Error during OTP verification");
      setOtp("");
    }

    // const credential = PhoneAuthProvider.credential(verificationId, otp);

    // signInWithCredential(auth, credential)
    //   .then(async (userCredential) => {
    //     const user = userCredential.user;
    //     alert("Phone number verified successfully!");

    //     const props = await fetch(`${NODE_API_ENDPOINT}/admin/login`, {
    //       method: "POST",
    //       body: JSON.stringify({ phoneNumber }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });

    //     if (!props.ok) {
    //       alert("User not found!");
    //       return;
    //     }
    //     const parsedProps = await props.json();
    //     console.log(parsedProps.data);
    //     dispatch(login({ user: parsedProps.data }));
    //     navigate("/admin/dashboard");
    //   })
    //   .catch((error) => {
    //     console.error("Error during OTP verification:", error);
    //     // setProceedToPayment(false);
    //   });
  };

  const loginToAdmin = async (TokenT) => {
    try {
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
      
    } catch (error) {
      toast.error("Error during login to admin");
      console.error("Error during login to admin:", error);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isDisabled && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(intervalId);
      setIsDisabled(false);
      setCountdown(30); // Reset countdown
    }

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [isDisabled, countdown]);
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
            <button
              onClick={handleReSendOtp}
              disabled={isDisabled}
              className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5"
            >
              {sendingOtp
                ? "Sending..."
                : isDisabled
                ? `Wait ${countdown} seconds...`
                : "Retry"}
            </button>
          )}
          <button
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            disabled={sendingOtp}
            className="bg-teal-500 border border-black text-white rounded-md p-2 px-7 mt-5"
          >
            {sendingOtp ? "Sending..." : !otpSent ? "Send OTP" : "Verify OTP"}
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
