const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/current', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Помилка сервера');
    }
});

router.post('/save-diagnostic', auth, async (req, res) => {
    try {
        const { answers } = req.body;
        const user = await User.findById(req.user.id);
        
        user.diagnostic.answers = answers;
        user.diagnostic.completedAt = Date.now();
        
        let initialScore = 50;
        if (answers.includes(3)) initialScore += 20;
        if (answers.includes(1)) initialScore -= 20;

        user.stats.resilience = initialScore;
        user.history.push({ score: initialScore });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Помилка сервера');
    }
});

module.exports = router;