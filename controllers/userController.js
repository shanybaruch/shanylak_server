const User = require('../models/User');
const nodemailer = require('nodemailer');

// Dummy storage for auth codes (in production, use a database)
const authCodes = {};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('appointments');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Register user
exports.register = async (req, res) => {
    try {
        const { phone, email } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Generate a random 6-digit authentication code
        const authCode = Math.floor(100000 + Math.random() * 900000);

        // Save auth code temporarily
        authCodes[email] = authCode;

        // Send the auth code via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail address
                pass: process.env.GMAIL_PASS, // Your Gmail app password
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Your Authentication Code',
            text: `Your authentication code is: ${authCode}`,
        });

        res.status(200).json({ message: 'Authentication code sent to your email' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify authentication code
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        // Check if the code matches
        if (authCodes[email] && parseInt(code) === authCodes[email]) {
            // Create the user after verification
            const { phone } = req.body;
            const user = new User({ email, phone, authCode: null });
            await user.save();

            // Remove the temporary auth code
            delete authCodes[email];

            res.status(201).json({ message: 'User registered successfully', user });
        } else {
            res.status(400).json({ error: 'Invalid authentication code' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, phone } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email, phone });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
