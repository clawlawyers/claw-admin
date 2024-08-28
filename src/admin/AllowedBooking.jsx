import { React, useEffect, useState } from "react";

import {
  Add,
  Check,
  CheckCircle,
  CheckCircleOutline,
  Delete,
  Edit,
} from "@mui/icons-material";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";
import toast from "react-hot-toast";
import AllowedDialog from "./components/AllowedDialog";
import dayjs from "dayjs";

const AllowedBooking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userAddDialog, setUserDialog] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userData, setUserData] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
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
  const FetchUserData = async () => {
    try {
      const response = await axios.get(
        `${NODE_API_ENDPOINT}/admin/allAllowedBooking`
      );

      const userDataObject = response.data.data;

      // Assuming userDataObject is an object where each key represents a user or booking
      // Convert it to an array
      const userDataArray = Object.values(userDataObject);

      setUserData(userDataArray);
    } catch (error) {
      console.error("Error fetching user data", error);
      toast.error("Error fetching user data");
    }
  };

  useEffect(() => {
    

    FetchUserData();
  });

 

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${NODE_API_ENDPOINT}/admin/AllowedBooking/${userId}`);
      console.log("Booking deleted successfully");

      setUserData((prevUserData) =>
        prevUserData.filter((user) => user._id !== userId)
      );
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking", error);
      toast.error("Error deleting booking");
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

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedUserIds.map((userId) =>
          axios.delete(`${NODE_API_ENDPOINT}/admin/AllowedBooking/${userId}`)
        )
      );

      setUserData((prevUserData) =>
        prevUserData.filter((user) => !selectedUserIds.includes(user._id))
      );

      toast.success("Selected bookings deleted successfully");
    } catch (error) {
      console.error("Error deleting selected bookings", error);
      toast.error("Error deleting selected bookings");
    } finally {
      setSelectedUserIds([]); // Clear selected user IDs after deletion
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedUserData(user);
  };

  const handleSave = async () => {
    try {
      await axios.patch(
        `${NODE_API_ENDPOINT}/admin/AllowedBooking/${editingUserId}`,
        editedUserData
      );

      setUserData((prevUserData) =>
        prevUserData.map((user) =>
          user._id === editingUserId ? editedUserData : user
        )
      );
      toast.success("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking", error);
      toast.error("Error updating booking");
    } finally {
      setEditingUserId(null);
      setEditedUserData({});
    }
  };

  const handleInputChange = (e, field) => {
    setEditedUserData({
      ...editedUserData,
      [field]: e.target.value,
    });
  };
  
  const handleClose = () => {
    setUserDialog(false);
    FetchUserData()
  };

  return (
    <>
      <section className="h-screen w-full flex flex-row justify-center items-center gap-5 p-5">
        {/* user panel */}
        <div className="flex flex-col justify-center h-full w-full items-center relative">
          <div className="flex relative flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
            {userAddDialog && <AllowedDialog onClose={handleClose} />}
            <div className="flex flex-col lg:flex-row w-full justify-between gap-2 items-start">
              {/* Export */}
              <div className="flex flex-row items-center gap-3 mb-4 lg:mb-0">
                <button
                  onClick={() => setUserDialog(true)}
                  className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
                >
                  <div>
                    <Add />
                  </div>
                  <div className="font-semibold">Add booking Slot</div>
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

            {/* user lists */}
            <div className="border-2 overflow-y-auto overflow-x-auto border-white w-full rounded-md">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-teal-500">
                    <th className="p-2 ">Select</th>
                    <th className="p-2 text-center">Start Date</th>
                    <th className="p-2 text-center">End Date</th>

                    <th className="p-2 text-center">Start Hour</th>
                    <th className="p-2 text-center">End Hour</th>
                    <th className="p-2 text-center">Email</th>
                    <th className="p-2 text-center">Phone No</th>
                    <th className="p-2 text-center">Total Slots</th>
                    <th className="p-2 text-center">Booked Slots</th>

                    <th className="p-2"></th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {userData
                    ?.filter((val) => {
                      if (searchTerm === "" && filterDate === "") {
                        return val;
                      } else if (
                        (searchTerm === "" ||
                          val.email
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          val.phoneNumber.includes(searchTerm)) &&
                        (filterDate === "" || val.date === filterDate)
                      ) {
                        return val;
                      }
                    })
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-black/50 transition-all duration-300 border-b border-white"
                      >
                        <td className="p-2">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckboxChange(user._id, e.target.checked)
                            }
                          />
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="date"
                              value={editedUserData.StartDate || ""}
                              onChange={(e) =>
                                handleInputChange(e, "StartDate")
                              }
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            dayjs(user?.StartDate).format("YYYY-MM-DD")
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="date"
                              value={editedUserData.EndDate || ""}
                              onChange={(e) => handleInputChange(e, "EndDate")}
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            dayjs(user?.EndDate).format("YYYY-MM-DD")
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editedUserData.StartHour || ""}
                              onChange={(e) =>
                                handleInputChange(e, "StartHour")
                              }
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            user?.StartHour
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editedUserData.EndHour || ""}
                              onChange={(e) => handleInputChange(e, "EndHour")}
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            user?.EndHour
                          )}
                        </td>

                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editedUserData.email}
                              onChange={(e) => handleInputChange(e, "email")}
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            user?.email
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editedUserData.phoneNumber}
                              onChange={(e) =>
                                handleInputChange(e, "phoneNumber")
                              }
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            user?.phoneNumber
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <input
                              type="text"
                              value={editedUserData.totalSlots}
                              onChange={(e) =>
                                handleInputChange(e, "totalSlots")
                              }
                              className="w-full bg-transparent border-2 border-gray-300 rounded p-1 text-white"
                            />
                          ) : (
                            user?.totalSlots
                          )}
                        </td>
                        <td className="p-2 text-center">
                          
                            {user?.bookedSlots}
                          
                        </td>
                        <td className="p-2 text-center">
                          {editingUserId === user._id ? (
                            <button
                              onClick={handleSave}
                              className=" text-white font-semibold px-2 py-1 rounded"
                            >
                              <CheckCircleOutline />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(user)}
                              className=" text-white font-semibold px-2 py-1 rounded"
                            >
                              <Edit className="text-yellow-500 cursor-pointer" />
                            </button>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => confirmDelete(user)}
                            className=" text-white font-semibold px-2 py-1 rounded"
                          >
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
                      onClick={() => handleDelete(userToDelete._id)}
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
    </>
  );
};

export default AllowedBooking;
