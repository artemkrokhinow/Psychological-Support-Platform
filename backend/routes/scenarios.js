const express = require('express');
const router = express.Router();
const Scenario = require('../models/Scenario');

router.get('/:id', async (req, res) => {
    try {
        const scenario = await Scenario.findOne({ scenarioId: req.params.id });
        if (!scenario) return res.status(404).json({ message: 'Сценарій не знайдено' });
        res.json(scenario.nodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;