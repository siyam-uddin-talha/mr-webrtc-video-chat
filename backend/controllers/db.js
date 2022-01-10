/*
author:'Arnob Islam'
created date:'01-12-21'
description:''
*/

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_DATABASE_URL).then(res => {
    console.log('connected successfully !!!');
}).catch(err => {
    console.log(err.message);
})