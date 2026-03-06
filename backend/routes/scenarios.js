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
router.post('/', async (req, res) => {
    try {
        const newScenario = new Scenario(req.body);
        const saved = await newScenario.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;