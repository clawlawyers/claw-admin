import React, { useCallback, useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getCoupons, getVistors } from "./actions/Users.action";

// Register the necessary components for the bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserVisit = () => {
  const types = ["everyDayData", "everyMonthData", "everyYearData"];
  const fetchUserData = useCallback(async () => {
    try {
      console.log(type);
      const res = await getVistors(types[type]);
      var data = [];
      res.map((i) => {
        var count = 0;
        i.map((e) => {
          e.visits.map((o) => {
            count += o.totalVisits;
          });
        });
        data.push(count);
      });
      console.log(data);

      setUserData(data);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }, []);
  const fetchUserDatafunc = async () => {
    try {
      console.log(type);
      const res = await getVistors(types[type]);
      var data = [];
      res.map((i) => {
        var count = 0;
        i.map((e) => {
          e.visits.map((o) => {
            count += o.totalVisits;
          });
        });
        data.push(count);
      });
      console.log(data);

      setUserData(data);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const [userData, setUserData] = useState([]);
  const [type, setType] = useState(0);

  useEffect(() => {
    console.log("hi");
    fetchUserDatafunc();
  }, [type]);

  // Sample data for daily, monthly, and yearly visits
  const dailyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Visits",
        data: userData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Visits",
        data: userData,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const yearlyData = {
    labels: ["2024"],
    datasets: [
      {
        label: "Yearly Visits",
        data: userData,
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  return (
    <main className="flex flex-col w-full h-screen justify-start items-center p-5">
      {/* Header Section */}
      <section className="flex flex-col w-full justify-start space-y-10 h-full items-start ">
        <h2 className="text-white text-left font-bold text-lg">
          User Page Visit Data
        </h2>
        <div className="flex flex-col h-[70vh] justify-start  items-start w-full">
          <Tab.Group className="flex flex-col gap-10 h-full justify-between">
            <Tab.List className="flex gap-4">
              {["Daily", "Monthly", "Yearly"].map((tab, i) => (
                <Tab
                  key={tab}
                  onClick={() => setType(i)}
                  className={({ selected }) =>
                    `p-1 px-10 rounded-md border border-white transition-colors ${
                      selected
                        ? "bg-transparent text-white"
                        : "bg-popover-gradient text-gray-400 hover:bg-red-500"
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            {/* Graph Section */}
            <Tab.Panels className="flex-grow w-full h-full">
              <Tab.Panel className="flex justify-center items-center w-full h-full">
                <Bar data={dailyData} className="w-full h-full" />
              </Tab.Panel>
              <Tab.Panel className="flex justify-center items-center w-full h-full">
                <Bar data={monthlyData} className="w-full h-full" />
              </Tab.Panel>
              <Tab.Panel className="flex justify-center items-center w-full h-full">
                <Bar data={yearlyData} className="w-full h-full" />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </main>
  );
};

export default UserVisit;
