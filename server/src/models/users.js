const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    googleId: {
        type: String,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; 
        },
        minlength: 6
    },
    age: {
        type: Number,
        min: 1,
        max: 120,
    },
    role: {
        type: String,
        enum: ["Designer", "Brand", "Admin", "Business", "Individual"],
        default: "buyer",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currencypreference: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    cart: [
        {
          PID: { type: String, required: true },
          dateadded : {type: Date, required: true , default: Date.now}
        }
    ],
    saved: [
        {
            PID: {type: String, required:true},
            dateadded : {type: Date, required: true , default: Date.now}
        }
    ],
    followers: [
        {
            id: {type:String, required: true},
        }
    ],
    following: [
        {
            id: {type:String, required: true},
        }
    ]
}, {
    timestamps: true
});


userSchema.pre('save', async function(next) {
  
    if (this.googleId && !this.password) {
        this.email = this.email.toLowerCase();
        return next();
    }
    
    if (!this.isModified('password')) return next();
    
    try {
  
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model("User", userSchema)