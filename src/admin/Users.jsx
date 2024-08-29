import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import AllowedLoginDialog from "./components/AllowedLoginDialog";

const Users = () => {
  // Dummy user data
  const initialUserData = [
    {
      _id: "1",
      phoneNumber: "1234567890",
      plans: "Premium",
      tokenUsed: "1000",
      totalSessions: "50",
      state: "Active",
      dailyEngagementTime: "2 hours",
      monthlyEngagementTime: "50 hours",
      totalEngagementTime: "200 hours",
      createdAt: "2023-08-01",
      updatedAt: "2023-08-25",
    },
    {
      _id: "2",
      phoneNumber: "0987654321",
      plans: "Basic",
      tokenUsed: "500",
      totalSessions: "20",
      state: "Inactive",
      dailyEngagementTime: "1 hour",
      monthlyEngagementTime: "20 hours",
      totalEngagementTime: "80 hours",
      createdAt: "2023-07-15",
      updatedAt: "2023-08-20",
    },
    // Add more dummy data as needed
  ];

  const [userData, setUserData] = useState(initialUserData);
  const [searchTerm, setSearchTerm] = useState("");
  const [userAddDialog, setUserDialog] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);

  const handleDelete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user.userId !== userId)
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
  };

  const handleClose = () => {
    setUserDialog(false);
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
      prevUserData.filter((user) => !selectedUserIds.includes(user.userId))
    );
    setSelectedUserIds([]); // Clear selected user IDs after deletion
  };

  const toggleEdit = (userId) => {
    if (editableUserId === userId) {
      setEditableUserId(null); // Stop editing if clicked again
      setOriginalUserData(null); // Clear original data
    } else {
      setEditableUserId(userId); // Start editing this row
      const userToEdit = userData.find((user) => user.userId === userId);
      setOriginalUserData({ ...userToEdit }); // Store original data
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.userId === userId ? { ...user, [field]: value } : user
      )
    );
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
                  <th className="p-2">Phone No</th>
                  <th className="p-2">Plans</th>
                  <th className="p-2">Token Used</th>
                  <th className="p-2">Total Sessions</th>
                  <th className="p-2">State</th>
                  <th className="p-2">Daily Engagement Time</th>
                  <th className="p-2">Monthly Engagement Time</th>
                  <th className="p-2">Total Engagement Time</th>
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
                      val.plans
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.state.toLowerCase().includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
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
                      <td className="p-2">
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
                      <td className="p-2">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.plans}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "plans",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.plans
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
                                "tokenUsed",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.tokenUsed
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.totalSessions}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "totalSessions",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.totalSessions
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user._id ? (
                          <select
                            value={user.state}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "state",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          user.state
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.dailyEngagementTime}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "dailyEngagementTime",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.dailyEngagementTime
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.monthlyEngagementTime}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "monthlyEngagementTime",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.monthlyEngagementTime
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user.totalEngagementTime}
                            onChange={(e) =>
                              handleInputChange(
                                user._id,
                                "totalEngagementTime",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.totalEngagementTime
                        )}
                      </td>
                      <td className="p-2 text-center">{user.createdAt}</td>
                      <td className="p-2 text-center">{user.updatedAt}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => toggleEdit(user._id)}
                          className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                        >
                          {editableUserId === user._id ? <Save /> : <Edit />}
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Confirm Delete Dialog */}
          {deleteDialog && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-card-gradient p-4 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-4">
                  Are you sure you want to delete the user?
                  
                  ?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      userToDelete ? handleDelete(userToDelete.userId) : null
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Users;