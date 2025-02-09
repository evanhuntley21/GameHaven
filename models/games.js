const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: {type: String, required: [true, "Game must have a title"]},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    details: {type: String, required: [true, "Game must have a description"], minLength: [20, "The description must be at least 20 characters long"], maxlength: [500, "The description needs to be under 500 characters"]},
    condition: {type: String, required: ["Condition must be present"], enum: ["Slightly Used", "Like New", "Moderately Used", "Heavily Used", "Needs Repair"] },
    price: {type: Number, required: [true, "Game must have a price"], minValue: [0.01, "Price should be a positive number"]},
    image: {type: String, required: [true, "Listing must have an image path"]},
    offers: {type: Number, default: 0 },
    highestOffer: {type: Number, default: 0 },
    active: {type: Boolean, default: true}
});


module.exports = mongoose.model('Game', gameSchema);



