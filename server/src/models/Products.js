const mongoose = require("mongoose")
const bcrypt = require("bcrypt")  // dont need this in product schema

const productSchema = new mongoose.Schema({
    Title: String,
    
    ID: {
        type: String,
        unique: true,
    },

    ownerID:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
    },
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    description: {
        type: String,
    },
    theme: {
        bgColor: { type: String, default: "#ffffff" },
        textColor: { type: String, default: "#000000" },
        fontFamily: {
            type: String,
            enum: [
              "Roboto",
              "Open Sans",
              "Lato",
              "Montserrat",
              "Poppins",
              "Playfair Display",
              "Merriweather",
              "Raleway",
              "Ubuntu",
              "Georgia",
            ],
            default: "Poppins",
          
        },
        gradient: String
    },
    images: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
          alt: { type: String },
          type: {
            type: String,
            enum: ["cover", "thumbnail", "gallery", "other"],
            default: "gallery"
          }
        }
     ]
})

const conversionRates = {
    USD: 83,   
    EUR: 90,    
    INR: 1
};

productSchema.pre('save', function (next) {
    if (this.currency !== 'INR') {
      this.price = this.price * conversionRates[this.currency];
      this.currency = 'INR'; 
    }
    next();
});

module.exports = mongoose.model("product", productSchema)