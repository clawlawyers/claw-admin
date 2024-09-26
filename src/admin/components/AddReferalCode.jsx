import React, { useState } from "react";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const GenerateReferralCode = () => {
  const [client, setClient] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    collegeName: "",
  });
  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(client);
      const response = await fetch(`${NODE_API_ENDPOINT}/admin/referralcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        throw new Error("Failed to generate referral code. Please try again.");
      }

      // const { referralCode, message } = response.data;

      const resp = await response.json();

      console.log(resp);
      setReferralCode(referralCode);
      setMessage(message || "Referral code generated successfully!");
    } catch (error) {
      setError("Failed to generate referral code. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-5 w-full max-w-md mx-auto bg-gray-200 rounded-md">
      <h2 className="text-lg font-semibold text-center">
        Generate Referral Code
      </h2>

      <input
        type="text"
        name="phoneNumber"
        value={client.phoneNumber}
        onChange={handleChange}
        placeholder="Enter Phone Number"
        className="p-2 rounded-md border border-gray-300"
      />
      <input
        type="text"
        name="firstName"
        value={client.firstName}
        onChange={handleChange}
        placeholder="Enter First Name"
        className="p-2 rounded-md border border-gray-300"
      />
      <input
        type="text"
        name="lastName"
        value={client.lastName}
        onChange={handleChange}
        placeholder="Enter Last Name"
        className="p-2 rounded-md border border-gray-300"
      />
      <input
        type="text"
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Enter email address"
        className="p-2 rounded-md border border-gray-300"
      />
      <input
        type="text"
        name="collegeName"
        value={client.collegeName}
        onChange={handleChange}
        placeholder="Enter College Name"
        className="p-2 rounded-md border border-gray-300"
      />

      <button
        onClick={handleGenerateCode}
        className="p-2 bg-blue-500 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Referral Code"}
      </button>

      {referralCode && (
        <p className="text-green-500">
          Referral Code: <strong>{referralCode}</strong>
        </p>
      )}

      {message && <p className="text-green-500">{message}</p>}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default GenerateReferralCode;
