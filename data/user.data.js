const mongoose = require("mongoose");
const validator = require("validator")
const userRolle =require('../utils/userRolle');
const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    secondName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'filed must be valid email adress']
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String         
    },
    role:{
        type:String,
        enum:[userRolle.user,userRolle.manger,userRolle.admain],
        default:"user"
    },  
    avatar:{
        type:String,
        default:'uploads/profile1.png'
    }
})
module.exports=mongoose.model('User',UserSchema)
