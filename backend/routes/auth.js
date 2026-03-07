
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
    
    res.status(statusCode)
        .cookie('dr_token', token, { 
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        .json({ user: { id: user._id, username: user.username } });
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Користувач вже існує' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword, username });
        await user.save();
        
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Користувач не знайдений' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Невірний пароль' });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/guest', async (req, res) => {
    try {
        const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        const user = new User({
            email: `${guestId}@shalter.com`,
            password: await bcrypt.hash('guest_pass', 10),
            username: 'Гість'
        });
        await user.save();
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/logout', (req, res) => {
    res.cookie('dr_token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;
