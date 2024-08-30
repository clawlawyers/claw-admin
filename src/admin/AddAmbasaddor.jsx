import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover, TextField, Button } from "@mui/material";
import AddAmbasadorDialog from "./components/AddAmbasador";

const AddAmbasaddor = () => {
  // Dummy user data
  const initialUserData = [
    {
      ambassadorId: "1",
      firstName: "John",
      lastName: "Doe",
      organization: "Tech University",
    },
    {
      ambassadorId: "2",
      firstName: "Jane",
      lastName: "Smith",
      organization: "Health Institute",
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
    ambassadorId: "",
    firstName: "",
    lastName: "",
    organization: "",
  });

  const handleDelete = (userId) => {
    setUserData((prevUserData) =>
      prevUserData.filter((user) => user.ambassadorId !== userId)
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
        (user) => !selectedUserIds.includes(user.ambassadorId)
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
      const userToEdit = userData.find((user) => user.ambassadorId === userId);
      setOriginalUserData({ ...userToEdit }); // Store original data
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.ambassadorId === userId ? { ...user, [field]: value } : user
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
      { ...newAmbassador, ambassadorId: (prevUserData.length + 1).toString() },
    ]);
    toast.success("Ambassador added successfully");
    setNewAmbassador({
      ambassadorId: "",
      firstName: "",
      lastName: "",
      organization: "",
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
                <div className="font-semibold">Add Ambassador</div>
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
                  <th className="p-2"></th>
                  <th className="p-2">Ambassador ID</th>
                  <th className="p-2">First Name</th>
                  <th className="p-2">Last Name</th>
                  <th className="p-2">Organization</th>
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
                      val.ambassadorId.includes(searchTerm) ||
                      val.firstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      val.lastName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr
                      key={user.ambassadorId}
                      className="border-b border-teal-600"
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.ambassadorId)}
                          onChange={(e) =>
                            handleCheckboxChange(
                              user.ambassadorId,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.ambassadorId ? (
                          <input
                            type="text"
                            value={user.ambassadorId}
                            onChange={(e) =>
                              handleInputChange(
                                user.ambassadorId,
                                "ambassadorId",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          user.ambassadorId
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.ambassadorId ? (
                          <input
                            type="text"
                            value={user.firstName}
                            onChange={(e) =>
                              handleInputChange(
                                user.ambassadorId,
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
                        {editableUserId === user.ambassadorId ? (
                          <input
                            type="text"
                            value={user.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                user.ambassadorId,
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
                        {editableUserId === user.ambassadorId ? (
                          <input
                            type="text"
                            value={user.organization}
                            onChange={(e) =>
                              handleInputChange(
                                user.ambassadorId,
                                "organization",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          user.organization
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editableUserId === user.ambassadorId ? (
                          <button
                            onClick={() => handleSave(user)}
                            className="text-green-500"
                          >
                            <Save />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleEdit(user.ambassadorId)}
                            className="text-yellow-500"
                          >
                            <Edit />
                          </button>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-500"
                        >
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>


          {/* Add Ambassador Popover */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "center", // Adjust this for proper centering
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center", // Adjust this for proper centering
              horizontal: "center",
            }}
            PaperProps={{
              style: {
                padding: "1rem",
                maxWidth: "600px",
                width: "100%",
                backgroundColor: "teal",
              },
            }}
          >
            <div className="p-4 flex flex-col gap-4">
             <AddAmbasadorDialog onClose={handlePopoverClose} />
            </div>
          </Popover>

          {/* Delete Confirmation Dialog */}
          {deleteDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-md">
                <p className="text-lg">
                  Are you sure you want to delete {userToDelete?.firstName}{" "}
                  {userToDelete?.lastName}?
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-200 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(userToDelete.ambassadorId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
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

export default AddAmbasaddor;
