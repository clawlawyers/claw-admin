import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { NODE_API_ENDPOINT } from "../utils/utils";
import AddCoupon from "./components/AddTrialCoupoun";
const TrialCourtroomCoupon = () => {
  const [sortValue, setSort] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [editableCouponId, setEditableCouponId] = useState(null);
  const [originalCouponData, setOriginalCouponData] = useState(null);
  const [couponDialog, setCouponDialog] = useState(false);
  const [anchorElAdd, setAnchorElAdd] = useState(null);

  const handleCloseAdd = () => {
    fetchUserData();

    setAnchorElAdd(null);
    setCouponDialog(false);
  };

  const fetchUserData = useCallback(async () => {
    try {
      const res = await axios.get(`${NODE_API_ENDPOINT}/admin/trial-coupon`);
      console.log(res);
      setCouponData(res.data.data.coupons);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://claw-app-dev.onrender.com/api/v1/admin/trial-coupon`,
        {
          data: { id: id },
        }
      );
      if (response.status === 200) {
        toast.success("Deleted successfully");
      } else {
        toast.error("Error occurred");
      }
      //   fetchUserData();
    } catch (e) {
      toast.error("Error occurred");
    }
    setDeleteDialog(false);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    let data = [...couponData];
    if (event.target.value === "slots-low-high") {
      data = data.sort((a, b) => a.totalSlots - b.totalSlots);
    } else if (event.target.value === "slots-high-low") {
      data = data.sort((a, b) => b.totalSlots - a.totalSlots);
    }
    setCouponData(data);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleExport = () => {
    const csv = Papa.unparse(couponData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "couponData.csv");
  };

  const toggleEdit = (couponId) => {
    if (editableCouponId === couponId) {
      setEditableCouponId(null);
      setOriginalCouponData(null);
    } else {
      setEditableCouponId(couponId);
      const couponToEdit = couponData.find((coupon) => coupon._id === couponId);
      setOriginalCouponData({ ...couponToEdit });
    }
  };
  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
    setCouponDialog(true);
  };

  const handleInputChange = (couponId, field, value) => {
    setCouponData((prevCouponData) =>
      prevCouponData.map((coupon) =>
        coupon._id === couponId ? { ...coupon, [field]: value } : coupon
      )
    );
  };

  const handleSave = (coupon) => {
    if (JSON.stringify(originalCouponData) !== JSON.stringify(coupon)) {
      toast.success("Coupon data updated successfully");
    }
    setEditableCouponId(null);
    setOriginalCouponData(null);
  };

  return (
    <section className="h-screen w-full flex flex-row justify-center items-center gap-5 p-5">
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div className="flex flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
          <div className="flex justify-between">
            <button
              onClick={handleExport}
              className="bg-card-gradient shadow-lg space-x-1 p-2 px-2 rounded-md shadow-black text-white flex items-center"
            >
              <Share />
              <div className="font-semibold">Export</div>
            </button>
            <button
              onClick={handleClickAdd}
              className="p-2 bg-card-gradient border-2 border-white rounded-md"
            >
              Add Coupon Code
            </button>

            <Select
              value={sortValue}
              onChange={handleSortChange}
              className="text-white"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #38b2ac",
              }}
            >
              <MenuItem value="slots-low-high">Slots Low-High</MenuItem>
              <MenuItem value="slots-high-low">Slots High-Low</MenuItem>
            </Select>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border-2 w-full lg:w-2/6 border-gray-300 bg-white h-10 text-neutral-900 px-2 font-semibold rounded-lg text-sm"
            />
          </div>

          <table className="w-full table-auto text-sm border-2 overflow-y-auto border-white rounded-md">
            <thead className="text-white bg-teal-500">
              <tr>
                <th className="p-2">Coupon Code</th>
                <th className="p-2">Total Slots</th>
                <th className="p-2">Booked Slots</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">End Date</th>
                <th className="p-2"></th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {couponData
                .filter((val) => {
                  if (searchTerm === "") {
                    return val;
                  } else if (
                    val.CouponCode.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )
                  ) {
                    return val;
                  }
                  return null;
                })
                .map((coupon) => (
                  <tr key={coupon._id} className="border-b">
                    <td className="p-2">
                      {editableCouponId === coupon._id ? (
                        <input
                          type="text"
                          value={coupon.CouponCode}
                          onChange={(e) =>
                            handleInputChange(
                              coupon._id,
                              "CouponCode",
                              e.target.value
                            )
                          }
                          className="border-2 border-gray-300 rounded-lg p-1"
                        />
                      ) : (
                        coupon.CouponCode
                      )}
                    </td>
                    <td className="p-2">
                      {editableCouponId === coupon._id ? (
                        <input
                          type="number"
                          value={coupon.totalSlots}
                          onChange={(e) =>
                            handleInputChange(
                              coupon._id,
                              "totalSlots",
                              e.target.value
                            )
                          }
                          className="border-2 border-gray-300 rounded-lg p-1"
                        />
                      ) : (
                        coupon.totalSlots
                      )}
                    </td>
                    <td className="p-2">{coupon.bookedSlots}</td>
                    <td className="p-2">
                      {editableCouponId === coupon._id ? (
                        <input
                          type="date"
                          value={coupon.StartDate}
                          onChange={(e) =>
                            handleInputChange(
                              coupon._id,
                              "StartDate",
                              e.target.value
                            )
                          }
                          className="border-2 border-gray-300 rounded-lg p-1"
                        />
                      ) : (
                        coupon.StartDate
                      )}
                    </td>
                    <td className="p-2">
                      {editableCouponId === coupon._id ? (
                        <input
                          type="date"
                          value={coupon.EndDate}
                          onChange={(e) =>
                            handleInputChange(
                              coupon._id,
                              "EndDate",
                              e.target.value
                            )
                          }
                          className="border-2 border-gray-300 rounded-lg p-1"
                        />
                      ) : (
                        coupon.EndDate
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setDeleteDialog(true);
                          setCouponToDelete(coupon);
                        }}
                        className="border border-teal-500 px-3 p-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h3 className="text-lg">Are you sure you want to delete?</h3>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleDelete(couponToDelete._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
        <AddCoupon onClose={handleCloseAdd} />
      </Popover>
    </section>
  );
};

export default TrialCourtroomCoupon;
