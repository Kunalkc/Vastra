const mongoose = require("mongoose")

const master = new mongoose.Schema({
    nextauctiondate : Date,
    ongoingitemsauction: Number,
    totalusers: Number,
})