const mongoose = require("mongoose");
const { create } = require("./listing");

let reviewSchema = mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Reivew = mongoose.model("Review",reviewSchema);

module.exports = Reivew;