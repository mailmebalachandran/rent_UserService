const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    MiddleName: {
        type: String,
        required: false
    },
    LastName: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    EmailId: {
        type: String,
        required: true,
        unique: true
    },
    UserName: {
        type:String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    CreatedBy: {
        type: String,
        required: true
    },
    CreatedDateTime: {
        type: String,
        required: true,
        default: Date.now
    },
    UpdatedBy:{
        type:String,
        required: false
    },
    UpdatedDateTime: {
        type: String,
        requird: false,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema);
