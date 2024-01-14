const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/phuongFashion');
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Connect Failure');
    }
}

module.exports = connectDB;