export const FLASK_API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://gpt.clawlaw.in/api/v1"
    : "http://20.193.128.165:80/api/v1";

export const NODE_API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://claw-app-dev.onrender.com/api/v1"
    : "http://localhost:8000/api/v1";

export const splitContentIntoPages = (text, maxWordsPerPage) => {
  const words = text.split(" ");
  const pages = [];

  for (let i = 0; i < words.length; i += maxWordsPerPage) {
    pages.push(words.slice(i, i + maxWordsPerPage).join(" "));
  }

  return pages;
};
export function MultipleItems() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
}
export const navbarMenus = [
  { id: 1, name: "Home", link: "/admin/dashboard" },
  { id: 2, name: "Users", link: "/admin/users" },
  { id: 3, name: "Subscribed Users", link: "/admin/sub-users" },
  { id: 4, name: "Referral Codes", link: "/admin/referral" },
  { id: 5, name: "Visitors", link: "/admin/visitor" },
  { id: 6, name: "Coupon Code", link: "/admin/coupon-code" },
  { id: 7, name: "User - Visit", link: "/admin/user-visit" },
  { id: 8, name: "Courtroom", link: "/admin/court-room" },

  { id: 9, name: "Custom Courtroom", link: "/admin/custom-courtroom" },
  // { id: 10, name: "Allowed Booking", link: "/admin/allowed-booking" },
  { id: 11, name: "Allowed Log in", link: "/admin/allowed-login" },
  { id: 12, name: "Add Ambassador", link: "/admin/add-ambasador" },
  { id: 13, name: "Salesman", link: "/admin/salesman" },
  { id: 14, name: "All Admins", link: "/admin/all-admins" },
  { id: 15, name: "Trial Coupuns", link: "/admin/trail-coupouns" },
];

export default navbarMenus;

export const adminUserData = [
  {
    username: "user_example_01",
    plan: "free",
  },
  {
    username: "user_example_02",
    plan: "pro_u_4",
  },
  {
    username: "user_example_03",
    plan: "free",
  },
  {
    username: "user_example_04",
    plan: "pro_u_4",
  },
  {
    username: "user_example_05",
    plan: "free",
  },
];
