import React from "react";

const Dashboard = () => {
  return (
    <main className="flex flex-col h-screen w-full justify-between items-center p-10">
      {/* //card section */}
      <section className="flex flex-row w-full space-x-5 justify-center items-center">
        <div className="bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white w-52 h-fit">
          <p>Total User</p>
          <p>128</p>
        </div>
        <div className="bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white w-52 h-fit">
          <p>Subscribed User</p>
          <p>128</p>
        </div>
        <div className="bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white w-52 h-fit">
          <p>Total Referral Codes</p>
          <p>128</p>
        </div>
        <div className="bg-card-gradient flex flex-col justify-center items-center p-5 rounded-md border border-white w-52 h-fit">
          <p>Total Visitors</p>
          <p>128</p>
        </div>
      </section>

      {/* //graph sections */}
      <section className="flex flex-row w-full justify-center items-center ">
        {/* Top Users */}
        <div className="bg-white rounded-md p-5 flex flex-col">
            <p>Top Users</p>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
