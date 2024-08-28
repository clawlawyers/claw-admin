import { configureStore } from "@reduxjs/toolkit";
import courtroomAdminAddUserSlice from "./admin/features/courtroomAdminAddUserSlice";
import allowedBookingReducer from "./admin/features/allowedBookingSlice";
export default configureStore({
    reducer: {
        
        courtroomAdminAddUser: courtroomAdminAddUserSlice,
        allowedBooking: allowedBookingReducer, // Add to the store
    }
})