import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/user`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
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
      `https://claw-app-dev.onrender.com/api/v1/admin/${param}`
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
export const getAllVisitors = async () => {
  try {
    const res = await axios.get(
      `https://claw-app-dev.onrender.com/api/v1/admin/allVisitors`
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
