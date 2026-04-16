import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Mail, CheckCircle2 } from 'lucide-react';
import { logout } from '../services/authService';

const WaitingPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-50 rounded-full animate-pulse border border-amber-100">
            <Clock className="w-12 h-12 text-amber-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Under Review</h1>
        <p className="text-slate-600 mb-8">
          Thank you for joining HealthEase! Our administrative team is currently verifying your medical credentials. This typically takes 24-48 hours.
        </p>

        <div className="space-y-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Registration Received</p>
              <p className="text-xs text-slate-500">Your profile has been created successfully.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Verification Pending</p>
              <p className="text-xs text-slate-500">Admin is reviewing your uploaded documents.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-8">
          <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-xs text-blue-800 text-left">
            We'll send an email to your registered address once your account is active.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-slate-200"
        >
          <LogOut className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default WaitingPage;
