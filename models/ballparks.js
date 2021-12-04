const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BallparkSchema = new Schema({
    ballpark: String,
    team: String,
    class: String,
    league: String,
    x: Number,
    y: Number
});

module.exports = mongoose.model('Ballpark', BallparkSchema);