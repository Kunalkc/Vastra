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
        bgColor: { type: String, default: "#a69c9c" },
        gradient: String
    },
    layout: [
        {

          content: String, //only for text
          url: { type: String}, //only for images
          public_id: { type: String}, //img
          alt: { type: String }, 
          type: {
            type: String,
            enum: ["image", "text"],
            default: "gallery",
            required : true
          },
          top: { type: Number, required: true },
          left: { type: Number, required: true },
          width: { type: Number },
          height: { type: Number },
          fontSize: { type: Number },    // only for text
          textColor: { type: String, default: "#000000" },       // only for text
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