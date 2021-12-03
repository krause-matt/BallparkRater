const mongoose = require('mongoose');
const ballparkdata = require('./ballparkdata');
const Ballpark = require('../models/ballparks');

mongoose.connect('mongodb://localhost:27017/ballparks', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Ballpark.deleteMany({});
    // const c = new Ballpark({title: `${ballparkdata[0].features[0].properties.Ballpark}`});
    // await c.save();
    for (let i = 0; i < 30; i++) {
        const park = new Ballpark({
            ballpark: `${ballparkdata[0].features[i].properties.Ballpark}`,
            team: `${ballparkdata[0].features[i].properties.Teams[0].Team}`,
            x: `${ballparkdata[0].features[i].geometry.coordinates[0]}`,
            y: `${ballparkdata[0].features[i].geometry.coordinates[1]}`
        });
        await park.save();


        // const random1000 = Math.floor(Math.random() * 1000);
        // const park = new Ballpark({
        //     location: `${cities[random1000].city}, ${cities[random1000].state}`,
        //     title: `${sample(descriptors)} ${sample(places)}`
        // })
        // await park.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})