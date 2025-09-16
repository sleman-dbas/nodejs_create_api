const express = require("express");
const appError =require ('../utils/handelError')
const verify = require('../middleWare/verifyToken')
const routes = express.Router();
const user_controller = require("../controller/user.controller")
const allowed = require('../middleWare/allowedToJs')
const userRolle = require('../utils/userRolle')
const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('file',file)
        cb(null,'uploads')
    },
    filename:function(req,file,cb){
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${Date.now()}.${ext}`
        cb(null,fileName)
    }
})
const fileFilter = (req,file,cb)=>{
    const imageType = file.mimetype.split('/')[0]
    
    if(imageType == 'image' ){
        return cb(null,true)
    }else{
        return cb(appError.create('file must be an image',400,false))
    }
} 
const uploads = multer({
    storage:diskStorage,
    fileFilter:fileFilter
})

routes.route('/')
            .get(verify,allowed(userRolle.admain),user_controller.getAllUser)

routes.route('/register')
            .post(uploads.single('avatar'),user_controller.register)
routes.route('/login')
            .post(user_controller.login)
module.exports=routes;
