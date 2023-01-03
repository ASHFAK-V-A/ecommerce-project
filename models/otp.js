const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({

    otp:{
        type:Number,
        required:true

    },
    email:{
        type:String,
        trim:true
    }
})

module.exports = mongoose.model('otp',otpSchema)