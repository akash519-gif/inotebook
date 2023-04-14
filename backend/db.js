const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook" // changed localhost:27017 to 127.0.0.1:27017 because mongoose 
// was resolving localhost as wrong value.  

const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then( console.log("Connected to Mongo Succesfully"))
}

module.exports = connectToMongo;