import { configureStore } from "@reduxjs/toolkit";
import courtroomAdminAddUserSlice from "./admin/features/courtroomAdminAddUserSlice";
import allowedBookingReducer from "./admin/features/allowedBookingSlice";
import adminUserNumbersSlice from "./admin/features/userSlice";
import adminData from "./admin/features/loginSlice";
export default configureStore({
  reducer: {
    adminUsersNumber: adminUserNumbersSlice,
    users: adminData,
    courtroomAdminAddUser: courtroomAdminAddUserSlice,
    allowedBooking: allowedBookingReducer, // Add to the store
  },
});
