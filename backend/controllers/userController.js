const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
};


// Register User
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields");
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must at least be 6 characters");
    }

    // Check if user email already exists
    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400);
        throw new Error("Email has already been used");
    }


    // Create new user
    const user = await User.create({
        name,
        email,
        password
    });

    //Generate Token
    const token = generateToken(user._id);
    
    // Send HTTP-only cookie 
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
    });

    if (user) {
        const {_id, name, email } = user;
        res.status(201).json({
            _id, name, email, token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data");
    }
});

// Login User
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    // Validate request
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }

    // Check if user exists
    const user = await User.findOne({email});

    if (!user) {
        res.status(400);
        throw new Error("User not found. Please sign up.");
    }

    // User exists, now check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user._id);
    


    if (user && passwordIsCorrect) {
        const {_id, name, email } = user;
            // Send HTTP-only cookie 
            res.cookie("token", token, {
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 86400), // 1 day
                sameSite: "none",
                secure: true
            });
        res.status(200).json({
            _id, name, email, token
        })
    } else {
        throw new Error("Invalid email and/or password");
    }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", '', {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1 day
        sameSite: "none",
        secure: true
    });
    res.status(200).json({ message: "Successfully logged out" })
});


module.exports = {
    registerUser,
    loginUser,
    logout
};