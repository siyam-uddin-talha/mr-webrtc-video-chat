/*
author:'Arnob Islam'
created date:'01-01-2021'
description:''
*/

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

const user = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        // select: false
    },

    resetPasswordToken: String,
    resetPasswordTokenExpireDate: Date,

})


// save password with bcrypt 
user.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 12)
    }
    next()
})


// reset password with crypto
user.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(30).toString('hex')
    // creatimg tokan
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    // expire in 15 minits
    this.resetPasswordTokenExpireDate = Date.now() + 15 * 60 * 1000
    return resetToken
}

const USER = mongoose.model('users', user)

module.exports = USER

