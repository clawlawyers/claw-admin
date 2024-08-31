import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";
import AddAmbasadorDialog from "./components/AddAmbasador";
import AddSalesman from "./components/AddSalesman";
import { useNavigate } from "react-router-dom";

const Salesman = () => {
  let navigate = useNavigate();
  // Dummy user data
  const initialUserData = [
    {
      location: "New York",
      referralCode: "ABC123",
      name: "John Doe",
    },
    {
      location: "Los Angeles",
      referralCode: "XYZ789",
      name: "Jane Smith",
    },
    // Add more dummy data as needed
  ];

  const [userData, setUserData] = useState(initialUserData);
  const [searchTerm, setSearchTerm] = useState("");
  const [ambassadorDialog, setAmbassadorDialog] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);

  const tableRef = useRef(null); // Reference for the table

  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for Popover
  const [newAmbassador, setNewAmbassador] = useState({
    location: "",
    referralCode: "",
    name: "",
  });

  const handleDelete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user.referralCode !== userId)
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
        (user) => !selectedUserIds.includes(user.referralCode)
      )
    );
    setSelectedUserIds([]); // Clear selected user IDs after deletion
  };

  const toggleEdit = (userId) => {
    if (editableUserId === userId) {
      setEditableUserId(null); // Stop editing if clicked again
      setOriginalUserData(null); // Clear original data
    } else {
      setEditableUserId(userId); // Start editing this row
      const userToEdit = userData.find((user) => user.referralCode === userId);
      setOriginalUserData({ ...userToEdit }); // Store original data
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.referralCode === userId ? { ...user, [field]: value } : user
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

  const handleAddClick = (event) => {
    setAnchorEl(tableRef.current); // Set anchor element to tableRef
    setAmbassadorDialog(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setAmbassadorDialog(false);
  };

  const handleAddAmbassador = () => {
    setUserData((prevUserData) => [
      ...prevUserData,
      { ...newAmbassador, referralCode: (prevUserData.length + 1).toString() },
    ]);
    toast.success("Ambassador added successfully");
    setNewAmbassador({
      location: "",
      referralCode: "",
      name: "",
    });
    handlePopoverClose(); // Close the popover after adding
  };

  return (
    <section
      className={`${
        anchorEl ? " blur-md" : ""
      } h-screen w-full flex flex-row justify-center items-center gap-5 p-5`}
    >
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div
          className={`flex relative flex-col rounded-lg h-full w-full gap-3 p-3 shadow-md transition-all duration-300 
            `}
          ref={tableRef} // Reference the table container
        >
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
                onClick={handleAddClick}
                className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div className="font-semibold">Add Salesman</div>
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
                  
                  <th className="p-2">Referral Code</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Location</th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody className="">
                {userData
                  .filter((val) => {
                    if (searchTerm === "") {
                      return val;
                    } else if (
                      val.referralCode.includes(searchTerm) ||
                      val.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.location
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr
                      key={user.referralCode}
                      className="border-b border-teal-600"
                    >
                     
                      <td className="p-2 text-center">
                        {editableUserId === user.referralCode ? (
                          <input
                            type="text"
                            value={user.referralCode}
                            onChange={(e) =>
                              handleInputChange(
                                user.referralCode,
                                "referralCode",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          user.referralCode
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.referralCode ? (
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) =>
                              handleInputChange(
                                user.referralCode,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.referralCode ? (
                          <input
                            type="text"
                            value={user.location}
                            onChange={(e) =>
                              handleInputChange(
                                user.referralCode,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          user.location
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/salesman/${user?.referralCode}`,{state : {user}})
                          }
                          className="bg-popover-gradient px-5 p-2 rounded-md border border-white"
                        >
                          View Details
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.referralCode ? (
                          <button
                            onClick={() => handleSave(user)}
                            className="text-teal-500"
                          >
                            <Save className="mr-2" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleEdit(user.referralCode)}
                            className="text-teal-500"
                          >
                            <Edit className="mr-2" />
                          </button>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-500"
                        >
                          <Delete className="mr-2" />
                        </button>
                      </td>
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
        <AddSalesman />
      </Popover>
    </section>
  );
};

export default Salesman;
