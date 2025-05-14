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
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product' // No need to import User model here
      }

})

module.exports = mongoose.model("Auction" , auctionSchema)