'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const useAuth = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    // // const baseurl = 'https://enterprise-backend.vercel.app';
    const baseurl = 'https://auth-prac.onrender.com';
    // const baseurl = 'http://localhost:5050';

    const login = async (data) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/auth/login`, data, { withCredentials: true });
            if (response.status===200) {
                setSuccess(response.data.message);
                router.push('/')
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const logout = async (data) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/auth/logout`, data, { withCredentials: true });
            if (response.status === 200) {
                setSuccess(response.data.message);
                router.push('/login'); // or any public route
            }
            setSuccess(response.data.message);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const signUp= async (data) => {
        setError(null);
        console.log(data)
        try {
            const response = await axios.post(`${baseurl}/api/auth/register`, data);
            console.log(response.data)
            if (response.status===200) {
                setSuccess(response.data.message);
                router.push('/login');

            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };


    return {
        login,
        logout,
        signUp,
        error,
        success,
    };
};

export default useAuth;
