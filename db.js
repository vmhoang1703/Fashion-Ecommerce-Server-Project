const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_URI);
    console.log("Connect Successfully");
  } catch (error) {
    console.log("Connect Failure: " + error.message);
  }
}

module.exports = connectDB;
