import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Star, MessageSquare, HelpCircle, Calendar, Mail, Trophy } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getData } from "@/context/userContext";

export default function Userprofile() {
  // 1. GET DATA FROM CONTEXT (Loaded by Navbar)
  const { user } = getData();

  // Handle loading state or no user
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-xl text-gray-500">Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Optional: Simple Rank Logic based on Reputation
  const getRankName = (rep) => {
    if (rep >= 1000) return "Expert";
    if (rep >= 500) return "Advanced";
    if (rep >= 100) return "Intermediate";
    return "Beginner";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- HEADER SECTION --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-2xl shadow-sm border-gray-100 mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        {/* PROFILE PICTURE (Read-Only) */}
                        <div className="relative">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                                <AvatarImage src={user.avatar} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-gray-100 text-gray-500 font-bold">
                                    {user.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {/* Online Status Dot */}
                            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></span>
                        </div>
                        
                        {/* TOTAL REPUTATION BADGE */}
                        <div className="hidden sm:flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl border border-yellow-100 shadow-sm">
                            <Trophy className="w-5 h-5 fill-yellow-500 text-yellow-600" />
                            <div className="text-sm font-bold">
                                <span className="text-lg">{user.reputation || 0}</span> <span className="text-xs uppercase ml-1 opacity-80">Reputation</span>
                            </div>
                        </div>
                    </div>

                    {/* USER INFO */}
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {getRankName(user.reputation)}
                                </Badge>
                            </div>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> 
                                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
          </motion.div>


          {/* --- STATS GRID --- */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* 1. STREAK CARD */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ delay: 0.2 }}
            >
                <Card className="h-full border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" /> Daily Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-extrabold text-gray-900">{user.streak || 0}</span>
                            <span className="text-gray-500 font-medium">Days</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                            Log in daily to keep your streak alive!
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 2. CONTRIBUTIONS CARD (Replaces Easy/Medium/Hard) */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ delay: 0.3 }}
            >
                <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Star className="w-5 h-5 text-purple-500 fill-purple-500" /> Contributions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 mt-2">
                        
                        {/* Questions Count */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-700">Questions Asked</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{user.questions || 0}</span>
                        </div>

                        {/* Answers Count */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-md text-green-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-700">Answers Given</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{user.answers || 0}</span>
                        </div>

                    </CardContent>
                </Card>
            </motion.div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}