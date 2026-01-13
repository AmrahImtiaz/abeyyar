import { BookOpen, LogOut, User, Search, Menu, Flame, X } from "lucide-react"; // Added X icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom"; // <--- IMPORT useNavigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getData } from "@/context/userContext";

const Navbar = () => {
  const { user, setUser } = getData();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // --- SEARCH LOGIC STATE ---
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate(); 
  // --------------------------

  const searchRef = useRef(null);

  // --- HANDLE SEARCH FUNCTION ---
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      // Redirect to browse page with query parameter
      navigate(`/browsequestions?search=${encodeURIComponent(searchTerm)}`);
      setMobileOpen(false); // Close mobile menu if open
      setSearchTerm(""); // Optional: clear search after entering
    }
  };

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8000/user/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* --- LEFT SIDE: LOGO + DESKTOP SEARCH --- */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <BookOpen className="h-6 w-6 text-blue-700" />
              <span className="font-bold text-xl tracking-tight">
                <span className="text-blue-600">Learn</span>Stack
              </span>
            </Link>

            {/* Search Bar (Desktop) */}
            <div
              className="relative hidden md:block w-[280px] lg:w-[400px]"
              ref={searchRef}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                // --- BINDING INPUT TO LOGIC ---
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                // ------------------------------
              />
            </div>
          </div>

          {/* --- RIGHT SIDE: NAVIGATION --- */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Links */}
            <ul className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
              <li><Link to="/askquestion" className="hover:text-blue-600 transition">Ask Questions</Link></li>
              <li><Link to="/browsequestions" className="hover:text-blue-600 transition">Browse Questions</Link></li>
              <li><Link to="/Chatwithai" className="hover:text-blue-600 transition">AI Chat</Link></li>
              <li><Link to="/about" className="hover:text-blue-600 transition">About</Link></li>
            </ul>

            {/* User Profile Section */}
            {user ? (
              <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-gray-200 ml-2">
                
                {/* Streak */}
                <div 
                  className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100"
                  title="Your Daily Streak"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-orange-700 text-sm">{user.streak || 0}</span>
                </div>

                {/* Profile Dropdown */}
                <div className="flex items-center gap-3">
                  <div className="hidden xl:block text-right">
                    <div className="text-sm font-bold text-gray-900 leading-none">{user.username}</div>
                    <div className="text-xs text-gray-500 mt-1">{user.reputation || 0} Rep</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="h-9 w-9 cursor-pointer border border-gray-200 hover:border-blue-400 transition">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                          {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <Link to="/Userprofile" className="w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logoutHandler} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3 ml-4">
                 <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                 <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}

            {/* Hamburger (Mobile) */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-lg">
           
           {/* MOBILE SEARCH BAR (ADDED THIS) */}
           <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                className="pl-10 w-full bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
           </div>

           {/* Mobile User Info */}
           {user && (
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10 border">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <div>
                    <div className="font-bold text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.reputation || 0} Reputation</div>
                 </div>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-200">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-orange-700 text-sm">{user.streak || 0}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Link to="/askquestion" className="block px-3 py-2 rounded-md hover:bg-gray-50 font-medium" onClick={() => setMobileOpen(false)}>Ask Questions</Link>
            <Link to="/browsequestions" className="block px-3 py-2 rounded-md hover:bg-gray-50 font-medium" onClick={() => setMobileOpen(false)}>Browse Questions</Link>
            <Link to="/Chatwithai" className="block px-3 py-2 rounded-md hover:bg-gray-50 font-medium" onClick={() => setMobileOpen(false)}>Chat with AI</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-gray-50 font-medium" onClick={() => setMobileOpen(false)}>About</Link>
          </div>

          {user ? (
            <div className="pt-2 border-t border-gray-100">
              <Link to="/Userprofile" className="block px-3 py-2 text-gray-600 hover:text-blue-600" onClick={() => setMobileOpen(false)}>My Profile</Link>
              <button onClick={logoutHandler} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
             <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Log In</Button></Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}><Button className="w-full">Sign Up</Button></Link>
             </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;