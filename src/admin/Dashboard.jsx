import React from "react";
import { adminUserData } from "../utils/utils";
import { People, PersonAdd, ShoppingCart } from "@mui/icons-material";
import PieChart from "./components/PieChat";
import MyPieChart from "./components/PieChat";

const Dashboard = () => {
  return (
    <main className="flex flex-col space-y-5 h-screen w-full justify-between items-center p-10">
      {/* //card section */}
      <section className="flex flex-row w-full space-x-5 justify-center items-center">
        <div className="flex-1 bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white  h-fit">
          <p>
            <People /> Total User
          </p>
          <p className="text-2xl font-semibold">128</p>
        </div>
        <div className="flex-1 bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white  h-fit">
          <p>
            <PersonAdd /> Subscribed User
          </p>
          <p className="text-2xl font-semibold">128</p>
        </div>
        <div className="flex-1 bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white  h-fit">
          <p>
            <ShoppingCart /> Total Referral Codes
          </p>
          <p className="text-2xl font-semibold">128</p>
        </div>
        <div className="flex-1 bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white  h-fit">
          <p>
            <People />
            Total Visitors
          </p>
          <p className="text-2xl font-semibold">128</p>
        </div>
      </section>

      {/* //graph sections */}
      <section className="flex flex-row w-full space-x-10 justify-between items-center ">
        {/* Top Users */}
        <div className="bg-white flex-1 rounded-md p-5 flex flex-col text-black h-[65vh]">
          <h2 className="text-lg text-teal-700 font-semibold">Top Users</h2>
          {/* //users */}
          <div>
            {adminUserData?.map((users) => (
              <div className="flex flex-row justify-between items-center p-2 border-b border-gray-200">
                <p>{users.username}</p>
                <p>{users.plan}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white flex-1 rounded-md p-5 flex flex-col justify-center items-center text-black h-[65vh]">
         
            <MyPieChart />
          
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
