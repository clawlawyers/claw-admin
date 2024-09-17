import { CloseRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const AddCoupon = ({ onClose }) => {
  // State for the form fields
  const [code, setCode] = useState("");
  const [totalSlots, setTotalSlots] = useState(0);
  const [bookedSlots, setBookedSlots] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to handle adding a new coupon
  const handleAddCoupon = async () => {
    // Ensure all fields are filled
    if (!code || !totalSlots || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    // Backend API call
    try {
      const response = await fetch(`${NODE_API_ENDPOINT}/admin/trial-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CouponCode: code,
          totalSlots,
          bookedSlots, // Assuming initial value for booked slots is 0
          StartDate: startDate,
          EndDate: endDate,
        }),
      });

      if (response.ok) {
        // Handle success
        alert("Coupon added successfully!");
        onClose(); // Close the modal or clear form if needed
      } else {
        // Handle error
        alert("Failed to add coupon");
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      alert("An error occurred");
    }
  };

  return (
    <main className="flex flex-col space-y-5 p-5 w-full justify-center items-center bg-popover-gradient">
      <section className="flex flex-row justify-between w-full ">
        <h3 className="text-white font-bold text-center">Add Coupon Code</h3>
        <CloseRounded
          onClick={onClose}
          className="text-white rounded-full border-2 cursor-pointer"
        />
      </section>

      {/* Data section */}
      <section className="flex flex-col-reverse justify-center items-center w-full gap-2">
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="number"
            onChange={(e) => setTotalSlots(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Total Slots"
          />
          <input
            type="date"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon Start Date"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="date"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon End Date"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="text"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Coupon Code"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </section>
      <section className="flex justify-end w-full">
        <button
          className="p-2 rounded-md border border-white px-5 bg-popover-gradient text-white font-semibold"
          onClick={handleAddCoupon}
        >
          Add Coupon
        </button>
      </section>
    </main>
  );
};

export default AddCoupon;
