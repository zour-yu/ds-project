import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { role } = await login(email, password);
            toast.success('Login successful!');
            if (role === 'doctor') navigate('/doctor/home');
            else if (role === 'admin') navigate('/admin/dashboard');
            else navigate('/patient/dashboard');
        } catch (error) {
            toast.error(error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 uppercase tracking-widest">DS PROJECT</h2>
                <h3 className="text-xl font-semibold mb-6 text-center text-gray-700 italic border-b-2 border-blue-200 pb-2">User Login</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:bg-gray-400 shadow-sm"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-gray-500">Don't have an account? </span>
                        <a href="/register" className="text-sm text-blue-500 hover:underline">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;