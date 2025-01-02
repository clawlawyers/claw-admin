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
  const [endDate, setendDate] = useState(null);

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
    setendDate(event.target.value);
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
  const fetchUserData = useCallback(async () => {
    try {
      const res = await getAllVisitors();
      setUserData(res);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
  const handleReset =()=>{
    setStartDate(null)
    setendDate(null)
    
  }

  return (
    <section className="h-screen w-full flex flex-row justify-center items-center gap-5 p-5">
      <div className="flex flex-col justify-center h-full w-full items-center ">
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
                  <th className="p-2 text-left">timestamp</th>
                  <th className="p-2 text-left">userid</th>
                  <th className="p-2 text-left">visitorid</th>
                  {/* <th className="p-2 text-left">Created At</th>
                  <th className="p-2 text-left">Updated At</th>
                  <th className="p-2 px-4 text-left">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {userData
                  .map((user,i) => {
                    // if(i>10){
                    //   return
                    // }
                    if (
                      startDate != null &&
                      new Date(startDate) > new Date(user.timestamp)
                    ) {
                      console.log(startDate);
                      console.log(user.date);
                      return null;
                    }
                    if (
                      endDate != null &&
                      new Date(endDate) < new Date(user.timestamp)
                    ) {
                      return;
                    }
                    return(

                      
                      <tr key={user._id} className="  border-b ">
                      <td className="p-2 text-left">{user.timestamp}</td>
                      <td className="p-2 text-left">{user.userId}</td>
                      <td className="p-2 text-left">{user.visitorId}</td>
                      {/* <td className="p-2 text-left">
                        <input
                          type="checkbox"
                          className="text-center"
                          checked={selectedUserIds.includes(user._id)}
                          onChange={(e) =>
                            handleCheckboxChange(user._id, e.target.checked)
                          }
                        />
                      </td> */}
                      {/* <td className="p-2 text-left">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.phoneNumber}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "phoneNumber",
                                e.target.value
                                )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          user.phoneNumber
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.plan}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "plan",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          user.plan
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.totalTokensUsed}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "totalTokensUsed",
                                e.target.value
                                )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          user.totalTokensUsed
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.createdAt}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "createdAt",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          user.createdAt
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.updatedAt}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "updatedAt",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          user.updatedAt
                        )}
                      </td>
                      <td className="p-2 text-left">
                        <button
                          onClick={() => toggleEdit(user._id)}
                          className="mr-2  text-teal-600 p-1 px-2 rounded-md"
                        >
                          {editableUserId === user._id ? <Save /> : <Edit />}
                        </button>
                        {editableUserId === user._id && (
                          <button
                            onClick={() => handleSave(user)}
                            className="mr-2 text-teal-600 p-1 px-2 rounded-md"
                          >
                            Save
                          </button>
                        )}
                        <button
                          onClick={() => confirmDelete(user)}
                          className=" text-teal-600 p-1 px-2 rounded-md"
                        >
                          <Delete />
                        </button>
                      </td> */}
                    </tr>
)
})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {userToDelete && deleteDialog && (
        <div className="absolute inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#D9D9D9] text-teal-600 font-bold p-5 rounded-lg text-center">
            <p>
              Are you sure you want to delete ? <br />
              {userToDelete.phoneNumber}?
            </p>
            <div className="flex justify-center gap-3 mt-3">
              <button
                onClick={() => handleDelete(userToDelete._id)}
                className="border border-teal-600 text-black px-3 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={cancelDelete}
                className="bg-teal-600 text-white px-5 py-1 rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleCloseFilter}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col">
           
            <label
              htmlFor="StartDate"
              className="text-left self-start font-semibold"
            >
              Start Date
            </label>
            <input
              id="StartDate"
              type="date"
              value={startDate || ""}
              onChange={handleDateChange}
              className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
            />
            <label
              htmlFor="endDate"
              className="text-left self-start font-semibold"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate || ""}
              onChange={handleEndDateChange}
              className="mb-4 w-full rounded-md py-2 px-1 text-neutral-800 outline-none"
            />
              <button onClick={handleReset} className="w-full bg-teal-700 px-4 py-2 rounded-md text-white">
              RESET
            </button>
            {/* <InputLabel id="demo-simple-select-label">
              Search Case Tokens
            </InputLabel>
            <Slider
              size="small"
              value={tokenValue ? tokenValue : 0}
              onChange={handleTokenValueChange}
              aria-label="Small"
              valueLabelDisplay="auto"
            /> */}
          </div>
        </Box>
      </Modal>
    </section>
  );
};

export default Visitor;
