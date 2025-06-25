import jwt from 'jsonwebtoken';
import User from '../models/model.user.js';

// const generateToken = (userId) => {
//     return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn : '1h'});
// };

const authMiddleware = async (req, res) => {
    // console.log(req.header);
    // const token = req.header('authorization')?.replace('Bearer ','');
    // console.log('Token:', token);
    // console.log('All Headers:', req.headers); 
    console.log('Cookies:', req.cookies);
    const authHeader = req.cookies?.BearerToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log('Authorization Header:', authHeader);

    const token = authHeader?.replace('Bearer ', '');
    console.log('Token:', token);
    if(!token)  return res.status(401).json({message: 'Access denied. No token provided.'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        res.status(400).json({message: 'Invalid token', error: error.message});
    }
};

export default authMiddleware;