import React from "react";
import { Link } from "react-router-dom";

const TopNavBar = () => {
  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-neutral-800 text-default-font shadow-md px-6 py-4 flex items-center justify-between rounded-b-lg">
      {/* Logo */}
      <div className="text-heading-2 font-heading-2 text-brand-600">
        Investment Dashboard
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-8 text-body font-body text-subtext-color">
        <Link to="/" className="hover:text-brand-600 transition-colors duration-200">Home</Link>
        <a href="#" className="hover:text-brand-600 transition-colors duration-200">Portfolio</a>
        <a href="#" className="hover:text-brand-600 transition-colors duration-200">Analytics</a>
        <a href="#" className="hover:text-brand-600 transition-colors duration-200">Settings</a>
      </nav>

      {/* User icon */}
      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-0 font-bold">
        U
      </div>
    </header>
  );
};

export default TopNavBar;
