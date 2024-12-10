import { Delete } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";
import AddSalesman from "./components/AddSalesman";
import AddAdmin from "./components/AddAdmin";
import { getAlladminusers, add_admin } from "./actions/Admin.action";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";
const AllAdmin = () => {
  // Dummy user data
  const initialUserData = [
    {
      mobileNumber: "1234567890",
      plan: "Premium",
      tokenUsed: "50",
    },
    {
      mobileNumber: "0987654321",
      plan: "Basic",
      tokenUsed: "20",
    },
    // Add more dummy data as needed
  ];

  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [error, seterror] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const tableRef = useRef(null); // Reference for the table
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for Popover
  const getAllUsers = async () => {
    try {
      const res = await getAlladminusers();
      console.log(res);
      setUserData(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleDelete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user.mobileNumber !== userId)
    );
    toast.success("User deleted successfully");
  };

  const confirmDelete = (user) => {
    seterror("");
    let data = JSON.stringify({
      phoneNumber: user,
    });

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${NODE_API_ENDPOINT}/admin/delete-admin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setDeleteDialog(false);
        setUserToDelete(null);
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
        seterror("error occured");
      });
  };
  const cancelDelete = () => {
    seterror("");

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
      prevUserData.filter(
        (user) => !selectedUserIds.includes(user.mobileNumber)
      )
    );
    setSelectedUserIds([]); // Clear selected user IDs after deletion
  };

  const handleAddClick = (event) => {
    setAnchorEl(tableRef.current); // Set anchor element to tableRef
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handledelete = () => {
    let data = JSON.stringify({
      phoneNumber: "6707986867807ee4549bce7d",
    });

    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: "localhost:8000/api/v1/admin/delete-admin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };
  return (
    <section
      className={`${
        anchorEl ? " blur-md" : ""
      } h-screen w-full flex flex-row justify-center items-center gap-5 p-5`}
    >
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div
          className={`flex relative flex-col rounded-lg h-full w-full gap-3 p-3 shadow-md transition-all duration-300`}
          ref={tableRef} // Reference the table container
        >
          <div className="flex flex-col lg:flex-row w-full justify-between gap-2 items-start">
            <div className="flex flex-row items-center gap-3 mb-4 lg:mb-0">
              <button
                onClick={handleExport}
                className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div className="font-semibold">Export</div>
              </button>
              <button
                onClick={handleAddClick}
                className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div className="font-semibold">Add Admin</div>
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
                  <th className="p-2">Mobile Number</th>
                  <th className="p-2">Name</th>

                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {userData
                  .filter((val) => {
                    if (searchTerm === "") {
                      return val;
                    } else if (
                      val?.phoneNumber.includes(searchTerm) |
                      val?.name.includes(searchTerm)
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr
                      key={user.phoneNumber}
                      className="border-b border-teal-600"
                    >
                      <td className="p-2 text-center">{user.phoneNumber}</td>
                      <td className="p-2 text-center">{user.name}</td>
                      <td
                        className="p-2 text-center"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Delete className="mr-2" />
                      </td>
                      {/* 
                      <td className="p-2 text-center">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-500"
                        >
                          <Delete className="mr-2" />
                        </button>
                      </td> */}
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
                backdropFilter: "blur(8px)",
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
                      <span className="font-bold">Phone Number:</span>{" "}
                      {userToDelete.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p>{error}</p>
                  </div>
                </div>
                <div className="w-full p-3 px-10 flex justify-end items-center">
                  <button
                    className="flex justify-center items-center px-4 p-2 text-center bg-white text-teal-700 border-2 border-white rounded font-bold"
                    onClick={() => confirmDelete(userToDelete._id)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
          {selectedUserIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 space-x-1 p-2 px-2 mt-4 rounded-md text-white flex items-center"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <AddAdmin onClose={handlePopoverClose} />
      </Popover>
    </section>
  );
};

export default AllAdmin;
