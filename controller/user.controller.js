const user = require("../data/user.data")
const bcrypt=require('bcryptjs')
const {validationResult}=require("express-validator")
const asyncWrapper = require('../middleWare/appWrapper')
const appError =require ('../utils/handelError')
const genrateJWT = require('../utils/genrateJWT')
const httpStatus = require ('../utils/utils')

getAllUser = asyncWrapper(async(req,res)=>{
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 0
    const skip = (page-1)*limit 
    const users= await user.find({},{password:0}).limit(limit).skip(skip)
    res.json({status:'succsess',data:{users}})
})

register = asyncWrapper(async(req,res,next)=>{
    const {firstName,secondName,email,password,role,avatar} = req.body
    console.log(avatar);
    console.log(req.file);
    
    const oldUser = await user.findOne({email:email})
    if(oldUser){
        const error = appError.create('the email is already exist',500)
        return next(error)
    }
    const hasedpassword = await bcrypt.hash(password,10)
    const newuser = new user({
        firstName,
        secondName,
        email,
        password:hasedpassword,
        role,
        avatar
    })
    const token = await genrateJWT({email:newuser.email, id:newuser._id,role:newuser.role })
    newuser.token=token
    await newuser.save()
    res.json({status:'succsess',data:{newuser}})
})

login = asyncWrapper(async(req,res,next)=>{
    const {email,password} = req.body
    if(!email&&!password){
        const error = appError.create('email and password are required',401,httpStatus.ERROR)
        return next(error);
    }
    const userr = await user.findOne({email:email})
    if(!userr){
        const error = appError.create('user not found',400,httpStatus.FAILS)
        return next(error)
    }
    const matchedPassword = await bcrypt.compare(password,userr.password) 
    if(userr && matchedPassword){
        const token = await genrateJWT({email:userr.email, id:userr._id ,role:userr.role})
        return res.status(200).json({status:httpStatus.SUCCSESS,data:{token},})
    }else{
        const error = appError.create('something wrong',500,httpStatus.ERROR)
        return next(error)
    }

})

module.exports={
    getAllUser,
    register,
    login
}