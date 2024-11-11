import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('https://assignment.stage.crafto.app/login', { username, otp });
            if (response.data) {
                login(response.data.token);
                toast.success('Login successful!');
                setIsLoading(false);
                navigate('/quotes');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('Not able to login. Please enter the email or OTP properly.');
            console.error('Login failed', error);
        }
    }, [username, otp, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center w-full ">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md md:w-[450px] lg:w-[540px]">
                <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome Back!</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UserName</label>
                        <input
                            type="text"
                            id="email"
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OTP</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        {isLoading ? "Logging in...." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
