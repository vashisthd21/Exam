import jwt from 'jsonwebtoken';
import User from '../models/model.user.js';

const authMiddleware = async (req, res, next) => {
    // Retrieve token from cookie or Authorization header
    const token =
        req.cookies?.BearerToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // Use `.id` based on token payload
        next(); // Important to proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token', error: error.message });
    }
};

export default authMiddleware;
