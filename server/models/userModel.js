const mongoose=require('mongoose');

const userSchema =new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    passwd:{
        type:String,
        required:true,
    },
    profile:{
        type:String
    },
    createdAt:{
        type:Date,
        defualt:Date.now
    }
},{timestamps:{updatedAt:true}})

const userModel=mongoose.model('users',userSchema);
module.exports=userModel;