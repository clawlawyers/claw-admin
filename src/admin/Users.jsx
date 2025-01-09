import { Add, Delete, Edit, Share, Save, Cancel } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Papa from "papaparse";
import MenuItem from "@mui/material/MenuItem";

import CancelIcon from '@mui/icons-material/Cancel';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import AllowedLoginDialog from "./components/AllowedLoginDialog";
import { getAllUsers } from "./actions/Users.action";
import dayjs from "dayjs";
import { NODE_API_ENDPOINT } from "../utils/utils";
import axios from "axios";

const Users = () => {
  const [userData, setUserData] = useState([]);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await getAllUsers();
      setUserData(res);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Dummy user data
  const initialUserData = [
    {
      mongoId: "1",
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
      mongoId: "2",
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

  const [searchTerm, setSearchTerm] = useState("");
  const [userAddDialog, setUserDialog] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editableUserId, setEditableUserId] = useState(null);

  const [sortValue, setSort] = useState("");
  const [originalUserData, setOriginalUserData] = useState(null);
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [showEntireSessionDialog, setShowEntireSessionDialog] = useState(false);
  const [sessionUsageUser , setSessionUsageUser] = useState(null)
  const [searchSession , setSearchSession] = useState("")
  const [entireSessionId , setEntireSessionId] = useState("")
  const [entireSessionData , setEntireSessionData] = useState([])
  const [sessionUsageUserData , setSessionUsageUserData] = useState([
    {
      sessiondate:"",
      sessionTime:"",
      sessiontitle:"",
    }
  ])

  const handleSortChange = (event) => {
    setSort(event.target.value);
    if (event.target.value == 1) {
      const data = userData.sort((a, b) => b.totalTokenUsed - a.totalTokenUsed);
      setUserData(data);
    }
    if (event.target.value == 2) {
      const data = userData.sort((a, b) => a.totalTokenUsed - b.totalTokenUsed);
      setUserData(data);
    }
    if (event.target.value == 3) {
      const data = userData.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setUserData(data);
    }
    if (event.target.value == 4) {
      const data = userData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUserData(data);
    }

    if (event.target.value == 5) {
      const data = userData.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );

      setUserData(data);
    }
    if (event.target.value == 6) {
      const data = userData.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setUserData(data);
    }
    if (event.target.value == 7) {
      const data = userData.sort(
        (a, b) => b.engagementTime.total - a.engagementTime.total
      );

      setUserData(data);
    }
    if (event.target.value == 8) {
      const data = userData.sort(
        (a, b) => a.engagementTime.total - b.engagementTime.total
      );

      setUserData(data);
    }
  };
  const handleDelete = async (userId) => {
    try {
      setUserData((prevUserData) =>
        prevUserData.filter((user) => user.userId !== userId)
      );
      console.log(userId);
      const res = await axios.delete(`${NODE_API_ENDPOINT}/admin/removeUser`, {
        data: { id: userId },
      });
      toast.success("User deleted successfully");
      setDeleteDialog(false);
      setUserToDelete(null);
    } catch (e) {}
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
      const userToEdit = userData.find((user) => user.mongoId === userId);
      setOriginalUserData({ ...userToEdit }); // Store original data
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.mongoId === userId ? { ...user, [field]: value } : user
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
    if (originalUserData.StateLocation != user.StateLocation) {
      const res = await axios.patch(
        `${NODE_API_ENDPOINT}/admin/updateUserLocation`,
        {
          id: user.mongoId,
          location: user.StateLocation,
        }
      );
    }

    toast.success("User data updated successfully");

    setEditableUserId(null); // Exit edit mode
    setOriginalUserData(null); // Clear original data
  };

  const handleOpenSessionDialog =async (mongoId)=>{
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/sessions/${mongoId}`)
    console.log(res)
    setSessionUsageUserData(res.data.data.SessionList)
    setSessionUsageUser(mongoId)

    
    setShowUsageDialog(true)
  }
  const handleShowEntireSessionHistroy =async (id)=>{
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/sessionsHistory/${sessionUsageUser}/${id}`)
    setEntireSessionData(res.data.data.sessionMessages.messages)
    console.log(res)
    setShowUsageDialog(false)
    setShowEntireSessionDialog(true)
    // set
  }
  const handleCloseDialog =()=>{
    setShowEntireSessionDialog(false)
    setShowUsageDialog(false)
  }

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
                  borderRadius: "0.375rem", // Rounded corners (md size in Tailwind)
                  color: "white", // White text
                  padding: "0px 0px", // Padding for better appearance
                  display: "flex",
                  alignItems: "center",
                  gap: "12px", // Space between items (space-x-3 in Tailwind)
                }}
                IconComponent={() => null} // Optional: Removes default arrow icon (if you don't want it)
              >
                 <MenuItem value="" disabled>Sort</MenuItem>
                <MenuItem value={2}> Total token used Low-High</MenuItem>
                <MenuItem value={1}>Total token used High-Low</MenuItem>
                <MenuItem value={3}>Date created Oldest</MenuItem>
                <MenuItem value={4}>Date created Latest</MenuItem>
                <MenuItem value={5}>Date updtaed Oldest</MenuItem>
                <MenuItem value={6}>Date updtaed Latest</MenuItem>
                <MenuItem value={8}>engament Low-High</MenuItem>
                <MenuItem value={7}>engament High-Low</MenuItem>
              </Select>
{/* 
              <button
                onClick={handleFilter}
                className="bg-transparent border-2 border-teal-500 shadow-lg space-x-3 p-2 px-2 rounded-md shadow-black text-white flex items-center"
              >
                <div>
                  <FilterAltIcon />
                </div>
                <div className="font-semibold">Filter</div>
              </button> */}

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
                  {/* <th className="p-2">Plans</th>
                  <th className="p-2">Token Used</th>
                  <th className="p-2">Total Sessions</th> */}
                  <th className="p-2">State</th>
                  <th className="p-2">Daily Engagement Time</th>
                  <th className="p-2">Monthly Engagement Time</th>
                  <th className="p-2">ADIRA Daily Engagement Time</th>
                  <th className="p-2">Warroom Daily Engagement Time</th>
                  <th className="p-2">Total Engagement Time</th>
                  <th className="p-2">Adira Last Page</th>
                  <th className="p-2">Warroom Last Page</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Updated At</th>
                  <th className="p-2">Edit</th>
                  <th className="p-2">Delete</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {userData
                  .filter((val) => {
                    if (searchTerm === "") {
                      return val;
                    } else if (
                      val.phoneNumber.includes(searchTerm) ||
                      val.StateLocation.toLowerCase().includes(
                        searchTerm.toLowerCase()
                      )
                    ) {
                      return val;
                    }
                    return null;
                  })
                  .map((user) => (
                    <tr key={user.mongoId} className="border-b border-teal-600">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.mongoId)}
                          onChange={(e) =>
                            handleCheckboxChange(user.mongoId, e.target.checked)
                          }
                        />
                      </td>
                      <td className="p-2">
                        {editableUserId === user.mongoId ? (
                          <input
                            type="text"
                            value={user.phoneNumber}
                            onChange={(e) =>
                              handleInputChange(
                                user.mongoId,
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
                      {/* <td className="p-2">{user.planNames.length}</td> */}
                      {/* <td className="p-2 text-center">
                        {editableUserId === user.mongoId ? (
                          <input
                            type="text"
                            value={user.totalTokenUsed}
                            onChange={(e) =>
                              handleInputChange(
                                user.mongoId,
                                "totalTokenUsed",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.totalTokenUsed
                        )}
                      </td> */}
                      {/* <td className="p-2 text-center">
                        {editableUserId === user.mongoId ? (
                          <input
                            type="text"
                            value={user.totalSessions}
                            onChange={(e) =>
                              handleInputChange(
                                user.mongoId,
                                "totalSessions",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          />
                        ) : (
                          user.numberOfSessions
                        )}
                      </td> */}
                      <td className="p-2 text-center">
                        {editableUserId === user.mongoId ? (
                          <input
                            value={user.StateLocation}
                            onChange={(e) =>
                              handleInputChange(
                                user.mongoId,
                                "StateLocation",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 p-1 rounded-md w-full"
                          ></input>
                        ) : (
                          user.StateLocation
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {user.engagementTime.daily}
                      </td>
                      <td className="p-2 text-center">
                        {user.engagementTime.monthly}
                      </td>
                      <td className="p-2 text-center">
                        {user.adiraEngagement.daily}
                      </td>
                      <td className="p-2 text-center">
                        {user.warroomEngagement.daily}
                      </td>
                      <td className="p-2 text-center">
                        {user.engagementTime.total}
                      </td>
                      <td className="p-2 text-center">
                        {user.adiraLastPage}
                      </td>
                      <td className="p-2 text-center">
                        {dayjs(user.createdAt).format("YYYY-MM-DD")}
                      </td>
                      <td className="p-2 text-center">
                        {dayjs(user.updatedAt).format("YYYY-MM-DD")}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => {
                            if (editableUserId === user.mongoId) {
                              handleSave(user); // Save and exit edit mode
                            } else {
                              toggleEdit(user.mongoId); // Enter edit mode
                            }
                          }}
                          className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                        >
                          {editableUserId === user.mongoId ? (
                            <Save />
                          ) : (
                            <Edit />
                          )}
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
                      <td className="p-2 text-center">
                        <button
                          onClick={()=>handleOpenSessionDialog(user.mongoId)}
                            className="border border-teal-500 px-3 p-1 rounded-md text-nowrap " 
                        >
                          {/* <Delete /> */} Show Usage Histroy
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
                      userToDelete ? handleDelete(userToDelete.mongoId) : null
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {showUsageDialog && (
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-50">
              <div className="bg-teal-950 p-4 h-[80%] overflow-y-scroll  rounded-md shadow-lg">
              <div className="flex flex-col gap-3">
                 <div className="flex pb-2 border-b-2 gap-3 items-center justify-end">
                  <button onClick={handleCloseDialog}>

                  <CancelIcon></CancelIcon>
                  </button>
                  <input onChange={(e)=>setSearchSession(e.target.value)}
                  value={searchSession}
                          // onClick={handleShowEntireSessionHistroy}
                            className="border border-teal-500 px-3 p-1 rounded-md text-nowrap " 
                        >
                          {/* <Delete /> */} 
                        </input>
                
                </div>
                <table className="w-full overflow-y-scroll  table-auto  text-sm">
                  <thead>
                    <tr className=" text-white bg-teal-500">
                      <th className="p-2">Session Date</th>
                      <th className="p-2">Session Time</th>
                      <th className="p-2">Session Title</th>
                      <th className="p-2"></th>
                  
                      {/* <th className="p-2">Plan</th>
                  <th className="p-2">Tokens Used</th>
                  <th className="p-2">Total Tokens Available</th>
                  <th className="p-2">Daily Engagement Time</th>
                  <th className="p-2">Monthly Engagement Time</th>
                  <th className="p-2">Yearly Engagement Time</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {userData.length > 0 &&
                      userData[selectedId].redeemedBy.map((user, i) => (
                        <tr
                          key={i}
                          className="border-b border-neutral-700 text-white"
                        >
                          <td className="p-2 text-center"> {user.firstName}</td>
                          <td className="p-2 text-center">{user.lastName}</td>

                          <td className="p-2 text-center">
                            {user.phoneNumber}
                          </td>
                          <td className="p-2 text-center">
                            {user.plan.planName}
                          </td>
                          <td className="p-2 text-center">
                            {user.plan.token.total}
                          </td>
                          <td className="p-2 text-center">
                            {user.plan.token.used}
                          </td>
                        </tr>
                      ))} */}
                      {sessionUsageUserData.filter((val) => {
                    if (val.name.includes(searchSession) ) {
                      return val}}).map((e,i)=>(
                        <tr key={i}>
                            <td>{e.updatedAt.split("T")[0]}</td>
                      <td className="text-ellipsis">{String(e.name).substring(0,100)+"......"}</td>
                      
                      <td>{e.updatedAt.split("T")[1].split(".")[0]}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={()=>handleShowEntireSessionHistroy(e.id)}
                            className="border border-teal-500 px-3 p-1 rounded-md text-nowrap " 
                        >
                          {/* <Delete /> */} Show Entire Session Histroy
                        </button>
                      </td>
                        </tr>
                      ))}
                     
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          )}
            {showEntireSessionDialog && (
            <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-50">
              <div className="bg-teal-950 w-1/2 h-2/3 p-4 rounded-md shadow-lg">
              <div className="flex flex-col gap-4  h-full   ">
                <div className="flex pb-2 border-b-2 gap-3 items-center justify-end">
                  <button onClick={handleCloseDialog}>

                  <CancelIcon></CancelIcon>
                  </button>
                  <button
                          onClick={()=>{
                            setShowEntireSessionDialog(false)
                            setShowUsageDialog(true)
                          }}
                            className="border border-teal-500 px-3 p-1 rounded-md text-nowrap " 
                        >
                          {/* <Delete /> */} GO BACK
                        </button>
                  {/* <button
                            className="border border-teal-500 px-3 p-1 rounded-md text-nowrap " 
                        > */}
                          {/* <Delete /> EXPORT SESSION */}
                        {/* </button> */}
                </div>
                <div className="flex overflow-y-scroll  flex-col gap-3">
                  {entireSessionData.map((e,i)=>{
                    if(i%2==0)
                    {return(

                      
                      <div className="flex flex-col justify-end items-end gap-3">
                      
                      <div className="font-bold text-teal-600 text-lg">USER INPUT</div>
                      <div className="w-[80%] text-justify    border-2 border-teal-600 rounded-lg px-3 py-2"> {e.text} </div>
                      </div>
                      )
                    }
                    else{
                      return( <div className="flex flex-col justify-start items-start gap-3">

                        <div className="font-bold text-teal-600 text-lg" >AI OUTPUT</div>
                        <div className="w-[80%] rounded-lg px-3 py-2 bg-[#018585]"> {e.text} </div>
                        </div>)
                    }
})}
                  {/* <div className="flex flex-col justify-end items-end gap-3">

                  <div className="font-bold text-teal-600 text-lg">USER INPUT</div>
                  <div className="w-[80%] text-justify    border-2 border-teal-600 rounded-lg px-3 py-2"> Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-3">

                  <div className="font-bold text-teal-600 text-lg" >AI OUTPUT</div>
                  <div className="w-[80%] rounded-lg px-3 py-2 bg-[#018585]"> Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </div>
                  </div> */}
                  </div>
               
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
