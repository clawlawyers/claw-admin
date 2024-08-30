import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import AllowedLoginDialog from "./components/AllowedLoginDialog";

const Referral = () => {
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
                <tr className=" text-white bg-teal-500">
                  <th className="p-2 text-left">
                    <input
                      type="checkbox"
                      className="text-center"
                      checked={
                        selectedUserIds.length === userData.length &&
                        userData.length > 0
                      }
                      onChange={(e) =>
                        setSelectedUserIds(
                          e.target.checked
                            ? userData.map((user) => user._id)
                            : []
                        )
                      }
                    />
                  </th>
                  <th className="p-2">Phone Number</th>
                  <th className="p-2">First Name</th>
                  <th className="p-2">Last Name</th>
                  <th className="p-2">Plan</th>
                  <th className="p-2">Tokens Used</th>
                  <th className="p-2">Total Tokens Available</th>
                  <th className="p-2">Daily Engagement Time</th>
                  <th className="p-2">Monthly Engagement Time</th>
                  <th className="p-2">Yearly Engagement Time</th>
                 
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-neutral-700 text-white"
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={(e) =>
                          handleCheckboxChange(user._id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="p-2 text-center">{user.phoneNumber}</td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "firstName",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.firstName
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "lastName",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.lastName
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.plan}
                          onChange={(e) =>
                            handleInputChange(user._id, "plan", e.target.value)
                          }
                        />
                      ) : (
                        user.plan
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.totalTokensUsed}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "totalTokensUsed",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.totalTokensUsed
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.totalTokensAvailable}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "totalTokensAvailable",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.totalTokensAvailable
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.dailyEngagementTime}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "dailyEngagementTime",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.dailyEngagementTime
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.monthlyEngagementTime}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "monthlyEngagementTime",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.monthlyEngagementTime
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {editableUserId === user._id ? (
                        <input
                          className="bg-black p-1 text-center w-20"
                          value={user.yearlyEngagementTime}
                          onChange={(e) =>
                            handleInputChange(
                              user._id,
                              "yearlyEngagementTime",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        user.yearlyEngagementTime
                      )}
                    </td>
              
                   
                     
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default Referral;