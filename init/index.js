const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData =require("./data");
const dbUrl = "mongodb+srv://P2:P2@cluster0.iusqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log(dbUrl);

mongoose.connect(dbUrl)
.then(() => console.log("Connected to MongoDB"));

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'67a45289646776be4c0a61e9'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised")
}
initDB();