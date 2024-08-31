import { CloseRounded } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";

const AddAdmin = ({onClose}) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
      console.log(data);
    };
  return (
    <main className="flex flex-col p-5 justify-center space-y-5 items-center w-full ">
      <section className="flex flex-row justify-between items-center w-full ">
        <h3 className="text-xl font-bold text-teal-900">
          Add Admin Details
        </h3>
        <CloseRounded onClick={onClose} className="text-white cursor-pointer rounded-full border-2 border-white" />
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
        <input
          {...register("plan")}
          type="text"
          placeholder="Plan"
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
      </form>    </main>
  );
};

export default AddAdmin;
