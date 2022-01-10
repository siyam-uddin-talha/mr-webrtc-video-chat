/*
author:'Arnob Islam'
created date:'01-01-2021'
description:'this file will provide the user functions'
*/


const USER = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');



// registratin function 
const REGISTER_NEW_USER = async (req, res) => {

    const { firstName, lastName, email, password, } = req.body

    try {

        const IsTheUserExist = await USER.findOne({ email })
        if (IsTheUserExist) {
            res.json({ success: false, message: `user exist! try to login` })
        }
        if (!IsTheUserExist) {
            const response = await USER.create({
                firstName, lastName, email, password,
            })
            const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '7d'
            })
            res.cookie('token', token, {
                expires: new Date(Date.now() + 604800000),
                httpOnly: true
            })
            res.status(201).json({ message: `register success!`, success: true, response })
        }
    } catch (error) {
        res.json({ message: `${error.message}`, success: false })
    }
}

// login function
const LOGIN = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.json({ message: 'please fill the input', success: false })
        }

        const response = await USER.findOne({ email: email })

        if (!response) {
            return res.json({ message: 'not signup', success: false })
        }
        const byres = await bcryptjs.compare(password, response.password)

        if (byres) {
            const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '7d'
            })
            res.cookie('token', token, {
                expires: new Date(Date.now() + 604800000),
                httpOnly: true
            })
            res.status(200).json({ success: true, message: 'login success', response })
        } else {
            res.json({ message: 'error is occur', success: false })
        }
    } catch (error) {
        res.json({ message: `${error.message}`, success: false })
    }
}

// log out fuction
const LOG_OUT = async (req, res) => {
    try {
        res.clearCookie('token')
        res.json({ success: true, message: 'logout success' })
    } catch (error) {
        res.json({ message: `${error.message}`, success: false })
    }
}


module.exports = { REGISTER_NEW_USER, LOGIN, LOG_OUT }