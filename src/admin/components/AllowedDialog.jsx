import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PersonAdd, Close } from "@mui/icons-material";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import { CircularProgress } from "@mui/material";
const AllowedDialog = ({ onClose }) => {
  const [loading,setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = {
      ...data,
    };
    console.log(formData);

    
    console.log(formData);
    try {
      const res = await axios.post(
        `${NODE_API_ENDPOINT}/admin/api/trail-bookings`,
        {
         
        
          StartDate: formData.StartDate,
          EndDate: formData.EndDate,
          email: formData.Email,
          phoneNumber: formData.phoneNumber,
          bookedSlots: 0,
          totalSlots: formData.totalSlots,
        }
      );
      if (res.status === 201) {
        console.log("User added successfully:", res.data);

        // Optionally, show a success message or close the dialog
        onClose();
      } else {
        console.error("Failed to add user:", res.data);
      }
    } catch (e) {
      console.log(e);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full"
      style={{
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        zIndex: "3",
        overflow: "auto",
        padding: "5px",
      }}
    >
      <div
        className="scale-75 w-2/3 rounded-xl border-2 border-white"
        style={{
          background: "linear-gradient(to right,#0e1118,#008080)",
        }}
      >
        <div className="flex flex-row justify-between items-center border-b-2 border-white">
          <h4 className="text-center mx-10">New User Details</h4>
          <div className="flex justify-end">
            <Close
              onClick={onClose}
              style={{ margin: "20px", cursor: "pointer" }}
              width="30"
              height="30"
              fill="white"
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center w-full py-5 px-5 h-full"
        >
          <label htmlFor="Email" className="text-left self-start font-semibold">
            Email
          </label>
          <input
            {...register("Email", { required: true })}
            id="Email"
            type="email"
            className="mb-4 w-full rounded-md p-2 text-neutral-800 outline-none"
          />
        

          <label
            htmlFor="phoneNumber"
            className="text-left self-start font-semibold"
          >
            Phone Number
          </label>
          <input
            {...register("phoneNumber", {
              required: true,
              pattern: /^[0-9]{10}$/,
            })}
            id="phoneNumber"
            type="tel"
            className="mb-4 w-full rounded-md p-2 text-neutral-800 outline-none"
          />
          {errors.phoneNumber && (
            <p>
              {errors.phoneNumber.type === "pattern"
                ? "Invalid phone number"
                : "This field is required"}
            </p>
          )}
          <div className="flex flex-wrap w-full justify-between  items-center">
            <div className="flex flex-col">
              <label
                htmlFor="StartDate"
                className="text-left self-start font-semibold"
              >
                Start Date
              </label>
              <input
                {...register("StartDate", { required: true })}
                id="StartDate"
                type="date"
                className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
              />
              {errors.startDate && <p>This field is required</p>}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="EndDate"
                className="text-left self-start font-semibold"
              >
                End Date
              </label>
              <input
                {...register("EndDate", { required: true })}
                id="EndDate"
                type="date"
                className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
              />
              {errors.EndDate && <p>This field is required</p>}
            </div>
            
            
          </div>

          <div className="flex flex-wrap w-full items-center justify-between">
            <div className="flex flex-col">
              <label
                htmlFor="totalSlots"
                className="text-left self-start font-semibold"
              >
                Total Slots
              </label>
              <input
                {...register("totalSlots", { required: true })}
                id="totalSlots"
                type="text"
                className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
              />
              {errors.totalSlots && <p>This field is required</p>}
            </div>
          </div>

          <div className="flex flex-row justify-end pt-6 w-full">
            <button
              type="submit"
              className={`${loading ? "opacity-75 cursor-not-allowed pointer-events-none" : ""} bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center`}
            >
              {loading ?<CircularProgress /> : <PersonAdd />}
              <div className="font-semibold">Add User</div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllowedDialog;
