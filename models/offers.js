const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    gameListing: {type: Schema.Types.ObjectId, ref: 'Game'},
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, default:"Pending"},
    amount: {type: Number, required: [true, "Game must have a amount"], minValue: [0.01, "Amount should be a positive number"]},
});


module.exports = mongoose.model('Offer', offerSchema);



