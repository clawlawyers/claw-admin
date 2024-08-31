import { CloseRounded } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";

const AddSalesman = ({onClose}) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
      console.log(data);
    };
  return (
    <main className="flex flex-col p-5 justify-center space-y-5 items-center w-full ">
      <section className="flex flex-row justify-between items-center w-full ">
        <h3 className="text-xl font-bold text-teal-900">
          Add Salesman Details
        </h3>
        <CloseRounded onClick={onClose} className="text-white cursor-pointer rounded-full border-2 border-white" />
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
        <input
          {...register("referralCode")}
          type="text"
          placeholder="Enter ambassador id"
          className="bg-[#D9D9D9] w-full p-2 rounded-md"
        />
        <input
          {...register("Enter Name")}
          type="text"
          placeholder="First Name"
          className="bg-[#D9D9D9] w-full p-2 rounded-md"
        />
        <input
          {...register("Location")}
          type="text"
          placeholder="Last Name"
          className="bg-[#D9D9D9] w-full p-2 rounded-md"
        />
       
        <button
          type="submit"
          className="border-2 border-teal-500 w-full p-2 bg-custom-gradient rounded-md text-white"
        >
          Add Salesman
        </button>
      </form>    </main>
  );
};

export default AddSalesman;
