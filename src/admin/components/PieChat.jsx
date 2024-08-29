import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  // Data for the pie chart
  const data = {
    
    datasets: [
      {
        label: "Dataset",
        data: [12, 19, 3, 5, 2, 3, 8, 7],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(123, 239, 178, 0.6)"
        ],
        borderWidth: 1,
        borderColor: "#fff",
        hoverBorderColor: "#000"
      }
    ]
  };

  // Options for customizing the pie chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      }
    }
  };

  return (
    
      
      <Pie data={data} options={options} />
    
  );
};

export default PieChart;
