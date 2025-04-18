const mongoose = require("mongoose")


const auctionSchema = new mongoose.Schema({
    highestbid : Number,
    highestbidder : {
        type : String,
        unique: true,
        required : true
    },
    totalbids: {
        type : Number,
    },
    itemID: {
        type: String,
        required : true,
        unique: true,
        required: true,
    },
    itemowner: {
        type: String,
        required : true,
        unique: true,
        required: true,
    }

})

module.exports = mongoose.model("Auction" , auctionSchema)