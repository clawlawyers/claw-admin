import React, { useCallback, useEffect, useState } from "react";
import { getAllVisitors } from "./actions/Users.action";
import dayjs from "dayjs";

const TRACKED_PATHS = [
  { path: "/quiz", name: "Quiz" },
  { path: "/", name: "Home" },
  { path: "/news", name: "News" },
  { path: "/blog", name: "Blog" },
  { path: "/case/search", name: "Case Search" },
  { path: "/gpt/legalGPT", name: "Legal GPT" },
  { path: "/pricing", name: "Pricing" },
  { path: "/adira", name: "Adira" },
  { path: "/payment", name: "Payment" },
];

const PageTrack = () => {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    dayjs().subtract(30, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [sortField, setSortField] = useState("visits");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPath, setSelectedPath] = useState("all");
  const [viewMode, setViewMode] = useState("all"); // "all" or "specific"

  // Fetch visitor data and aggregate by page
  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      const baseParams = `startDate=${startDate}&endDate=${endDate}`;

      // If in specific view mode, only fetch for selected path
      if (viewMode === "specific" && selectedPath !== "all") {
        const res = await getAllVisitors(`${baseParams}&path=${selectedPath}`);
        const pathData = processPathData(selectedPath, res.data || []);
        setPageData([pathData]);
        return;
      }

      // Fetch data for all tracked paths
      const pathPromises = TRACKED_PATHS.map(async ({ path, name }) => {
        try {
          const res = await getAllVisitors(`${baseParams}&path=${path}`);
          return processPathData(path, res.data || [], name);
        } catch (error) {
          console.error(`Error fetching data for path ${path}:`, error);
          return {
            path,
            displayName: name,
            visits: 0,
            uniqueVisitors: 0,
            uniqueUsers: 0,
            avgDuration: 0,
            totalDuration: 0,
            lastVisit: "N/A",
          };
        }
      });

      const results = await Promise.all(pathPromises);
      setPageData(results);
    } catch (error) {
      console.error("Error fetching page data:", error.message);
      // On error, show all tracked paths with zero counts
      const emptyPagesArray = TRACKED_PATHS.map(({ path, name }) => ({
        path,
        displayName: name,
        visits: 0,
        uniqueVisitors: 0,
        uniqueUsers: 0,
        avgDuration: 0,
        totalDuration: 0,
        lastVisit: "N/A",
      }));
      setPageData(emptyPagesArray);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, viewMode, selectedPath]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  // Handle quick date selection
  const handleQuickSelect = (period) => {
    const today = dayjs();
    switch (period) {
      case "7days":
        setStartDate(today.subtract(6, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "30days":
        setStartDate(today.subtract(29, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "90days":
        setStartDate(today.subtract(89, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      default:
        break;
    }
    setShowDatePicker(false);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sorted and filtered data
  const getSortedAndFilteredData = () => {
    // Filter by search term
    let filteredData = pageData;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = pageData.filter((page) =>
        page.path.toLowerCase().includes(term)
      );
    }

    // Sort data
    return filteredData.sort((a, b) => {
      let comparison = 0;

      // Handle different field types
      if (sortField === "path") {
        comparison = a.path.localeCompare(b.path);
      } else if (sortField === "lastVisit") {
        // Convert to timestamps for comparison
        const dateA = a.lastVisit !== "N/A" ? dayjs(a.lastVisit).valueOf() : 0;
        const dateB = b.lastVisit !== "N/A" ? dayjs(b.lastVisit).valueOf() : 0;
        comparison = dateA - dateB;
      } else {
        // Numeric fields
        comparison = a[sortField] - b[sortField];
      }

      // Apply sort direction
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Format duration in minutes and seconds
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Helper function to process data for a single path
  const processPathData = (path, data, displayName) => {
    const uniqueVisitors = new Set();
    const uniqueUsers = new Set();
    let totalDuration = 0;
    let lastVisit = null;

    data.forEach((visit) => {
      if (visit.visitorId) uniqueVisitors.add(visit.visitorId);
      if (visit.userId) uniqueUsers.add(visit.userId);
      totalDuration += visit.visitDuration || 0;

      const visitTime = dayjs(visit.timestamp);
      if (!lastVisit || visitTime.isAfter(lastVisit)) {
        lastVisit = visitTime;
      }
    });

    return {
      path,
      displayName: displayName || path,
      visits: data.length,
      uniqueVisitors: uniqueVisitors.size,
      uniqueUsers: uniqueUsers.size,
      totalDuration,
      avgDuration:
        data.length > 0 ? Math.round(totalDuration / data.length) : 0,
      lastVisit: lastVisit ? lastVisit.format("YYYY-MM-DD HH:mm") : "N/A",
    };
  };

  const sortedData = getSortedAndFilteredData();

  return (
    <main className="flex flex-col w-full h-screen justify-start items-center p-5">
      <section className="flex flex-col w-full justify-start space-y-6 h-full items-start">
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-white text-left font-bold text-2xl">
                Page Visit Tracking
              </h2>
              <p className="text-gray-400">
                Analyzing page visits and engagement metrics
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
                onClick={fetchPageData}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* New view mode selector */}
          <div className="flex gap-4 items-center bg-black/30 p-4 rounded-lg border border-teal-500">
            <div className="flex items-center gap-4">
              <label className="text-teal-500">View Mode:</label>
              <select
                value={viewMode}
                onChange={(e) => {
                  setViewMode(e.target.value);
                  if (e.target.value === "all") setSelectedPath("all");
                }}
                className="bg-black/50 text-white px-3 py-2 rounded-md border border-teal-500"
              >
                <option value="all">All Pages</option>
                <option value="specific">Specific Page</option>
              </select>

              {viewMode === "specific" && (
                <select
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  className="bg-black/50 text-white px-3 py-2 rounded-md border border-teal-500"
                >
                  <option value="all">Select a page</option>
                  {TRACKED_PATHS.map((path) => (
                    <option key={path.path} value={path.path}>
                      {path.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {showDatePicker && (
            <div className="flex gap-4 items-center bg-black/30 p-4 rounded-lg border border-teal-500">
              <div className="flex flex-col">
                <label className="text-teal-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-black/50 text-white px-3 py-2 rounded-md border border-teal-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-teal-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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

          <div className="flex w-full mb-4">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 text-white rounded-md border border-teal-500"
            />
          </div>

          <div className="w-full overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <table className="min-w-full bg-black/20 rounded-lg overflow-hidden">
                <thead className="bg-black/40 text-white">
                  <tr>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("path")}
                    >
                      Page Path {getSortIndicator("path")}
                    </th>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("visits")}
                    >
                      Total Visits {getSortIndicator("visits")}
                    </th>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("uniqueVisitors")}
                    >
                      Unique Visitors {getSortIndicator("uniqueVisitors")}
                    </th>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("uniqueUsers")}
                    >
                      Registered Users {getSortIndicator("uniqueUsers")}
                    </th>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("avgDuration")}
                    >
                      Avg. Duration {getSortIndicator("avgDuration")}
                    </th>
                    <th
                      className="p-3 text-left cursor-pointer hover:bg-black/50"
                      onClick={() => handleSort("lastVisit")}
                    >
                      Last Visit {getSortIndicator("lastVisit")}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No page data available for the selected period
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((page, index) => (
                      <tr
                        key={page.path}
                        className={`border-t border-gray-700 ${
                          index % 2 === 0 ? "bg-black/10" : "bg-black/20"
                        } hover:bg-black/30`}
                      >
                        <td className="p-3 text-left">
                          {page.displayName} ({page.path})
                        </td>
                        <td className="p-3 text-left">{page.visits}</td>
                        <td className="p-3 text-left">{page.uniqueVisitors}</td>
                        <td className="p-3 text-left">{page.uniqueUsers}</td>
                        <td className="p-3 text-left">
                          {formatDuration(page.avgDuration)}
                        </td>
                        <td className="p-3 text-left">{page.lastVisit}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-between items-center text-white mt-4">
            <div>Total Pages: {sortedData.length}</div>
            <div>
              Total Visits:{" "}
              {sortedData.reduce((sum, page) => sum + page.visits, 0)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PageTrack;
