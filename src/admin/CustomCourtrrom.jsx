import { Delete, Edit, CheckRounded, Share } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

import Papa from "papaparse";
import { saveAs } from "file-saver";

import toast from "react-hot-toast";
import MenuItem from "@mui/material/MenuItem";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Popover } from "@mui/material";
import UserFeatureDialog from "./components/UserFeatureDialog";
import {
  GetCustomCourtroomUsers,
  DeleteCustomCourtroomUser,
} from "./actions/CustomCourtroom.action";
import dayjs from "dayjs";
import AddCourtroom from "./components/AddCourtroom";

const CustomCourtrrom = () => {
  const [userData, setUserData] = useState([]);
  const [sortValue, setSort] = useState("");

  const [originalUserData, setOriginalUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setselectedId] = useState(0);
  const [anchorElExport, setAnchorElExport] = useState(null);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [couponDialog, setCouponDialog] = useState(false);

  const tableRef = useRef(null);

  // const handleClickAdd = (event) => {
  //   setAnchorElAdd(event.currentTarget);
  //   setCouponDialog(true);
  // };
  const handleCloseAdd = () => {
    getAllUsers();
    setAnchorElAdd(null);
    setCouponDialog(false);
  };
  const handleClickExport = (event) => {
    setAnchorElExport(event.currentTarget);
  };

  const getAllUsers = async () => {
    try {
      const res = await GetCustomCourtroomUsers();
      console.log(res);
      setUserData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleClick = (event, i) => {
    setAnchorEl(event.currentTarget);
    setselectedId(i);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Dummy data for testing

  const handleDelete = async (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user.userId !== userId)
    );
    const res = await DeleteCustomCourtroomUser({
      data: { userId },
    });
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
  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
    setCouponDialog(true);
  };
  const handleSortChange = (event) => {
    setSort(event.target.value);
    if (event.target.value == 1) {
      const data = userData.sort((a, b) => b.totalHours - a.totalHours);
      setUserData(data);
    }
    if (event.target.value == 2) {
      const data = userData.sort((a, b) => a.totalHours - b.totalHours);
      setUserData(data);
    }
    if (event.target.value == 3) {
      const data = userData.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );

      setUserData(data);
    }
    if (event.target.value == 4) {
      const data = userData.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );

      setUserData(data);
    }

    if (event.target.value == 5) {
      const data = userData.sort(
        (a, b) => new Date(a.endDate) - new Date(b.endDate)
      );

      setUserData(data);
    }
    if (event.target.value == 6) {
      const data = userData.sort(
        (a, b) => new Date(b.endDate) - new Date(a.endDate)
      );

      setUserData(data);
    }
  };

  return (
    <section
      className={`h-screen w-full flex flex-row justify-center items-center gap-5 p-5  ${
        open ? "blur-lg" : ""
      }`}
    >
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div className="flex flex-col lg:flex-row w-full justify-between gap-2 items-start">
          <div className="flex flex-row items-center gap-3 mb-4 lg:mb-0">
            <button
              onClick={handleClickExport}
              className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
            >
              <Share />
              <div className="font-semibold">Export</div>
            </button>

            {/* <button
              onClick={handleClickAdd}
              className="p-2 bg-card-gradient border-2 border-white rounded-md"
            >
              Add Coupon Code
            </button>

            <button
              onClick={handleClickAdd}
              className="p-2 bg-card-gradient border-2 border-white rounded-md"
            >
              Add 
            </button> */}

            <button
              onClick={handleClickAdd}
              className="p-2 bg-card-gradient border-2 border-white rounded-md"
            >
              Add Courtroom
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
                borderRadius: "0.375rem",
                font: "white", // Rounded corners (md size in Tailwind)
                color: "white", // White text
                padding: "0px 0px", // Padding for better appearance
                display: "flex",
                alignItems: "center",
                gap: "12px", // Space between items (space-x-3 in Tailwind)
              }}
              IconComponent={() => null} // Optional: Removes default arrow icon (if you don't want it)
            >
              <MenuItem value={2}> Total Hours Low-High</MenuItem>
              <MenuItem value={1}>Total Hours High-Low</MenuItem>
              <MenuItem value={3}>Date start Oldest</MenuItem>
              <MenuItem value={4}>Date start Latest</MenuItem>
              <MenuItem value={5}>Date end Oldest</MenuItem>
              <MenuItem value={6}>Date end Latest</MenuItem>
            </Select>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
            className="border-2 w-full lg:w-2/6 border-gray-300 bg-white h-10 text-neutral-900 px-2 font-semibold rounded-lg text-sm focus:outline-none"
          />
        </div>
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
                      val.Domain.toLowerCase().includes(
                        searchTerm.toLowerCase()
                      )
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user, i) => (
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
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={user._id}
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
                          user._id
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
                          user.Domain
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
                          dayjs(user.startDate).format("YYYY-MM-DD")
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
                          dayjs(user.endDate).format("YYYY-MM-DD")
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
                        ) : user.recording ? (
                          "Yes"
                        ) : (
                          "No"
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
                            value={user.totalUsedHours}
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
                          (user.totalUsedHours * 60).toFixed(2) + "min"
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          aria-describedby={id}
                          onClick={(e) => handleClick(e, i)}
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
                  borderRadius: "10px",
                },
              }}
            >
              <UserFeatureDialog
                setUserData={setUserData}
                handleClose={handleClose}
                userData={userData}
                selectedId={selectedId}
              />
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
                    onClick={() =>
                      handleDelete(userToDelete._id, userToDelete.userId)
                    }
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Popover
        id="addCoupon"
        open={couponDialog}
        anchorEl={null}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        onClose={handleCloseAdd}
        PaperProps={{
          style: {
            width: "400px",
            borderRadius: "10px",
          },
        }}
      >
        <AddCourtroom onClose={handleCloseAdd}></AddCourtroom>
      </Popover>
    </section>
  );
};

export default CustomCourtrrom;
