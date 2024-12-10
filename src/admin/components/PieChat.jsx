import React from "react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getUserDist } from "../actions/Dashboard.action";

const data = [
  { name: "Category 1", value: 400 },
  { name: "Category 2", value: 300 },
  { name: "Category 3", value: 300 },
  { name: "Category 4", value: 200 },
  { name: "Category 5", value: 278 },
  { name: "Category 6", value: 189 },
  { name: "Category 7", value: 239 },
  { name: "Category 8", value: 349 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
];

const MyPieChart = () => {
  const [userData, setUserData] = useState([
    { name: "Category 1", value: 400 },
    { name: "Category 2", value: 300 },
    { name: "Category 3", value: 300 },
    { name: "Category 4", value: 200 },
    { name: "Category 5", value: 278 },
    { name: "Category 6", value: 189 },
    { name: "Category 7", value: 239 },
    { name: "Category 8", value: 349 },
  ]);
  const getAllUsers = async () => {
    try {
      const res = await getUserDist();
      console.log(res.data);
      setUserData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="bg-white flex-1 rounded-md p-5 flex flex-col text-black h-[65vh]">
      <h2 className="text-lg text-center text-teal-700 font-semibold">
        User Plan Distribution
      </h2>
      <div className="flex justify-center items-center flex-1">
        <PieChart width={350} height={350}>
          <Pie
            data={userData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {userData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default MyPieChart;
