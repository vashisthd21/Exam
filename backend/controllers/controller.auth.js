import User from '../models/model.user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: '1h'});
};
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser._id); // Fix: use newUser

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000 // 1 hour
        };

        return res
            .cookie("BearerToken", token, options)
            .status(200)
            .json({
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email }, // ✅ Fix
                message: 'Register successful. Taking you to Quiz page'
            });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000 // 1 hour
        };

        console.log("Login successful for user:", user); 

        return res
            .cookie("BearerToken", token, options)
            .status(200)
            .json({
                token,
                user: { id: user._id, name: user.name, email: user.email },
                message: 'Login successful. Taking you to Quiz page'
            });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export {
    register,
    login
};