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

module.exports = router;