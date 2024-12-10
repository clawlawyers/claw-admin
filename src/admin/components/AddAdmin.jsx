import { CloseRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { add_admin } from "../actions/Admin.action";

const AddAdmin = ({ onClose }) => {
  const { register, handleSubmit } = useForm();
  const [wronglength, setWrongLength] = useState("");

  const onSubmit = async (data) => {
    if (data.mobileNumber.length < 10) {
      setWrongLength("mobile number must be 10 digits");
    } else {
      const res = await add_admin({
        phoneNumber: data.mobileNumber,
        name: data.name,
      });

      if (res.status == 400) {
        setWrongLength("number already exists");
      }
      if (res.status == 500) {
        setWrongLength("error ocuured");
      }
      if (res.status == 200) {
        setWrongLength("admin added");
      }
    }
  };
  return (
    <main className="flex flex-col p-5 justify-center space-y-5 items-center w-full ">
      <section className="flex flex-row justify-between items-center w-full ">
        <h3 className="text-xl font-bold text-teal-900">Add Admin Details</h3>
        <CloseRounded
          onClick={onClose}
          className="text-white cursor-pointer rounded-full border-2 border-white"
        />
      </section>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <input
          {...register("name")}
          type="text"
          placeholder="name"
          className="bg-[#D9D9D9] w-full p-2 rounded-md"
        />
        <input
          {...register("mobileNumber")}
          type="text"
          placeholder="Mobile Number"
          className="bg-[#D9D9D9] w-full p-2 rounded-md"
        />

        <button
          type="submit"
          className="border-2 border-teal-500 w-full p-2 bg-custom-gradient rounded-md text-white"
        >
          Add Admin
        </button>
      </form>{" "}
      <span
        className={
          wronglength == "admin added" ? "text-green-500" : "text-red-400"
        }
      >
        {wronglength}
      </span>
    </main>
  );
};

export default AddAdmin;
