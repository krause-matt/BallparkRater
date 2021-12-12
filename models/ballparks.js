const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const BallparkSchema = new Schema({
    ballpark: String,
    team: String,
    class: String,
    league: String,
    longitude: Number,
    latitude: Number,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

BallparkSchema.post("findOneAndDelete", async function(ballpark) {
    if (ballpark) {
        await Review.deleteMany({ _id: { $in: ballpark.reviews}})
    }
})

module.exports = mongoose.model("Ballpark", BallparkSchema);