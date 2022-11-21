const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

let internModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    collegeId: {
        type: objectId,
        ref: "College",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Intern',internModel)
