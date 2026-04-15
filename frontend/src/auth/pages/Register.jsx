import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    phoneNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password, name, role, phoneNumber, address } = formData;
      await register(email, password, name, role, { phoneNumber, address });
      toast.success('Registration successful!');
      navigate('/login'); // We'll build Login next
    } catch (error) {
      toast.error(error.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 uppercase tracking-widest">DS PROJECT - Healthcare System</h2>
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-700 italic border-b-2 border-blue-200 pb-2">User Registration</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input type="text" name="name" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" name="email" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input type="text" name="phoneNumber" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address (Optional)</label>
            <textarea name="address" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none" rows="2"></textarea>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-gray-400 shadow-sm"
          >
            {loading ? 'Registering...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;