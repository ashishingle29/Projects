const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String
    },
    phone: {
        type: String,
        required:true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    
    address: {
        shipping: {
            street: { type: String},
            city: { type: String},
            pincode: { type: Number}
        },

        billing: {
            street: { type: String},
            city: { type: String},
            pincode: { type: Number}
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('UserData',userSchema)
