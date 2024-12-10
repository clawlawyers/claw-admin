import { CloseRounded } from "@mui/icons-material";

import React, { useState } from "react";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const AddCoupon = ({ onClose }) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const handleAddCoupon = async () => {
    // Ensure all fields are filled
    if (!code || !discount || !expirationDate) {
      alert("Please fill all fields");
      return;
    }

    // Backend API call
    try {
      const response = await fetch(`${NODE_API_ENDPOINT}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          discount,
          expirationDate,
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
          className="text-white rounded-full border-2 cursor-pointer "
        />
      </section>

      {/* //data section */}

      <section className="flex flex-col-reverse justify-center items-center w-full gap-2">
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="text"
            onChange={(e) => setDiscount(e.target.value)}
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon Percentage"
          />
          <input
            type="date"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon Expiration"
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="text"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Coupon Name"
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
