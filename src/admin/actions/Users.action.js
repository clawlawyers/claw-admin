import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const getAllUsers = async (
  page = 1,
  limit = 30,
  sortKey = null,
  sortDirection = "desc"
) => {
  try {
    const params = new URLSearchParams({
      page: page,
      limit: limit,
    });

    if (sortKey) {
      params.append("sortKey", sortKey);
      params.append("sortDirection", sortDirection);
    }

    const response = await axios.get(
      `${NODE_API_ENDPOINT}/admin/user?${params}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getSubscribedUsers = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/subscribed-users`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getRefferalCodes = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/referralcode`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getVistors = async (param) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/admin/allVisitors?page=${param}`
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getAllVisitors = async (params = "") => {
  try {
    const res = await axios.get(
      `${NODE_API_ENDPOINT}/admin/allVisitors?${params}`
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getCoupons = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/allcoupons`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
