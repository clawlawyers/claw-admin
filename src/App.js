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

function App() {
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
      ],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
