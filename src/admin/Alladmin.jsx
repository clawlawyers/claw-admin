import { Delete } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";
import AddSalesman from "./components/AddSalesman";
import AddAdmin from "./components/AddAdmin";
import { getAlladminusers, add_admin } from "./actions/Admin.action";

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
    handleDelete(user.mobileNumber);
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
                      val.mobileNumber.includes(searchTerm) ||
                      val.plan
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.tokenUsed.includes(searchTerm)
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr
                      key={user.mobileNumber}
                      className="border-b border-teal-600"
                    >
                      <td className="p-2 text-center">{user.phoneNumber}</td>
                      <td className="p-2 text-center">{user.name}</td>
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
          {selectedUserIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 space-x-1 p-2 px-2 mt-4 rounded-md text-white flex items-center"
            >
              <Delete className="mr-2" />
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
