const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
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
    phoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{10,15}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    role: {
        type: String,
        enum: ["Designer", "Brand", "Admin", "Business", "Individual", "buyer"],
        default: "buyer",
    },
    profilePicture: {
        url: String,
        public_id: String
    },
    isVerified: {
        type: Boolean,
        default: false
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
    paymentMethods: [{
        type: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet'],
            required: true
        },
        details: {
            type: Object
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    cart: [
        {
          PID: { type: String, required: true },
          dateadded : {type: Date, required: true , default: Date.now},
          quantity: { type: Number, default: 1, min: 1 },
          selectedSize: String,
          selectedColor: String
        }
    ],
    saved: [
        {
            PID: {type: String, required:true},
            dateadded : {type: Date, required: true , default: Date.now}
        }
    ],
    purchaseHistory: [
        {
            orderId: { type: String, required: true },
            products: [{
                PID: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                currency: { type: String, required: true }
            }],
            totalAmount: { type: Number, required: true },
            currency: { type: String, required: true },
            status: {
                type: String,
                enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
                default: 'pending'
            },
            shippingAddress: {
                street: String,
                city: String,
                state: String,
                country: String,
                postalCode: String
            },
            paymentMethod: String,
            orderDate: { type: Date, default: Date.now },
            deliveryDate: Date
        }
    ],
    followers: [
        {
            id: {type:String, required: true},
            since: {type: Date, default: Date.now},
            profilepicurl: {type:String} 
        }
    ],
    following: [
        {
            id: {type:String, required: true},
            since: {type: Date, default: Date.now},
            profilepicurl: {type:String} 
        }
    ],
    designerProfile: {
        bio: String,
        specialization: [String],
        experience: Number, // in years
        portfolio: [String], // URLs to portfolio items
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 }
        }
    },
    products: [
       { PID:{type: String , required: true} }
    ],
    lastLogin: Date,
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'deactivated'],
        default: 'active'
    }
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

userSchema.virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  });

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model("user", userSchema)