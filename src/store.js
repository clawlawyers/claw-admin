import { configureStore } from "@reduxjs/toolkit";
import courtroomAdminAddUserSlice from "./admin/features/courtroomAdminAddUserSlice";
import allowedBookingReducer from "./admin/features/allowedBookingSlice";
import userReducer from "./admin/features/userSlice"
import phoneNumberReducer from "./admin/features/loginSlice"
export default configureStore({
    reducer: {
        users: userReducer,
        phoneNumber: phoneNumberReducer, 
        courtroomAdminAddUser: courtroomAdminAddUserSlice,
        allowedBooking: allowedBookingReducer, // Add to the store
    }
})