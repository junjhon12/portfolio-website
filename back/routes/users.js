const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import the User model we just created
const User = require('../models/User');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // --- Step 1: Check if the user already exists ---
        const { email, password } = req.body;

        // A simple validation to make sure fields are not empty
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        let user = await User.findOne({ email });
        if (user) {
            // 400 means Bad Request - the user's input is invalid because the email is taken
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // --- Step 2: Hash the password ---
        const salt = await bcrypt.genSalt(10); // Generate a "salt" for hashing
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- Step 3: Create and save the new user ---
        user = new User({
            email,
            password: hashedPassword // Save the HASHED password, not the original
        });

        await user.save();

        // --- Step 4: Send back a success response ---
        // We don't want to send the password back, even the hashed one.
        res.status(201).json({
            msg: 'User registered successfully!',
            user: {
                id: user.id,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users/login
// @desc    Log a user in
// @access  Public
router.post('/login', async (req, res) => {
    // We will write the logic for logging in here.
    // Steps:
    // 1. Find the user by email.
    // 2. If user exists, compare the provided password with the stored hash using bcrypt.
    // 3. If passwords match, generate a JSON Web Token (JWT).
    // 4. Send the token back to the user.
    res.send('Login route is working!');
});




// Don't forget to export the router
module.exports = router;