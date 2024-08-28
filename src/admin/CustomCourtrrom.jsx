import {  Delete, Edit,   CheckRounded } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

import Papa from "papaparse";
import { saveAs } from "file-saver";

import toast from "react-hot-toast";

import {  Popover,  } from "@mui/material";
import UserFeatureDialog from "./components/UserFeatureDialog";

const CustomCourtrrom = () => {
  const [userData, setUserData] = useState([]);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const tableRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Dummy data for testing
  const dummyData = [
    // Add your dummy data here
    {
      userId: "1",
      name: "John Doe",
      email: "johndoe@example.com",
      domain: "example.com",
      startDate: "2024-08-01",
      endDate: "2024-08-10",
      recording: "Yes",
      totalHours: "40",
      usedTime: "35",
    },
    {
      userId: "2",
      name: "Jane Smith",
      email: "janesmith@example.com",
      domain: "example.org",
      startDate: "2024-08-05",
      endDate: "2024-08-12",
      recording: "No",
      totalHours: "30",
      usedTime: "25",
    },
    {
      userId: "3",
      name: "Robert Brown",
      email: "robertbrown@example.net",
      domain: "example.net",
      startDate: "2024-08-03",
      endDate: "2024-08-09",
      recording: "Yes",
      totalHours: "20",
      usedTime: "18",
    },
  ];

  useEffect(() => {
    // Instead of fetching from API, use dummy data
    setUserData(dummyData);
  }, []);

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
    setEditableUserId(null); // Exit edit mode
    setOriginalUserData(null); // Clear original data
    toast.success("User data updated successfully");
  };

  return (
    <section
      className={`h-screen w-full flex flex-row justify-center items-center gap-5 p-5  ${open ? "blur-lg" : ""}`}
    >
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div
          ref={tableRef}
          className="flex relative flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md"
        >
          <div className="border-2 overflow-y-auto overflow-x-auto border-white w-full rounded-md">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-teal-500">
                  <th className="p-2">Select</th>
                  <th className="p-2">UserId</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Domain</th>
                  <th className="p-2">Start Date</th>
                  <th className="p-2">End Date</th>
                  <th className="p-2">Recording</th>
                  <th className="p-2">Total Hours</th>
                  <th className="p-2">Used Time</th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
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
                      val.domain
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr key={user.userId} className="border-b border-teal-600">
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
                            type="text"
                            value={user.userId}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "userId",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.userId
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
                      <td className="p-2">
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
                      <td className="p-2">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.domain}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "domain",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.domain
                        )}
                      </td>
                      <td className="p-2">
                        {editableUserId === user.userId ? (
                          <input
                            type="date"
                            value={user.startDate}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.startDate
                        )}
                      </td>
                      <td className="p-2">
                        {editableUserId === user.userId ? (
                          <input
                            type="date"
                            value={user.endDate}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "endDate",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.endDate
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.recording}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "recording",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.recording
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.totalHours}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "totalHours",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.totalHours
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.userId ? (
                          <input
                            type="text"
                            value={user.usedTime}
                            onChange={(e) =>
                              handleInputChange(
                                user.userId,
                                "usedTime",
                                e.target.value
                              )
                            }
                            className="w-full bg-transparent border-b-2 border-teal-500 outline-none"
                          />
                        ) : (
                          user.usedTime
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          aria-describedby={id}
                          onClick={handleClick}
                          className="bg-[#0E5156] p-2 rounded-md text-xs"
                        >
                          User Custom features
                        </button>
                      </td>
                      <td className="p-2 ">
                        {editableUserId === user.userId ? (
                          <button onClick={() => handleSave(user)}>
                            <CheckRounded className="text-teal-600 cursor-pointer" />
                          </button>
                        ) : (
                          <button onClick={() => toggleEdit(user.userId)}>
                            <Edit className="text-teal-600 cursor-pointer" />
                          </button>
                        )}
                      </td>
                      <td className="p-2">
                      <button onClick={() => confirmDelete(user)}>
                          <Delete className="text-teal-600 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Popover
            // className={`${open ? "backdrop-blur-lg " : ""}`}
              id={id}
              open={open}
              anchorReference="none"
              onClose={handleClose}
              PaperProps={{
                style: {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-20%, -50%)",
                  padding: "20px",
                  backgroundColor: "#0E5156",
                  border: "2px solid white", // Updated to include border style
                  width: "700px",
                  borderRadius:"10px"
                },
              }}
            >
              <UserFeatureDialog handleClose={handleClose} />
            </Popover>
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
                    <span className="font-bold">Domain:</span>{" "}
                    {userToDelete.email}
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

export default CustomCourtrrom;
