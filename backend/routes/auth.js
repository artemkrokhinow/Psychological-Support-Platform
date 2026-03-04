const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Користувач вже існує' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword, username });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username } });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username } });
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;