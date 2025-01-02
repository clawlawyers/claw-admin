import logo from "./logo.svg";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import "./App.css";
import AdminLayout from "./admin/AdminLayout";
import CourtRoomUsers from "./admin/Admin";
import AllowedBooking from "./admin/AllowedBooking";
import AllowedLogin from "./admin/AllowedLogin";
import CustomCourtrrom from "./admin/CustomCourtrrom";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./admin/Home";
import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import SubscribedUsers from "./admin/SubscribedUsers";
import Referral from "./admin/Referral";
import UsersFeedback from "./admin/UserFeedback";

import Visitors from "./admin/Vistors";
import CouponCode from "./admin/CouponCode";
import UserVisit from "./admin/UserVisit";
import { useEffect } from "react";
import { retrieveUserslist } from "./admin/features/userSlice";
import { Toaster } from "react-hot-toast";
import { retrieveAuth } from "./admin/features/loginSlice";
import AddAmbasaddor from "./admin/AddAmbasaddor";
import Salesman from "./admin/Salesman";
import SalesmanDetails from "./admin/SalesmanDetails";
import AllAdmin from "./admin/Alladmin";
import ProductBasedVisit from "./admin/ProductBasedVisit";
import TrialCourtroomCoupon from "./admin/TrialCoupouns";
import { Feedback } from "@mui/icons-material";

function App() {
  useEffect(() => {
    store.dispatch(retrieveUserslist());
    store.dispatch(retrieveUserslist());
    store.dispatch(retrieveAuth());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "/admin/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/sub-users",
          element: <SubscribedUsers />,
       
        },
        {
          path: "/admin/court-room",
          element: <CourtRoomUsers />,
          
        },
        {
          path: "/admin/allowed-booking",
          element: <AllowedBooking />,
        
        },
        {
          path: "/admin/allowed-login",
          element: <AllowedLogin />,
        },
        {
          path: "/admin/custom-courtroom",
          element: <CustomCourtrrom />,
          
        },
        {
          path: "/admin/referral",
          element: <Referral />,
        },
        {
          path: "/admin/visitor",
          element: <Visitors />,
        },
        {
          path: "/admin/coupon-code",
          element: <CouponCode />,
        },
        {
          path: "/admin/user-visit",
          element: <UserVisit />,
        },
        {
          path: "/admin/add-ambasador",
          element: <AddAmbasaddor />,
          
        },
        {
          path: "/admin/salesman",
          element: <Salesman />,
        },
        
        {
          path: "/admin/salesman/:id",
          
          element: <SalesmanDetails />,
          
        },
        {
          path: "/admin/all-admins",
          element: <AllAdmin />,
        },
        {
          path: "/admin/trail-coupouns",
          element: <TrialCourtroomCoupon />,
        },
        {
          path: "/admin/productbasedvisit",
          path: "/admin/productbasedvisit",
          element: <ProductBasedVisit />,
          element: <ProductBasedVisit />,
        },
        {
          path: "/admin/user-feedback",
          element: <UsersFeedback />,
        },
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
