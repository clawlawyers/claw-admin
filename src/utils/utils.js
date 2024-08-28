export const FLASK_API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://gpt.clawlaw.in/api/v1"
    : "http://20.193.128.165:80/api/v1";

export const NODE_API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://claw-dev-courtroom-backend.onrender.com/api/v1"
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
  { id: 4, name: "Referral Codes", link: "/ref-codes" },
  { id: 5, name: "Visitors", link: "/visitors" },
  { id: 6, name: "Coupon Code", link: "/coupon-code" },
  { id: 7, name: "User - Visit", link: "/user-visit" },
  { id: 8, name: "Courtroom", link: "/admin/court-room" },

  { id: 9, name: "Custom Courtroom", link: "/admin/custom-courtroom" },
  { id: 10, name: "Allowed Booking", link: "/admin/allowed-booking" },
  { id: 11, name: "Allowed Log in", link: "/admin/allowed-login" },
  { id: 12, name: "Add Ambassador", link: "/add-ambasador" },
  { id: 13, name: "Salesman", link: "/salesman" },
  { id: 14, name: "All Admins", link: "/all-admins" },
];

export default navbarMenus;
