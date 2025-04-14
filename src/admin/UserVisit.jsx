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
import { getVistors } from "./actions/Users.action";
import dayjs from 'dayjs';

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
  const [userData, setUserData] = useState([]);
  const [type, setType] = useState(2); // Default to monthly view
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getVistors(types[type]);
      if (res.data && Array.isArray(res.data)) {
        setUserData(res.data);
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'User Registration & Visitor Statistics',
        color: 'white',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const getLast7Days = () => {
    // For daily view - show last 7 entries
    const last7 = userData.slice(-7);
    
    return {
      labels: last7.map(item => dayjs(item.date).format('MMM DD')),
      datasets: [
        {
          label: 'Registered Users',
          data: last7.map(item => item.registeredUsers),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: 'Visitors',
          data: last7.map(item => item.visitors),
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        }
      ],
    };
  };

  const getLast7Weeks = () => {
    // For weekly view - show last 7 entries
    const last7 = userData.slice(-7);
    
    return {
      labels: last7.map(item => {
        const date = dayjs(item.week);
        return `${date.format('MMM DD')} - ${date.add(6, 'day').format('MMM DD')}`;
      }),
      datasets: [
        {
          label: 'Registered Users',
          data: last7.map(item => item.registeredUsers),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: 'Visitors',
          data: last7.map(item => item.visitors),
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        }
      ],
    };
  };

  const getLast7Months = () => {
    // For monthly view - show last 7 entries
    const last7 = userData.slice(-7);
    
    return {
      labels: last7.map(item => dayjs(item.month).format('MMM YYYY')),
      datasets: [
        {
          label: 'Registered Users',
          data: last7.map(item => item.registeredUsers),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: 'Visitors',
          data: last7.map(item => item.visitors),
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        }
      ],
    };
  };

  return (
    <main className="flex flex-col w-full h-screen justify-start items-center p-5">
      <section className="flex flex-col w-full justify-start space-y-10 h-full items-start">
        <div className="flex flex-col space-y-4">
          <h2 className="text-white text-left font-bold text-2xl">
            User Statistics
          </h2>
          <p className="text-gray-400">
            Comparing registered users and visitors over time
          </p>
        </div>
        <div className="flex flex-col h-[70vh] justify-start items-start w-full">
          <Tab.Group className="flex flex-col gap-10 h-full w-full" defaultIndex={2}>
            <Tab.List className="flex gap-4">
              {["Daily View", "Weekly View", "Monthly View"].map((tab, i) => (
                <Tab
                  key={tab}
                  onClick={() => setType(i)}
                  className={({ selected }) =>
                    `p-2 px-10 rounded-md border border-white transition-colors ${
                      selected
                        ? "bg-transparent text-white"
                        : "bg-black/30 text-gray-400 hover:bg-black/50"
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            {loading ? (
              <div className="flex-grow flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <Tab.Panels className="flex-grow w-full h-full">
                <Tab.Panel className="h-full">
                  <Bar options={chartOptions} data={getLast7Days()} />
                </Tab.Panel>
                <Tab.Panel className="h-full">
                  <Bar options={chartOptions} data={getLast7Weeks()} />
                </Tab.Panel>
                <Tab.Panel className="h-full">
                  <Bar options={chartOptions} data={getLast7Months()} />
                </Tab.Panel>
              </Tab.Panels>
            )}
          </Tab.Group>
        </div>
      </section>
    </main>
  );
};

export default UserVisit;
