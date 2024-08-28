import {
  Add,
  PersonAdd,
  Close,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setUserData,
  addSlot,
  removeSlot,
} from "../features/courtroomAdminAddUserSlice";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
const UserDialog = ({ onClose, onUserAdd }) => {
  const dispatch = useDispatch();
  const [addedSlots, setAddedSlots] = useState([]);
  const slotsContainerRef = useRef(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleAddSlots = () => {
    const date = getValues("date");
    const time = getValues("time");

    if (date && time) {
      const newSlot = { date, time };
      setAddedSlots((prevSlots) => [...prevSlots, newSlot]);
      dispatch(addSlot(newSlot));
    }
  };

  const handleRemoveSlot = (indexToRemove) => {
    setAddedSlots((prevSlots) =>
      prevSlots.filter((_, index) => index !== indexToRemove)
    );
    dispatch(removeSlot(indexToRemove));
  };

  const handleScrollLeft = () => {
    slotsContainerRef.current.scrollBy({
      left: -150, // Adjust the scroll amount as needed
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    slotsContainerRef.current.scrollBy({
      left: 150, // Adjust the scroll amount as needed
      behavior: "smooth",
    });
  };

  const onSubmit = async (data) => {
    setBtnLoading(true);
    const formData = {
      ...data,
      slots: addedSlots.map((slot) => ({
        date: dayjs(slot.date).format("D MMMM YYYY"),
        hour: slot.time,
      })),
    };

    console.log("User Data with Slots:", formData);

    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/courtroom/book-courtroom`,
        {
          name: formData.username,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password, // Add password field in your form if necessary
          slots: formData.slots,
          recording: true,
        }
      );

      if (response.status === 201) {
        console.log("User added successfully:", response.data);

        dispatch(setUserData(formData));
        onUserAdd(formData);

        // Optionally, show a success message or close the dialog
        toast.success("User Added successfully");
        onClose();
      } else {
        console.error("Failed to add user:", response.data);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setBtnLoading(false);
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
          <label
            htmlFor="username"
            className="text-left self-start font-semibold"
          >
            Username
          </label>
          <input
            {...register("username", { required: true })}
            id="username"
            type="text"
            className="mb-4 w-full rounded-md p-2 text-neutral-800 outline-none"
          />
          <label
            htmlFor="password"
            className="text-left self-start font-semibold"
          >
            Password
          </label>
          <input
            {...register("password", { required: true })}
            id="password"
            type="password"
            className="mb-4 w-full rounded-md p-2 text-neutral-800 outline-none"
          />

          <label htmlFor="email" className="text-left self-start font-semibold">
            Email
          </label>
          <input
            {...register("email", { required: true })}
            id="email"
            type="email"
            className="mb-4 w-full rounded-md p-2 text-neutral-800 outline-none"
          />
          {errors.email && <p>This field is required</p>}

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

          <div className="flex flex-wrap w-full items-center justify-between">
            <div className="flex flex-col">
              <label
                htmlFor="Date"
                className="text-left self-start font-semibold"
              >
                Date
              </label>
              <input
                {...register("date", { required: true })}
                id="date"
                type="date"
                className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
              />
              {errors.date && <p>This field is required</p>}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="Time"
                className="text-left self-start font-semibold"
              >
                Time
              </label>
              <select
                {...register("time", { required: true })}
                id="time"
                className="mb-4 w-fit rounded-md p-2 text-neutral-800 outline-none"
              >
                <option value="">--Select hour--</option>
                {[...Array(24).keys()].map((hour) => {
                  const currentHour = new Date().getHours();
                  return (
                    <option
                      key={hour}
                      value={hour}
                      disabled={hour < currentHour}
                    >
                      {hour.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
              {errors.time && <p>This field is required</p>}
            </div>
            <button
              type="button"
              onClick={handleAddSlots}
              className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
            >
              <Add />
              <div className="font-semibold">Add Slot</div>
            </button>
          </div>

          <label htmlFor="Time" className="text-left self-start font-semibold">
            Selected Slots
          </label>
          <div className="relative w-full flex items-center pt-1 mr-11">
            <ArrowBackIos
              onClick={handleScrollLeft}
              className="cursor-pointer text-white z-10 absolute left-0"
            />
            <div
              className="bg-white w-full items-center rounded-md border border-neutral-800 h-20 flex flex-nowrap overflow-x-auto scrollbar-hide mx-4"
              ref={slotsContainerRef}
            >
              {addedSlots.map((slot, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-black h-max px-3 py-2 m-1 rounded-md flex items-center"
                  style={{ minWidth: "max-content" }}
                >
                  {dayjs(slot.date).format("D MMMM YYYY")}, {slot.time}
                  <Close
                    onClick={() => handleRemoveSlot(index)}
                    className="ml-2 cursor-pointer text-red-600"
                  />
                </div>
              ))}
            </div>
            <ArrowForwardIos
              onClick={handleScrollRight}
              className="cursor-pointer text-white z-10 absolute right-0"
            />
          </div>

          <div className="flex flex-row justify-end pt-6 w-full">
            <button
              type="submit"
              className={`${
                btnLoading
                  ? "opacity-75 cursor-progress"
                  : "opacity-100 cursor-pointer"
              } bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center`}
            >
              {btnLoading ? (
                <CircularProgress className="h-5 w-5" />
              ) : (
                <PersonAdd />
              )}
              <div className="font-semibold">Add User</div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDialog;
