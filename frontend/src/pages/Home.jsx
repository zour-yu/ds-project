import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from '../auth/services/authService';
// IMPORTANT: Updated extension from .png to .jpg based on actual file existence
import heroImage from '../assets/Home Clinic.jpg'; 

const Home = () => {
  const [userState, setUserState] = useState({ loading: true, role: null });

  useEffect(() => {
    const unsub = subscribeToAuthChanges((data) => {
      setUserState({ 
        loading: false, 
        role: data?.role || null 
      });
    });
    return () => unsub();
  }, []);

  if (userState.loading) return null;

  // Redirect Admin away from the public Home page
  if (userState.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex-grow bg-white">
      {/* Hero Section */}
      <div className="relative bg-teal-50 overflow-hidden min-h-[600px] flex items-center">
        <div className="max-w-7xl mx-auto w-full relative">
          <div className="relative z-10 pb-8 bg-teal-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-10 sm:pt-16 lg:pt-20 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Modern healthcare for </span>
                  <span className="block text-teal-600 xl:inline">you and your family</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience wellness that feels like home. Book appointments easily, consult top-rated doctors, and manage your health journey in one beautiful space.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/doctors" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 transition-colors md:py-4 md:text-lg md:px-10">
                      Find a Doctor
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 transition-colors md:py-4 md:text-lg md:px-10">
                      Join HealthEase
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 p-8">
          <div className="h-full w-full relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              className="h-full w-full object-cover"
              src={heroImage}
              alt="Modern Home Clinic"
              onError={(e) => { 
                // Fallback inside dev if image extension is wrong
                e.target.src = 'https://placehold.co/800x600/0d9488/ffffff?text=Add+Home+Clinic+Image+Here';
              }}
            />
            {/* Subtle Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* --- Other Sections we can add later --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">What we can add next:</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-slate-50 p-6 rounded-xl border border-teal-100">
              <h3 className="text-lg font-bold text-teal-700">Features Outline</h3>
              <p className="mt-2 text-gray-500">Showcase 3 main features (e.g., Simple Booking, Secure Records, Urgent Care).</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-teal-100">
              <h3 className="text-lg font-bold text-teal-700">Specialties List</h3>
              <p className="mt-2 text-gray-500">A slider or grid of icons showing "Cardiology", "Dentistry", etc.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-teal-100">
              <h3 className="text-lg font-bold text-teal-700">Top Doctors</h3>
              <p className="mt-2 text-gray-500">Mini profiles of 3 popular doctors available on your platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;