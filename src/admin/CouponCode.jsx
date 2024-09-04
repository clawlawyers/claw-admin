import { Add, Delete, Edit, Share, Save } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { Popover } from "@mui/material";
import AddCoupon from "./components/AddCoupon";

import { getCoupons } from "./actions/Users.action";

const CouponCode = () => {
  const [userData, setUserData] = useState([]);
  const [anchorElExport, setAnchorElExport] = useState(null);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [couponData, setCouponData] = useState(initialCouponData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [editableCouponId, setEditableCouponId] = useState(null);
  const [originalCouponData, setOriginalCouponData] = useState(null);
  const [couponDialog, setCouponDialog] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const res = await getCoupons();
      setUserData(res);
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleClickExport = (event) => {
    setAnchorElExport(event.currentTarget);
  };

  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
    setCouponDialog(true);
  };

  const handleCloseExport = () => {
    setAnchorElExport(null);
  };

  const handleCloseAdd = () => {
    setAnchorElAdd(null);
    setCouponDialog(false);
  };

  const handleExport = () => {
    const csv = Papa.unparse(couponData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "couponData.csv");
    handleCloseExport(); // Close popover after export
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (couponId, isChecked) => {
    setSelectedCouponIds((prevSelectedCouponIds) =>
      isChecked
        ? [...prevSelectedCouponIds, couponId]
        : prevSelectedCouponIds.filter((id) => id !== couponId)
    );
  };

  const handleDeleteSelected = () => {
    setCouponData((prevCouponData) =>
      prevCouponData.filter((coupon) => !selectedCouponIds.includes(coupon._id))
    );
    setSelectedCouponIds([]);
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

  const handleDeactivate = () => {
    toast.success("Coupon deactivated successfully");
    handleCloseExport();
  };

  const openExport = Boolean(anchorElExport);
  const openAdd = Boolean(anchorElAdd);

  return (
    <section
      className={`h-screen w-full flex flex-row justify-center items-center gap-5 p-5 ${
        openExport || openAdd ? "blur-lg" : ""
      }`}
    >
      <div className="flex flex-col justify-center h-full w-full items-center">
        <div className="flex relative flex-col rounded-lg h-full bg-black/30 w-full gap-3 p-3 shadow-md">
          <div className="flex flex-col lg:flex-row w-full justify-between gap-2 items-start">
            <div className="flex flex-row items-center gap-3 mb-4 lg:mb-0">
              <button
                onClick={handleClickExport}
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
                <tr className="text-white bg-teal-500">
                  <th className="p-2 text-left">
                    <input
                      type="checkbox"
                      className="text-center"
                      checked={
                        selectedCouponIds.length === couponData.length &&
                        couponData.length > 0
                      }
                      onChange={(e) =>
                        setSelectedCouponIds(
                          e.target.checked
                            ? couponData.map((coupon) => coupon._id)
                            : []
                        )
                      }
                    />
                  </th>
                  <th className="p-2 text-left">Coupon Code</th>
                  <th className="p-2 text-left">Discount</th>
                  <th className="p-2 text-left">Expiration Date</th>
                  <th className="p-2 text-left">Active</th>
                  <th className="p-2 px-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {userData.length > 0 &&
                  userData.map((coupon) => (
                    <tr key={coupon._id} className="border-b">
                      <td className="p-2 text-left">
                        <input
                          type="checkbox"
                          className="text-center"
                          checked={selectedCouponIds.includes(coupon._id)}
                          onChange={(e) =>
                            handleCheckboxChange(coupon._id, e.target.checked)
                          }
                        />
                      </td>
                      <td className="p-2 text-left">
                        {editableCouponId === coupon._id ? (
                          <input
                            type="text"
                            value={coupon.couponCode}
                            onChange={(e) =>
                              handleInputChange(
                                coupon._id,
                                "couponCode",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          coupon.code
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableCouponId === coupon._id ? (
                          <input
                            type="text"
                            value={coupon.discount}
                            onChange={(e) =>
                              handleInputChange(
                                coupon._id,
                                "discount",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          coupon.discount
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableCouponId === coupon._id ? (
                          <input
                            type="text"
                            value={coupon.expirationDate}
                            onChange={(e) =>
                              handleInputChange(
                                coupon._id,
                                "expirationDate",
                                e.target.value
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : (
                          coupon.expirationDate
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {editableCouponId === coupon._id ? (
                          <input
                            type="text"
                            value={coupon.active ? "yes" : "no"}
                            onChange={(e) =>
                              handleInputChange(
                                coupon._id,
                                "active",
                                e.target.value === "yes"
                              )
                            }
                            className="border-2 border-gray-300 rounded-lg p-1"
                          />
                        ) : coupon.active ? (
                          "Yes"
                        ) : (
                          "No"
                        )}
                      </td>
                      <td className="p-2 text-left flex flex-row space-x-3">
                        <button
                          onClick={handleClickExport}
                          className="border border-teal-500 px-3 p-1 rounded-md"
                        >
                          Deactivate
                        </button>
                        <button
                          onClick={() => {
                            setDeleteDialog(true);
                            setCouponToDelete(coupon);
                          }}
                          className="border border-teal-500 px-3 p-1 rounded-md"
                        >
                          Delete Coupon Code
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <Popover
              id="export-popover"
              open={openExport}
              anchorEl={null}
              onClose={handleCloseExport}
              anchorOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "center",
              }}
              PaperProps={{
                style: {
                  padding: "20px",
                  backgroundColor: "#D9D9D9",
                  border: "2px solid white",
                  width: "700px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <div className="flex flex-col w-full items-center justify-between space-y-10">
                <p className="text-3xl font-bold text-teal-500">
                  Deactivate Coupon?
                </p>
                <div className="flex flex-row justify-center space-x-10 items-center">
                  <button
                    onClick={handleCloseExport}
                    className="p-2 px-5 rounded-md border-2 border-teal-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="p-2 px-5 rounded-md bg-teal-600 text-white"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </Popover>
          </div>
        </div>
      </div>

      {deleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#D9D9D9] flex flex-col space-y-10 p-4 rounded-lg shadow-lg backdrop-blur-sm">
            <p className="text-2xl text-teal-600 font-bold">
              Are you sure you want to delete this coupon?
            </p>
            <p className="text-black/60 text-sm text-center">
              Coupon Name: {couponToDelete?.couponCode}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setDeleteDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                // onClick={() => handleDelete(couponToDelete?._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
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

const initialCouponData = [
  {
    _id: "1",
    couponCode: "SAVE10",
    discount: "10%",
    expirationDate: "2023-12-31",
    active: true,
  },
  {
    _id: "2",
    couponCode: "SAVE20",
    discount: "20%",
    expirationDate: "2023-11-30",
    active: true,
  },
  {
    _id: "3",
    couponCode: "FREESHIP",
    discount: "Free Shipping",
    expirationDate: "2024-01-15",
    active: false,
  },
  {
    _id: "4",
    couponCode: "SUMMER15",
    discount: "15%",
    expirationDate: "2023-09-30",
    active: true,
  },
  {
    _id: "5",
    couponCode: "WELCOME5",
    discount: "5%",
    expirationDate: "2023-10-15",
    active: true,
  },
];

export default CouponCode;
