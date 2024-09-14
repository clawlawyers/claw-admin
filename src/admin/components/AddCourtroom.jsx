import React, { useState } from "react";
import { NODE_API_ENDPOINT } from "../../utils/utils"; // Adjust this based on your project structure

const AddCourtroom = ({ onClose }) => {
  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Domain, setDomain] = useState("");
  const [recording, setRecording] = useState(false);
  const [totalHours, setTotalHours] = useState("");
  const [totalUsedHours, setTotalUsedHours] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [features, setFeatures] = useState({
    AiLawyer: false,
    AiJudge: false,
    AiAssistant: false,
    FirstDraft: false,
    Verdict: false,
    LegalGPT: false,
    MultilingualSupport: false,
    RelevantCaseLaws: false,
    VoiceInput: false,
    Evidences: false,
  });

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !Domain ||
      !totalHours ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill in all fields");
      return;
    }

    const data = {
      name,
      email,
      phoneNumber,
      Domain,
      recording,
      totalHours,
      startDate,
      endDate,
      features,
    };

    // Make a POST request
    try {
      const response = await fetch(
        `${NODE_API_ENDPOINT}/admin/client/book-courtroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(await response.body);
      if (response.ok) {
        alert("User added successfully!");
        onClose(); // Close the modal or clear form if needed
      } else {
        alert("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred");
    }
  };

  return (
    <main className="flex flex-col space-y-5 p-5 w-full justify-center items-center bg-popover-gradient">
      <h3 className="text-white font-bold text-center">Add User Details</h3>

      {/* Form section */}
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col space-y-4 w-full"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter User Name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter User Email"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Phone Number"
          />
        </div>

        {/* Domain */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Domain:</label>
          <input
            type="text"
            value={Domain}
            onChange={(e) => setDomain(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Domain"
          />
        </div>

        {/* Recording */}
        <div className="flex flex-row items-center">
          <label className="text-white font-semibold mr-2">
            Recording Enabled:
          </label>
          <input
            type="checkbox"
            checked={recording}
            onChange={(e) => setRecording(e.target.checked)}
            className="rounded"
          />
        </div>

        {/* Total Hours */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Total Hours:</label>
          <input
            type="number"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Total Hours"
          />
        </div>

        {/* Total Used Hours */}

        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col">
          <label className="text-white font-semibold">Features:</label>
          {Object.keys(features).map((feature) => (
            <div key={feature} className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={features[feature]}
                onChange={() =>
                  setFeatures((prevFeatures) => ({
                    ...prevFeatures,
                    [feature]: !prevFeatures[feature],
                  }))
                }
                className="rounded"
              />
              <label className="text-white ml-2">{feature}</label>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="p-2 rounded-md border border-white px-5 bg-popover-gradient text-white font-semibold"
          >
            Add User
          </button>
        </div>
      </form>
    </main>
  );
};

export default AddCourtroom;
