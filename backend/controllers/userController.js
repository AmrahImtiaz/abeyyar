import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import { verifyMail } from "../emailVerify/verifyMail.js";
import { Session } from "../models/sessionModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios"; // <--- ADDED AXIOS HERE

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            loginDates: [] // Ensure this array exists for new users
        })
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" })
        try {
            await verifyMail(token, email)
        } catch (mailErr) {
            console.error('Failed to send verification email:', mailErr)
        }
        newUser.token = token
        await newUser.save()
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        })
    } catch (error) {
        console.error(error)
        if (error && (error.code === 11000 || error.code === 11001)) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            })
        }
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1]

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null
        user.isVerified = true
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized access" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.status(402).json({ success: false, message: "Incorrect Password" });

    if (user.isVerified !== true)
      return res.status(403).json({ success: false, message: "Verify your account before login" });

    // Delete existing session if any
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) await Session.deleteOne({ userId: user._id });

    // Create a new session
    await Session.create({ userId: user._id });

    // Update login dates for streak
    const today = new Date();
    // Initialize loginDates if undefined
    if (!user.loginDates) user.loginDates = [];
    
    const lastLogin = user.loginDates.length > 0 ? user.loginDates[user.loginDates.length - 1] : null;
    
    if (!lastLogin || lastLogin.toDateString() !== today.toDateString()) {
      user.loginDates.push(today);
    }

    // Calculate streak
    let streak = 1;
    const dates = user.loginDates.map(d => new Date(d)).sort((a, b) => b - a);
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    
    // Save streak to user model if you have a streak field, or just send it
    user.streak = streak;
    user.isLoggedIn = true;
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      accessToken,
      refreshToken,
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000)

        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save()
        await sendOtpMail(email, otp);
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOTP = async (req, res)=>{
    const {otp} = req.body
    const email = req.params.email

    if(!otp){
        return res.status(400).json({
            success:false,
            message:"OTP is requried"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP not generated or already verified"
            })
        }
        if (user.otpExpiry < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired. Please request a new one"
            })
        }
        if(otp !== user.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        user.otp = null
        user.otpExpiry = null
        await user.save()

        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const changePassword = async (req, res)=>{
    const {newPassword, confirmPassword} = req.body
    const email = req.params.email
    
    if(!newPassword || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    if(newPassword !== confirmPassword) {
        return res.status(400).json({
            success:false,
            message:"Password do not match"
        })
    }

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Password changed successsfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

// ----- ADDED GOOGLE LOGIN FUNCTION -----
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: "No token provided" });
        }

        // 1. Verify token with Google
        const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { sub, name, email, picture } = googleRes.data;

        // 2. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // --- NEW USER ---
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                username: name,
                email: email,
                password: hashedPassword,
                googleId: sub,
                avatar: picture,
                isVerified: true,
                streak: 1,
                loginDates: [new Date()], 
                isLoggedIn: true
            });
        } else {
            // --- EXISTING USER ---
            if (!user.googleId) user.googleId = sub;
            if (!user.avatar) user.avatar = picture;
            
            // Streak Logic (Copied from your loginUser)
            const today = new Date();
            // Safety check if loginDates is somehow undefined
            if (!user.loginDates) user.loginDates = [];
            const lastLogin = user.loginDates.length > 0 ? user.loginDates[user.loginDates.length - 1] : null;
            
            // Only push if it's a different day
            if (!lastLogin || lastLogin.toDateString() !== today.toDateString()) {
                user.loginDates.push(today);
            }

            // Recalculate Streak
            let streak = 1;
            const dates = user.loginDates.map(d => new Date(d)).sort((a, b) => b - a);
            for (let i = 1; i < dates.length; i++) {
                const diff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24);
                if (diff === 1) streak++;
                else break;
            }
            user.streak = streak; 
            user.isLoggedIn = true;
            await user.save();
        }

        // 3. Handle Session
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) await Session.deleteOne({ userId: user._id });
        await Session.create({ userId: user._id });

        // 4. Generate Tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

        // 5. Send Response
        return res.status(200).json({
            success: true,
            message: "Google Login Successful",
            accessToken,
            refreshToken,
            user
        });

    } catch (error) {
        console.error("Google Login Error:", error.message);
        return res.status(500).json({ success: false, message: "Google Login Failed" });
    }
};