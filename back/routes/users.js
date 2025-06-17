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
    try {
        // --- Step 1: Check for user and validate input ---
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Use a generic error message for security. Don't tell the attacker
            // that the email doesn't exist.
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // --- Step 2: Compare the provided password with the stored hash ---
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // --- Step 3: If credentials are correct, create and sign a JWT ---
        const payload = {
            user: {
                id: user.id // We include the user's unique ID in the payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Use the secret from your .env file
            { expiresIn: 3600 }, // Token expires in 1 hour (3600 seconds)
            (err, token) => {
                if (err) throw err;
                // --- Step 4: Send the token back to the user ---
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




// Don't forget to export the router
module.exports = router;