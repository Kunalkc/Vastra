const mongoose = require("mongoose")

const master = new mongoose.Schema({
    nextauctiondate : Date,
    ongoingitemsauction: Number,
    totalusers: Number,
})

module.exports = mongoose.model("Master", master)