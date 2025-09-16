const express = require("express");
const routes = express.Router();
const courses_controller = require("../controller/courses.controller")
const {body}=require("express-validator");
const verify_token =require('../middleWare/verifyToken')
const allowed = require('../middleWare/allowedToJs')
const userRolle = require('../utils/userRolle')

routes.route('/')
            .get(verify_token,courses_controller.readcourses)
            .post(
[body("title")
    .notEmpty()
    .withMessage("the title is require")
    .isLength({min:2})
    .withMessage("title at least is 2 digits "),
body("price")
    .notEmpty() 
    .withMessage("the price is require")]
,verify_token,allowed(userRolle.manger,userRolle.admain),courses_controller.creat_coursse);

routes.route('/:courseId')
                    .get(verify_token,courses_controller.read_single_course)
                    .patch(verify_token,allowed(userRolle.manger,userRolle.admain),courses_controller.edit_course)
                    .delete(verify_token,allowed(userRolle.admain,userRolle.manger),courses_controller.delete_course)
module.exports=routes;
