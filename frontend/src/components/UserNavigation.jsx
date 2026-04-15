import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { subscribeToAuthChanges } from '../auth/services/authService';
// IMPORTANT: Update this extension (.png, .svg) if your logo file is different
import logo from '../assets/WebLogo.png';

const UserNavigation = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((data) => {
      setUser(data?.user || null);
    });
    return () => unsub();
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'My Appointments', path: '/my-appointments' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-white border-b border-teal-50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="HealthEase Logo" 
              className="h-10 w-auto mr-3 object-contain" 
              onError={(e) => e.target.style.display = 'none'} 
            />
            <span className="text-2xl font-bold text-teal-600 hidden sm:block">HealthEase</span>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'border-teal-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-500 hover:border-teal-200 hover:text-gray-700'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-teal-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.displayName || (user.email ? user.email.split('@')[0] : 'User')}
                </span>
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-teal-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavigation;
