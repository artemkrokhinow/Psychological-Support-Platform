const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    scenarioId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nodes: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);