import React from "react";

const Header = () => (
  <header className="w-full bg-gradient-to-r from-teal-900 to-teal-700 text-white p-4 flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <img src="/path-to-logo.png" alt="Logo" className="h-8" /> {/* Replace with your logo path */}
      <h1 className="text-xl font-bold">CLAW</h1>
    </div>
    <nav>
      <ul className="flex space-x-6">
        <li><a href="/" className="hover:underline">Features</a></li>
        <li><a href="/" className="hover:underline">Blog</a></li>
        <li><a href="/" className="hover:underline">Pricing</a></li>
        <li><a href="/" className="hover:underline">Ambassadorship</a></li>
      </ul>
    </nav>
    <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">Try LegalGPT</button>
  </header>
);

const Footer = () => (
  <footer className="w-full bg-gray-800 text-white p-6">
    <div className="flex justify-between items-start space-x-4">
      <div>
        <h2 className="text-lg font-semibold">Claw</h2>
        <p className="text-sm mt-2 max-w-xs">
          We are a lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="mt-4">
          <p className="text-sm">Have a question? <span className="text-teal-400">+91 9950868260</span></p>
          <p className="text-sm">Contact us <span className="text-teal-400">claw.lawyers@gmail.com</span></p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg">Newsletter</h3>
        <p className="text-sm mt-2">Be the first one to know about discounts, offers and events.</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="mt-2 p-2 w-full bg-gray-700 text-white rounded-md"
        />
        <button className="mt-2 w-full bg-teal-500 text-white p-2 rounded-md">Submit</button>
      </div>
      <div className="flex flex-col">
        <h4 className="font-semibold text-lg">Quick Links</h4>
        <ul className="space-y-2 text-sm mt-2">
          <li><a href="/" className="hover:underline">About us</a></li>
          <li><a href="/" className="hover:underline">Contact</a></li>
          <li><a href="/" className="hover:underline">Privacy policy</a></li>
          <li><a href="/" className="hover:underline">Case details</a></li>
          <li><a href="/" className="hover:underline">Terms of use</a></li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <p className="text-xs text-gray-400">© 2000-2021, All Rights Reserved</p>
      <div className="flex space-x-4">
        {/* Replace "#" with actual social media links */}
        <a href="#" className="hover:text-teal-400">Facebook</a>
        <a href="#" className="hover:text-teal-400">Twitter</a>
        <a href="#" className="hover:text-teal-400">WhatsApp</a>
        <a href="#" className="hover:text-teal-400">Instagram</a>
        <a href="#" className="hover:text-teal-400">LinkedIn</a>
      </div>
    </div>
  </footer>
);

export { Header, Footer };
