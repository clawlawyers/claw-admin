import { CloseRounded } from "@mui/icons-material";
import React from "react";

const AddCoupon = ({onClose}) => {
  return (
    <main className="flex flex-col space-y-5 p-5 w-full justify-center items-center bg-popover-gradient">
      <section className="flex flex-row justify-between w-full ">
        <h3 className="text-white font-bold text-center">Add Coupon Code</h3>
        <CloseRounded onClick={onClose} className="text-white rounded-full border-2 cursor-pointer "  />
      </section>

      {/* //data section */}

      <section className="flex flex-col-reverse justify-center items-center w-full gap-2">
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="text"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon Percentage"
          />
          <input
            type="date"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-1/2"
            placeholder="Enter Coupon Expiration"
          />
        </div>
        <div className="flex flex-row w-full justify-center items-center space-x-5">
          <input
            type="text"
            className="p-2 text-black bg-[#D9D9D9] rounded-md w-full"
            placeholder="Enter Coupon Name"
          />
        </div>
      </section>
      <section className="flex justify-end w-full">
        <button className="p-2 rounded-md border border-white px-5 bg-popover-gradient text-white font-semibold">
          Add Coupon
        </button>
      </section>
    </main>
  );
};

export default AddCoupon;
