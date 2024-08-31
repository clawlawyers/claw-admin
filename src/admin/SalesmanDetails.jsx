import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SalesmanDetails = () => {
    let navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const salesman = location.state || {};
  const salesmanDetails = salesman.user;
  console.log(salesmanDetails);

  return (
    <main className="flex flex-col h-screen w-full p-5">
      <section className="bg-black/30 rounded-md p-10 w-full h-full">
        {/* header */}
        <section className="flex flex-row w-full items-start justify-between ">
          <div className="flex flex-col  space-y-5 justify-center items-center">
            <h3 className="text-3xl font-bold">{salesmanDetails.name}</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-sm text-neutral-200 text-left">
                  Referral Code:
                </p>
                <span className="text-sm text-neutral-200 text-left">
                  {salesmanDetails.referralCode}
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-neutral-200 text-left">Location:</p>
                <span className="text-sm text-neutral-200 text-left">
                  {salesmanDetails.location}
                </span>
              </div>
            </div>
          </div>
          {/* button */}
          <button onClick={()=> navigate(-1)} className="border-2 border-white bg-popover-gradient px-5 p-2 rounded-md">Go Back</button>
        </section>
      </section>
    </main>
  );
};

export default SalesmanDetails;
