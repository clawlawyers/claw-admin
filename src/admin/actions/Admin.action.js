import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const getAlladminusers = async () => {
  try {
    const res = await axios.get(
      `https://claw-app-dev.onrender.com/api/v1/admin/getAllUsers`
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const add_admin = async (data) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/admin/add-new-admin`,
      data
    );
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};


export const getUserFeedback = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/feedback`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch user details by userId
export const getUserDetails = async (userId) => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/user/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};