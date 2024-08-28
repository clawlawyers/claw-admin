import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import { saveAs } from "file-saver";

import { NODE_API_ENDPOINT } from "../utils/utils";
import axios from "axios";
import toast from "react-hot-toast";
import AllowedLoginDialog from "./components/AllowedLoginDialog";


const AllowedLogin = () => {
  const [userData, setUserData] = useState([]);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userAddDialog, setUserDialog] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [flag, setFlag] = useState(false);

  
  const FetchUserData = async () => {
    setFlag(true);
    try {
      const response = await axios.get(
        `${NODE_API_ENDPOINT}/admin/getAllallowedLogin`
      );
      const userDataObject = response.data.data;

      const flattenedData = Object.values(userDataObject).flatMap((user) =>
        user.courtroomBookings.map((booking) => ({
          ...user,
          name: booking.name,
          email: booking.email,
          phoneNumber: booking.phoneNumber,
          recording: booking.recording ? "true" : "false",
          userId: booking._id,
        }))
      );

      setUserData(flattenedData);
      console.log(flattenedData);
    } catch (error) {
      console.error("Error fetching user data", error);
      toast.error("Error fetching user data");
    }
    setFlag(false);
  };

  useEffect(() => {
   

    FetchUserData();
  }, []);

  const handleDelete = async (bookingId, userId) => {
    try {
      await axios.delete(
        `${NODE_API_ENDPOINT}/admin/allowedLogin/${bookingId}/users/${userId}`
      );
      setUserData((prevUserData) =>
        prevUserData.filter((user) => user.userId !== userId)
      );
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Error deleting user");
    } finally {
      setDeleteDialog(false);
      setUserToDelete(null);
    }
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
    FetchUserData();
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

  const handleSave = async (user) => {
    // Check if data has changed
    const dataChanged =
      JSON.stringify(originalUserData) !== JSON.stringify(user);
  
    if (!dataChanged) {
      setEditableUserId(null); // Exit edit mode without API call
      return;
    }
  
    try {
      await axios.put(
        `${NODE_API_ENDPOINT}/admin/allowedLogin/users/${user.userId}`,
        user
      );
  
      const res2 = await axios.put(
        `${NODE_API_ENDPOINT}/admin/allowedLogin/${user._id}/users/${user.userId}/slot`,
        {
          newDate: user.date,
          newHour: user.hour,
        }
      );
      console.log(res2);
  
      toast.success("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data", error);
      toast.error("Error updating user data");
    } finally {
      setEditableUserId(null); // Exit edit mode
      setOriginalUserData(null); // Clear original data
    }
  };

  return (
    <section className="h-screen w-full flex flex-row justify-center items-center gap-5 p-5">
      <div className="flex flex-col justify-center h-full w-full items-center ">
        <div className="flex relative flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
          {userAddDialog && <AllowedLoginDialog onClose={handleClose} />}
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
                onClick={() => setUserDialog(true)}
                className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div>
                  <Add />
                </div>
                <div className="font-semibold">Add User</div>
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
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone No</th>
                  <th className="p-2">Record</th>
                  <th className="p-2">User ID</th>
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
                      val.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.phoneNumber.includes(searchTerm) ||
                      val.date.includes(searchTerm)
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr
                      key={user._id}
                      className=" border-b border-teal-600"
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.userId)}
                          onChange={(e) =>
                            handleCheckboxChange(user.userId, e.target.checked)
                          }
                        />
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <input
                            type="date"
                            value={user.date}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "date",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.date
                        )}
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <select
                            value={user.hour}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "hour",
                                e.target.value
                              )
                            }
                            className="w-full text-white rounded-md bg-neutral-800 border-b-2 border-teal-500 outline-none"
                          >
                            <option value="">--Select hour--</option>
                            {[...Array(24).keys()].map((hour) => (
                              <option key={hour} value={hour}>
                                {hour.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          user.hour
                        )}
                      </td>
                      <td className="p-2">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.email}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "email",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.email
                        )}
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.phoneNumber}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "phoneNumber",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.phoneNumber
                        )}
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <select
                            value={user.recording}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "recording",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          user.recording
                        )}
                      </td>
                      <td className="p-2 ">{user.userId}</td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <button onClick={() => handleSave(user)}>
                            <Save className="text-green-500 cursor-pointer" />
                          </button>
                        ) : (
                          <button onClick={() => toggleEdit(user.userId)}>
                            <Edit className="text-yellow-500 cursor-pointer" />
                          </button>
                        )}
                      </td>
                      <td className="p-2 ">
                        <button onClick={() => confirmDelete(user)}>
                          <Delete className="text-red-500 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {deleteDialog && userToDelete && (
            <div
            className="py-3"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: "0",
              right: "0",
              backdropFilter: "blur(3px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "10",
            }}
          >
            <div className="m-32 w-2/3 flex flex-col border-4 border-red-600 rounded bg-gradient-to-r from-[#008080] to-[#003131]">
              <div className="p-3 flex w-full justify-between items-center">
                <h5 className="m-0 px-1 font-bold">
                  Proceed with Deleting User?
                </h5>
                <svg
                  className="h-10 w-10 cursor-pointer"
                  fill="white"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={cancelDelete}
                >
                  <path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm4.292 6.707c-.391-.391-1.024-.391-1.415 0l-2.877 2.877-2.877-2.877c-.391-.391-1.024-.391-1.415 0-.391.391-.391 1.024 0 1.415l2.878 2.878-2.878 2.878c-.391.391-.391 1.024 0 1.415.391.391 1.024.391 1.415 0l2.877-2.878 2.877 2.878c.391.391 1.024.391 1.415 0 .391-.391.391-1.024 0-1.415l-2.878-2.878 2.878-2.878c.391-.391.391-1.024 0-1.415z"
                    fillRule="nonzero"
                  />
                </svg>
              </div>

              <div className="flex flex-col px-10">
                <div>
                  
                  <p>
                    <span className="font-bold">Username:</span>{" "}
                    {userToDelete.name}
                  </p>
                </div>
                <div>
                  
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    {userToDelete.email}
                  </p>
                </div>
                <div>
                 
                  <p>
                    <span className="font-bold">Phone Number:</span>{" "}
                    {userToDelete.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="w-full p-3 px-10 flex justify-end items-center">
                <button
                  className="flex justify-center items-center px-4 p-2 text-center bg-white text-teal-700 border-2 border-white rounded font-bold"
                  onClick={() => handleDelete(userToDelete._id ,userToDelete.userId)}
                >
                  Confirm
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

export default AllowedLogin;
