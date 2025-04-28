import { useState, useCallback, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Tab } from "@headlessui/react";
import dayjs from "dayjs";
import { getAllVisitors } from "./actions/Users.action";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserVisit = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("daily");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  // Handle quick date selection
  const handleQuickSelect = (period) => {
    const today = dayjs();
    switch (period) {
      case "7days":
        setDateRange({
          startDate: today.subtract(6, "day").format("YYYY-MM-DD"),
          endDate: today.format("YYYY-MM-DD"),
        });
        break;
      case "30days":
        setDateRange({
          startDate: today.subtract(29, "day").format("YYYY-MM-DD"),
          endDate: today.format("YYYY-MM-DD"),
        });
        break;
      case "90days":
        setDateRange({
          startDate: today.subtract(89, "day").format("YYYY-MM-DD"),
          endDate: today.format("YYYY-MM-DD"),
        });
        break;
      default:
        break;
    }
    setShowDatePicker(false);
  };

  const fetchVisitorData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await getAllVisitors(params.toString());
      setVisitorData(response.data || []);
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      setVisitorData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchVisitorData();
  }, [fetchVisitorData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      title: {
        display: true,
        text: "Visitor Statistics",
        color: "white",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const processVisitorData = (data, groupBy) => {
    const today = dayjs();
    const monthAgo = today.subtract(1, "month");

    // Filter data to only include last month
    const filteredData = data.filter((visit) =>
      dayjs(visit.timestamp).isAfter(monthAgo)
    );

    const groupedData = filteredData.reduce((acc, visit) => {
      const date = dayjs(visit.timestamp);
      let key;

      switch (groupBy) {
        case "daily":
          // Get last 7 days
          key = date.format("YYYY-MM-DD");
          break;
        case "weekly":
          // Get last 7 weeks
          key = date.startOf("week").format("YYYY-MM-DD");
          break;
        case "monthly":
          // Get last 7 months
          key = date.format("YYYY-MM");
          break;
        default:
          key = date.format("YYYY-MM-DD");
      }

      if (!acc[key]) {
        acc[key] = {
          totalVisits: 0,
          uniqueVisitors: new Set(),
          avgDuration: 0,
          totalDuration: 0,
        };
      }

      acc[key].totalVisits++;
      if (visit.visitorId) acc[key].uniqueVisitors.add(visit.visitorId);
      acc[key].totalDuration += visit.visitDuration;
      acc[key].avgDuration = acc[key].totalDuration / acc[key].totalVisits;

      return acc;
    }, {});

    // Generate last 7 periods based on view type
    const periods = [];
    for (let i = 6; i >= 0; i--) {
      switch (groupBy) {
        case "daily":
          periods.push(today.subtract(i, "day").format("YYYY-MM-DD"));
          break;
        case "weekly":
          periods.push(
            today.subtract(i, "week").startOf("week").format("YYYY-MM-DD")
          );
          break;
        case "monthly":
          periods.push(today.subtract(i, "month").format("YYYY-MM"));
          break;
        default:
          periods.push(today.subtract(i, "day").format("YYYY-MM-DD"));
      }
    }

    // Ensure we have data for all periods (fill with zeros if needed)
    const normalizedData = periods.map((period) => ({
      period,
      ...(groupedData[period] || {
        totalVisits: 0,
        uniqueVisitors: new Set(),
        avgDuration: 0,
        totalDuration: 0,
      }),
    }));

    return {
      labels: normalizedData.map(({ period }) => {
        switch (groupBy) {
          case "daily":
            return dayjs(period).format("MMM DD");
          case "weekly":
            return `${dayjs(period).format("MMM DD")} - ${dayjs(period)
              .add(6, "day")
              .format("MMM DD")}`;
          case "monthly":
            return dayjs(period).format("MMM YYYY");
          default:
            return dayjs(period).format("MMM DD");
        }
      }),
      datasets: [
        {
          label: "Total Visits",
          data: normalizedData.map((data) => data.totalVisits),
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Unique Visitors",
          data: normalizedData.map((data) => data.uniqueVisitors.size),
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
        {
          label: "Avg Duration (minutes)",
          data: normalizedData.map((data) => Math.round(data.avgDuration / 60)),
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <main className="flex flex-col w-full h-screen justify-start items-center p-5">
      <section className="flex flex-col w-full justify-start space-y-10 h-full items-start">
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-white text-left font-bold text-2xl">
                Visitor Statistics
              </h2>
              <p className="text-gray-400">
                Analyzing visitor patterns and engagement metrics
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-4 py-2 bg-black/30 text-white rounded-md border border-teal-500 hover:bg-black/50"
              >
                {showDatePicker ? "Hide Date Picker" : "Custom Date Range"}
              </button>
              <button
                onClick={fetchVisitorData}
                className="px-4 py-2 bg-black/30 text-white rounded-md border border-teal-500 hover:bg-black/50"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {showDatePicker && (
            <div className="flex gap-4 items-center bg-black/30 p-4 rounded-lg border border-teal-500">
              <div className="flex flex-col">
                <label className="text-teal-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="bg-black/50 text-white px-3 py-2 rounded-md border border-teal-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-teal-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="bg-black/50 text-white px-3 py-2 rounded-md border border-teal-500"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleQuickSelect("7days")}
                  className="px-3 py-1 bg-black/50 text-white rounded-md border border-teal-500 hover:bg-black/70"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => handleQuickSelect("30days")}
                  className="px-3 py-1 bg-black/50 text-white rounded-md border border-teal-500 hover:bg-black/70"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => handleQuickSelect("90days")}
                  className="px-3 py-1 bg-black/50 text-white rounded-md border border-teal-500 hover:bg-black/70"
                >
                  Last 90 Days
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col h-[70vh] justify-start items-start w-full">
          <Tab.Group className="flex flex-col gap-10 h-full w-full">
            <Tab.List className="flex gap-4">
              {["Daily View", "Weekly View", "Monthly View"].map((tab) => (
                <Tab
                  key={tab}
                  onClick={() =>
                    setCurrentView(tab.toLowerCase().split(" ")[0])
                  }
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
                  <Bar
                    options={chartOptions}
                    data={processVisitorData(visitorData, "daily")}
                  />
                </Tab.Panel>
                <Tab.Panel className="h-full">
                  <Bar
                    options={chartOptions}
                    data={processVisitorData(visitorData, "weekly")}
                  />
                </Tab.Panel>
                <Tab.Panel className="h-full">
                  <Bar
                    options={chartOptions}
                    data={processVisitorData(visitorData, "monthly")}
                  />
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
