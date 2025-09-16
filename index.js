const express=require("express")

const httpStatus = require('./utils/utils')

const mongoose=require('mongoose')

const  courseRouter =require("./routes/courses.routes")
const  userRouter =require("./routes/User.routes")
const path = require('path')

// to access to the enviroument
require('dotenv').config()

const app=express();

app.use(express.json())

app.use('/api/courses',courseRouter)
app.use('/api/user',userRouter)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

mongoose.connect(process.env.url).then(()=>{
    console.log('mongodb server started')
})

app.all('*',(req,res,next)=>{
    return res.status(404).json({status:httpStatus.ERROR, message:'this is not valid resourse'})
})
app.use((error,req,res,next)=>{
    res.status(error.statusCode || 500).json({status:error.statusText || httpStatus.ERROR,message:error.message,Code:error.statusCode || 500 , data: null})
})

app.listen(4000,()=>{
    console.log("conecte on port 4000")
})