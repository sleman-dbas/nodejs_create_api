const courese = require("../data/schema")
const {validationResult}=require("express-validator")
const asyncWrapper = require('../middleWare/appWrapper')
const appError =require ('../utils/handelError')

const readcourses = asyncWrapper(async(req,res)=>{
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 0
    const skip = (page-1)*limit 
    const courses= await courese.find().limit(limit).skip(skip)
    res.json({status:'succsess',data:{courses}})
})

const read_single_course=asyncWrapper(async(req,res,next)=>{
    const course_id= req.params.courseId
    console.log(req.params);
    
    const cour=await courese.findById(course_id)
    if(!courese){
        const error=appError.create('coures not found',404,"fail")
        return next(error)
    }
    res.json({status:'succsess',data:{cour}});
})
const edit_course = asyncWrapper(async(req,res,next)=>{
    let cou_id= req.params.courseId
    const update_course= await courese.updateOne(cou_id,{$set:{...req.body}})
    if(update_course){
        const error=appError.create('coures not found',404,"fail")
        return next(error)
    }
    res.json({status:'succsess',data:{update_course}})
})

const creat_coursse = asyncWrapper(async(req,res,next)=>{   
    const Error =validationResult(req)
    if(!Error.isEmpty()){
        const error=appError.create('some thing wrong',404,"fail")
        next(error)
    }
    const newCourese = new courese(req.body)
    await newCourese.save()
    res.json({status:'succsess',data:{newCourese}})
})

const delete_course=asyncWrapper(async(req,res)=>{
    const cou_id=req.params.courseId
    await courese.deleteOne({id:cou_id})
    res.json({status:'succsess',data:null})
})

module.exports={
    readcourses,
    read_single_course,
    edit_course,
    creat_coursse,
    delete_course
}