const express = require('express');
const User = require("../models/userModel");
const { 
    registerUser,
    loginUser,
    logout
} = require('../controllers/userController');


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);


module.exports = router;