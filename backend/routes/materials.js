const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.get('/', async (req, res) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const newMaterial = new Material(req.body);
        const saved = await newMaterial.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
module.exports = router;