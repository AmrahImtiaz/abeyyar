import { BookOpen, LogOut, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
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
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);

  
const logoutHandler = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await axios.post(
      "http://localhost:8000/user/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    <nav className="p-2 border-b border-white bg-transparent ">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">

        {/* Logo + Search Container */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <BookOpen className="h-2 w-6 text-blue-800" />

          <h1 className="font-bold text-xl whitespace-nowrap">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-blue-600">Learn</span>
              <span>Stack</span>
            </Link>
          </h1>
        </div>

        {/* SEARCH BAR - visible on tablet & desktop */}
        <div
          className="relative hidden sm:block md:w-[260px] lg:w-[360px] xl:w-[420px] w-full"
          ref={searchRef}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onFocus={() => setShowSearchHelp(true)}
          />
        </div>

        {/* Hamburger for mobile/tablet */}
        <button
          className="lg:hidden p-2 ml-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-7 items-center text-lg font-semibold">
          <li><Link to="/askquestion" className="hover:text-blue-600 hover:underline underline-offset-8
">Ask Questions</Link></li>
          <li><Link to="/browsequestions" className="hover:text-blue-600 hover:underline underline-offset-8
">Browse Questions</Link></li>
          <li><Link to="/Chatwithai" className="hover:text-blue-600 hover:underline underline-offset-8
">Chat with AI</Link></li>
          <li><Link to="/about" className="hover:text-blue-600 hover:underline underline-offset-8
">About</Link></li>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link to="/Userprofile">Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <li><Link to="/login" className="hover:text-blue-600 hover:underline underline-offset-4
">Login</Link></li>
          )}
        </ul>
      </div>

      {/* MOBILE + TABLET MENU */}
      {mobileOpen && (
        <ul className="lg:hidden mt-3 space-y-4 text-lg font-semibold bg-white p-4 rounded-md shadow ">
          <li><Link to="/askquestion" className="hover:text-blue-600 hover:underline underline-offset-4
">Ask Questions</Link></li>
          <li><Link to="/browsequestions" className="hover:text-blue-600 hover:underline underline-offset-4
">Browse Questions</Link></li>
          <li><Link to="/Chatwithai" className="hover:text-blue-600 hover:underline underline-offset-4
">Chat with AI</Link></li>
          <li><Link to="/about" className="hover:text-blue-600 hover:underline underline-offset-4
">About</Link></li>


          {user ? (
            <>
              <li><Link to="/Userprofile">Profile</Link></li>
              <li onClick={logoutHandler} className="text-red-500 cursor-pointer">Logout</li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
