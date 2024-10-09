const mongoose = require('mongoose')
// const URI = 'mongodb://127.0.0.1:27017/mern_admin'
// mongoose.connect(URI)

const URI=process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Connection Successful to DB");
    } catch (error) {
        console.error('database connection error');
        process.exit(0)
    }
}

module.exports = connectDB;