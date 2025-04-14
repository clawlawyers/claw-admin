import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState, useCallback, useEffect } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { getAllVisitors } from "./actions/Users.action";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

import InputLabel from "@mui/material/InputLabel";

import Box from "@mui/material/Box";

import toast from "react-hot-toast";
import AllowedLoginDialog from "./components/AllowedLoginDialog";

const Visitor = () => {
  const initialUserData = [
    {
      _id: "1",
      phoneNumber: "1234567890",
      firstName: "John",
      lastName: "Doe",
      plan: "Premium",
      totalTokensUsed: "1500",
      totalTokensAvailable: "3500",
      dailyEngagementTime: "3 hours",
      monthlyEngagementTime: "90 hours",
      yearlyEngagementTime: "1080 hours",
      createdAt: "2023-08-01",
      updatedAt: "2023-08-25",
    },
    {
      _id: "2",
      phoneNumber: "0987654321",
      firstName: "Jane",
      lastName: "Smith",
      plan: "Basic",
      totalTokensUsed: "800",
      totalTokensAvailable: "1200",
      dailyEngagementTime: "2 hours",
      monthlyEngagementTime: "60 hours",
      yearlyEngagementTime: "720 hours",
      createdAt: "2023-07-15",
      updatedAt: "2023-08-20",
    },
    {
      _id: "3",
      phoneNumber: "4567891230",
      firstName: "Alice",
      lastName: "Brown",
      plan: "Standard",
      totalTokensUsed: "1000",
      totalTokensAvailable: "2000",
      dailyEngagementTime: "2.5 hours",
      monthlyEngagementTime: "75 hours",
      yearlyEngagementTime: "900 hours",
      createdAt: "2023-06-10",
      updatedAt: "2023-08-18",
    },
    {
      _id: "4",
      phoneNumber: "9876543210",
      firstName: "Bob",
      lastName: "Johnson",
      plan: "Premium",
      totalTokensUsed: "2000",
      totalTokensAvailable: "5000",
      dailyEngagementTime: "4 hours",
      monthlyEngagementTime: "120 hours",
      yearlyEngagementTime: "1440 hours",
      createdAt: "2023-05-20",
      updatedAt: "2023-08-22",
    },
    {
      _id: "5",
      phoneNumber: "6789012345",
      firstName: "Charlie",
      lastName: "Davis",
      plan: "Basic",
      totalTokensUsed: "700",
      totalTokensAvailable: "1300",
      dailyEngagementTime: "1.5 hours",
      monthlyEngagementTime: "45 hours",
      yearlyEngagementTime: "540 hours",
      createdAt: "2023-07-01",
      updatedAt: "2023-08-21",
    },
  ];
  
  const [sortValue, setSort] = useState("");
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userAddDialog, setUserDialog] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 30,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleCloseFilter = () => setOpen(false);

  const handleDateChange = (event) => {
    setStartDate(event.target.value);
    console.log(event.target.value); // Update state with the new date
  };
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    console.log(event.target.value); // Update state with the new date
  };
  

  const handleDelete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user._id !== userId)
    );
    toast.success("User deleted successfully");
    setDeleteDialog(false);
    setUserToDelete(null);
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const cancelDelete = () => {
    setDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleExport = () => {
    const csv = Papa.unparse(userData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "userData.csv");
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = () => {
    // Implement filtering logic here
    setOpen(true);
  };

  const handleClose = () => {
    setUserDialog(false);
  };
  const fetchVisitorData = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page,
        limit: 30
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (sortValue) params.append('sort', sortValue);

      const res = await getAllVisitors(params.toString());
      console.log('API Response:', res); // Keep this for debugging
      
      if (res && res.data && Array.isArray(res.data)) {
        setUserData(res.data);
        // Use pagination info from API response if available
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          // Fallback to calculating from data length
          setPagination({
            total: res.data.length,
            page: page,
            limit: 30,
            totalPages: Math.ceil(res.data.length / 30)
          });
        }
      } else {
        setUserData([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 30,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setUserData([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 30,
        totalPages: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, startDate, endDate, sortValue]);

  useEffect(() => {
    fetchVisitorData(1);
  }, [fetchVisitorData]);

  const handleCheckboxChange = (userId, isChecked) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (isChecked) {
        return [...prevSelectedUserIds, userId];
      } else {
        return prevSelectedUserIds.filter((id) => id !== userId);
      }
    });
  };

  const handleDeleteSelected = () => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => !selectedUserIds.includes(user._id))
    );
    setSelectedUserIds([]); // Clear selected user IDs after deletion
  };

  const toggleEdit = (userId) => {
    if (editableUserId === userId) {
      setEditableUserId(null); // Stop editing if clicked again
      setOriginalUserData(null); // Clear original data
    } else {
      setEditableUserId(userId); // Start editing this row
      const userToEdit = userData.find((user) => user._id === userId);
      setOriginalUserData({ ...userToEdit }); // Store original data
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user._id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleSave = (user) => {
    const dataChanged =
      JSON.stringify(originalUserData) !== JSON.stringify(user);

    if (!dataChanged) {
      setEditableUserId(null); // Exit edit mode without API call
      return;
    }

    toast.success("User data updated successfully");

    setEditableUserId(null); // Exit edit mode
    setOriginalUserData(null); // Clear original data
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
    if (event.target.value == 1) {
      const data = userData.sort((a, b) =>new Date( b.timestamp) - new Date(a.timestamp));
      setUserData(data);
    }
    if (event.target.value == 2) {
      const data = userData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setUserData(data);
    }
   
  };
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    fetchVisitorData(1);
  };

  // Add page change handler
  const handlePageChange = (newPage) => {
    if (newPage === pagination.page) return;
    fetchVisitorData(newPage);
  };

  const filteredData = userData.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.userId?.toLowerCase().includes(searchLower) ||
      user.visitorId?.toLowerCase().includes(searchLower) ||
      user.timestamp?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section className="h-screen w-full flex flex-col justify-between items-center gap-5 p-5">
      <div className="flex flex-col justify-start h-full w-full items-center">
        <div className="flex relative flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
          <div className="flex flex-col lg:flex-row w-full justify-between gap-2 items-start">
            <div className="flex flex-row items-center gap-3 mb-4 lg:mb-0">
              <button
                onClick={handleExport}
                className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div>
                  <Share />
                </div>
                <div className="font-semibold">Export</div>
              </button>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                className="text-white"
                label="SORT"
                value={sortValue}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                placeholder="asdsa"
                onChange={handleSortChange}
                style={{
                  backgroundColor: "transparent", // Transparent background
                  border: "2px solid #38b2ac", // Teal border
                  boxShadow: "0 10px 15px rgba(0, 0, 0, 0.5)", // Shadow with black color
                  borderRadius: "0.375rem", // Rounded corners (md size in Tailwind)
                  color: "white", // White text
                  padding: "0px 0px", // Padding for better appearance
                  display: "flex",
                  alignItems: "center",
                  gap: "12px", // Space between items (space-x-3 in Tailwind)
                }}
                IconComponent={() => null} // Optional: Removes default arrow icon (if you don't want it)
              >
                 <MenuItem value="" disabled>Sort</MenuItem>
                <MenuItem value={1}>Time Latest</MenuItem>
                <MenuItem value={2}>Time Oldest</MenuItem>
          
              </Select>

              <button
                onClick={handleFilter}
                className="bg-transparent border-2 border-teal-500 shadow-lg space-x-3 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div>
                  <FilterAltIcon />
                </div>
                <div className="font-semibold">Filter</div>
              </button>

              <button
                onClick={handleDeleteSelected}
                className={`bg-card-gradient shadow-lg space-x-3 p-2 px-2 rounded-md shadow-black text-white flex items-center ${
                  selectedUserIds.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedUserIds.length === 0}
              >
                <div>
                  <Delete />
                </div>
                <div className="font-semibold">
                  Delete ({selectedUserIds.length})
                </div>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleChange}
              className="border-2 w-full lg:w-2/6 border-gray-300 bg-white h-10 text-neutral-900 px-2 font-semibold rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div className="border-2 overflow-y-auto overflow-x-auto border-white w-full rounded-md">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className=" text-white bg-teal-500">
                  <th className="p-2 text-left">Timestamp</th>
                  <th className="p-2 text-left">Path</th>
                  <th className="p-2 text-left">Visit Duration</th>
                  <th className="p-2 text-left">User ID</th>
                  <th className="p-2 text-left">Visitor ID</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                        <span className="ml-3 text-white">Loading...</span>
                      </div>
                      </td>
                  </tr>
                ) : (
                  filteredData.map((visit) => (
                    <tr key={visit._id} className="border-b">
                      <td className="p-2 text-left">{new Date(visit.timestamp).toLocaleString()}</td>
                      <td className="p-2 text-left">{visit.path}</td>
                      <td className="p-2 text-left">{Math.floor(visit.visitDuration / 60)} minutes</td>
                      <td className="p-2 text-left">{visit.userId || 'Anonymous'}</td>
                      <td className="p-2 text-left">{visit.visitorId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4 w-full">
              <button
          onClick={() => handlePageChange(1)}
          disabled={pagination.page === 1 || isLoading}
          className={`px-3 py-1 rounded-md ${
            pagination.page === 1 || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          First
              </button>
              <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}
          className={`px-3 py-1 rounded-md ${
            pagination.page === 1 || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          Previous
              </button>

        <span className="text-sm text-white px-4">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages || isLoading}
          className={`px-3 py-1 rounded-md ${
            pagination.page === pagination.totalPages || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(pagination.totalPages)}
          disabled={pagination.page === pagination.totalPages || isLoading}
          className={`px-3 py-1 rounded-md ${
            pagination.page === pagination.totalPages || isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          Last
            </button>
          </div>
    </section>
  );
};

export default Visitor;
