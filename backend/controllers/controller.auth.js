import User from '../models/model.user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn: '1h'});
};

const register = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();
        
        res.status(201).json({message: 'User registered succewssfully'});
    } catch (error) {
        res.status(500).json({message: 'Error registering user', error: error.message});
    }
};

const login = async( req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
    
        if(!user || !(await bcrypt.compare(password, user.password)))       //check if this statement is correct
            return res.status
                    (401).json({message: 'Invalid email or password'});
    
        const token = generateToken(user._id);;
        console.log('User ID:', user.name);
        res.status(200)
            .json({
                token,
                user: { id: user._id, name: user.name},
                message: 'Login successful. Taking you to Quiz page'});    
        }
        catch (error) {
            res.status(500)
                .json({message: "Error logging in", error: error.message});
        };
};

//Check for it
export {
    register,
    login
};