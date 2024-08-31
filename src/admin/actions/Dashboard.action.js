import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const getTotalUsers = async  () => {
    try {
        const res = await axios.get(`${NODE_API_ENDPOINT}/admin/user`);
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getTopUsers = async () => {
  try {
    const res = await axios.get(`${NODE_API_ENDPOINT}/admin/topusers`);
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getSubscribedUsers = async () => {
    try {
      const res = await axios.get(`${NODE_API_ENDPOINT}/admin/subscribed-user`);
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

  