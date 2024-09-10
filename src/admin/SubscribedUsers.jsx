import React, { useCallback, useEffect, useState } from "react";
import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { getSubscribedUsers } from "./actions/Users.action";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
const SubscribedUsers = () => {
  const [sortValue, setSort] = useState("");
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

  // Dummy user data
  const initialUserData = [
    {
      _id: "1",
      phoneNumber: "1234567890",
      planName: "Premium",
      tokensUsed: "1000",
      createdAt: "2023-08-01",
      updatedAt: "2023-08-25",
    },
    {
      _id: "2",
      phoneNumber: "0987654321",
      planName: "Basic",
      tokensUsed: "500",
      createdAt: "2023-07-15",
      updatedAt: "2023-08-20",
    },
  ];

  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [tokenValue, setTokenValue] = useState(null);
  const [gptTokenValue, setgptTokenValue] = useState(null);
  const [planCode, setPlanCode] = useState(null);

  const handleClose = () => setOpen(false);
  const handleTokenValueChange = (event, newValue) => {
    setTokenValue(newValue);
  };
  const handlegptValueChange = (event, newValue) => {
    setgptTokenValue(newValue);
  };
  const handleplanCodeValueChange = (event, newValue) => {
    console.log(newValue);
    setPlanCode(event.target.value);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const res = await getSubscribedUsers();
      setUserData(res);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDelete = () => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user._id !== userToDelete._id)
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

  const handleSortChange = (event) => {
    setSort(event.target.value);
    if (event.target.value == 2) {
      const data = userData.sort((a, b) => b.tokenUsed - a.tokenUsed);
      setUserData(data);
    }
    if (event.target.value == 1) {
      const data = userData.sort((a, b) => b.gptTokenUsed - a.gptTokenUsed);
      setUserData(data);
    }
    if (event.target.value == 3) {
      const data = userData.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setUserData(data);
    }
    if (event.target.value == 4) {
      const data = userData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUserData(data);
    }
    if (event.target.value == 5) {
      const data = userData.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );

      setUserData(data);
    }
    if (event.target.value == 6) {
      const data = userData.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setUserData(data);
    }
  };

  const handleSave = (user) => {
    // Check if data has changed
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

              <button
                onClick={handleFilter}
                className="bg-transparent border-2 border-teal-500 shadow-lg space-x-3 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div>
                  <FilterAltIcon />
                </div>
                <div className="font-semibold">Filter</div>
              </button>
              {/* <div className="bg-transparent border-2 border-teal-500 shadow-lg space-x-3  rounded-md shadow-black text-white flex items-center"> */}

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
                <MenuItem value={1}>Sort On GPT tokens</MenuItem>
                <MenuItem value={2}>Sort On Case Search Tokens</MenuItem>
                <MenuItem value={3}>Date Created Oldest</MenuItem>
                <MenuItem value={4}>Date Created Latest</MenuItem>
                <MenuItem value={5}>Date Updated Oldest</MenuItem>
                <MenuItem value={6}>Date Updated Latest</MenuItem>
              </Select>
              {/* </div> */}

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
                <tr className="bg-teal-500">
                  <th className="p-2">Select</th>
                  <th className="p-2">Phone Number</th>
                  <th className="p-2">Plan Name</th>
                  <th className="p-2">Gpt Tokens Used</th>
                  <th className="p-2">Case Search Tokens Used</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Updated At</th>
                  <th className="p-2">Edit</th>
                  <th className="p-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {userData
                  .filter((val) => {
                    if (searchTerm === "") {
                      return val;
                    } else if (
                      val.phoneNumber.includes(searchTerm) ||
                      val.planName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => {
                    console.log(user.tokenUsed);
                    if (
                      tokenValue != null &&
                      tokenValue < parseInt(user.tokenUsed)
                    ) {
                      return;
                    }
                    if (
                      gptTokenValue != null &&
                      gptTokenValue < parseInt(user.gptTokenUsed)
                    ) {
                      return;
                    }
                    if (planCode != null && planCode != user.planName) {
                      return;
                    }
                    return (
                      <tr key={user._id} className="border-b border-teal-600">
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user._id)}
                            onChange={(e) =>
                              handleCheckboxChange(user._id, e.target.checked)
                            }
                          />
                        </td>
                        <td className="p-2 text-center">
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
                              className="border-2 border-gray-300 p-1 rounded-md w-full"
                            />
                          ) : (
                            user.phoneNumber
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={user.planName}
                              onChange={(e) =>
                                handleInputChange(
                                  user._id,
                                  "planName",
                                  e.target.value
                                )
                              }
                              className="border-2 border-gray-300 p-1 rounded-md w-full"
                            />
                          ) : (
                            user.planName
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={user.gptTokenUsed}
                              onChange={(e) =>
                                handleInputChange(
                                  user._id,
                                  "gptTokenUsed",
                                  e.target.value
                                )
                              }
                              className="border-2 border-gray-300 p-1 rounded-md w-full"
                            />
                          ) : (
                            user.gptTokenUsed
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editableUserId === user._id ? (
                            <input
                              type="text"
                              value={user.tokenUsed}
                              onChange={(e) =>
                                handleInputChange(
                                  user._id,
                                  "tokensUsed",
                                  e.target.value
                                )
                              }
                              className="border-2 border-gray-300 p-1 rounded-md w-full"
                            />
                          ) : (
                            user.tokenUsed
                          )}
                        </td>
                        <td className="p-2 text-center">{user.createdAt}</td>
                        <td className="p-2 text-center">{user.updatedAt}</td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              if (editableUserId === user._id) {
                                handleSave(user); // Save and exit edit mode
                              } else {
                                toggleEdit(user._id); // Enter edit mode
                              }
                            }}
                            className={` rounded-md p-1 ${
                              editableUserId === user._id
                                ? "text-teal-500"
                                : "text-teal-500"
                            }`}
                          >
                            {editableUserId === user._id ? <Save /> : <Edit />}
                          </button>
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => confirmDelete(user)}
                            className="text-teal-500 rounded-md p-1"
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 space-y-4 w-96">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="text-gray-600">
              Are you sure you want to delete the user with phone number:{" "}
              <strong>{userToDelete.phoneNumber}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <InputLabel id="demo-simple-select-label">Plan Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={planCode}
              label="planCode"
              onChange={handleplanCodeValueChange}
            >
              <MenuItem value={"PRO_U_4"}>PRO_U_4</MenuItem>
            </Select>
            <InputLabel id="demo-simple-select-label">
              Search Case Tokens
            </InputLabel>
            <Slider
              size="small"
              value={tokenValue ? tokenValue : 0}
              onChange={handleTokenValueChange}
              aria-label="Small"
              valueLabelDisplay="auto"
            />
            <InputLabel id="demo-simple-select-label">Gpt Tokens</InputLabel>
            <Slider
              size="small"
              value={gptTokenValue ? gptTokenValue : 0}
              onChange={handlegptValueChange}
              aria-label="Small"
              valueLabelDisplay="auto"
            />
          </div>
        </Box>
      </Modal>
    </section>
  );
};

export default SubscribedUsers;
