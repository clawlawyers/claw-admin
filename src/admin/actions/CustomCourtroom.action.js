import axios from "axios";
import { NODE_API_ENDPOINT } from "../../utils/utils";

export const GetCustomCourtroomUsers = async () => {
  try {
    const res = await axios.get(
      `${NODE_API_ENDPOINT}/admin/client/book-courtroom`
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const UpdateCustomCourtroomUser = async (userData) => {
  try {
    const res = await axios.put(
      `${NODE_API_ENDPOINT}/admin/client/book-courtroom`,
      userData
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const DeleteCustomCourtroomUser = async (userData) => {
  try {
    const res = await axios.delete(
      `${NODE_API_ENDPOINT}/admin/client/book-courtroom`,
      userData
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const CreateCustomCourtroomUser = async (userData) => {
  try {
    const res = await axios.post(
      `${NODE_API_ENDPOINT}/admin/client/book-courtroom`,
      userData
    );
    return res.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
