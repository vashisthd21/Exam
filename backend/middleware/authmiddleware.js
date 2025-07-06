import jwt from 'jsonwebtoken';
import User from '../models/model.user.js';

const authMiddleware = async (req, res, next) => {
    const token =
        req.cookies?.BearerToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    console.log('Token:', token); 

    // If token is missing
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        // If user not found
        if (!req.user) {
            return res.status(401).json({ message: 'User not found. Unauthorized access.' });
        }

        next();
    } catch (error) {
        console.error("💥 Error in authMiddleware:", error);

        // Handle token expiry 
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        return res.status(401).json({ message: 'Invalid token. Access denied.' });
    }
};

export default authMiddleware;
