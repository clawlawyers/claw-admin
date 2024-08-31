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
