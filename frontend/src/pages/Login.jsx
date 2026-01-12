import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getData } from '@/context/userContext'
import Google from "../assets/googleLogo.png"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

// 1. IMPORT THE GOOGLE HOOK
import { useGoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const { setUser } = getData()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // --- NORMAL EMAIL LOGIN ---
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await axios.post(`http://localhost:8000/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                navigate('/')
                setUser(res.data.user)
                localStorage.setItem("accessToken", res.data.accessToken)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log('Login error', error)
            const resp = error?.response?.data
            let msg = error.message
            if (resp) {
                if (resp.message) msg = resp.message
                else if (Array.isArray(resp.errors)) msg = resp.errors.join(', ')
                else if (typeof resp === 'string') msg = resp
            }
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    // --- 2. GOOGLE LOGIN LOGIC ---
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsLoading(true);
                // We send the token to your backend at /user/google
                const res = await axios.post("http://localhost:8000/user/google", {
                    token: tokenResponse.access_token
                });

                if (res.data.success) {
                    setUser(res.data.user);
                    localStorage.setItem("accessToken", res.data.accessToken);
                    toast.success("Google Login Successful!");
                    navigate("/");
                }
            } catch (err) {
                console.error("Google Auth Error:", err);
                toast.error(err.response?.data?.message || "Google Login Failed");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error("Google Login Failed to Initialize");
        }
    });

    return (
        <>
            <style>
                {`
* {
  font-family: Ubuntu, Tahoma, sans-serif !important;
}

.login-page {
  background-color: #F1F3F6;
}
`}
            </style>
            <div className="min-h-screen bg-white">
                <div className="flex w-full">

                    {/* Left Section */}
                    <div className="w-full max-w-md p-10 space-y-8">

                        {/* Logo */}
                        <div className="flex justify-center">
                          
                          <img
                                src="https://i.pinimg.com/1200x/f4/36/c7/f436c7c19a96181adacfbad655f223c7.jpg"
                                className="w-28"
                            />
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl font-semibold text-center text-gray-900">
                            Login into your account
                        </h2>

                        <Card className="shadow-none border-none">
                            <CardContent className="space-y-6">

                                {/* Email */}
                                <div className="space-y-1">
                                    <Label>Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1">
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-10"
                                        />
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />

                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-right text-sm">
                                        <Link to="/forgot-password" className="text-blue-600">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <Button
                                    className="w-full py-5 text-white bg-blue-600 hover:bg-blue-500"
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                            Logging into your account...
                                        </>
                                    ) : (
                                        "Login Now"
                                    )}
                                </Button>

                                {/* OR Divider */}
                                <div className="text-center my-2 text-gray-400">OR</div>

                                {/* 3. UPDATED GOOGLE BUTTON */}
                                <Button
                                    variant="outline"
                                    onClick={() => handleGoogleLogin()} // Use the Hook function
                                    className="w-full py-5 flex gap-2 bg-gray-900 text-white rounded-sm hover:bg-gray-800 hover:text-white"
                                >
                                    <img src={Google} className="w-5" />
                                    Login with Google
                                </Button>

                                {/* Signup Button */}
                                <Link to="/signup">
                                    <Button className="w-full py-5 bg-blue-500 text-white hover:bg-gray-800 rounded-sm font-semibold ">
                                        Signup Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Section – Image */}
                    <div className="hidden lg:flex flex-1">
                        <img
                            src="https://i.pinimg.com/736x/65/58/ed/6558ed12d715878f2598c611ff175cba.jpg"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}