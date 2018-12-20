const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    account: {
        photos: {
            requried: false,
            type: Array
        },
        phone: {
            type: String,
            default: ""
        },
        activity: String,
        description: {
            type: String,
            minlength: 1,
            maxlength: 100
        }
    },

    token: String,
    hash: String,
    salt: String
});

module.exports = mongoose.model("User", UserSchema, "users");