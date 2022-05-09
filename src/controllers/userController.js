const userModel = require('../models/userModel');
import {isValidField,isValidMobileNo,isValidRequestBody,isValidTitle} from '../validators/validator';

const createUser = async function(req,res)
{
    if(!isValidRequestBody(req.body))

        return res.status(400).send({status : false, message : "Invalid request parameter. Please provide user details in request body."});
    
    let {title,name,phone,email,password,address} = req.body;
    if(!isValidField(title))
    
        return res.status(400).send({status : false, message : "Title is required."});

    if(!isValidTitle(title))
    
        return res.status(400).send({status : false, message : "Invalid title. Title can only be either 'Mr', 'Mrs', or 'Miss'."});

    if(!isValidField(name))
    
        return res.status(400).send({status : false, message : "User Name is required."});
    
    if(!isValidField(phone))
    
        return res.status(400).send({status : false, message : "Phone Number is required."});
    
    if(!isValidMobileNo(phone))
    
        return res.status(400).send({status : false, message : "Invalid phone number. Please enter a valid Indian phone number."});
    
    let mobileAlreadyExists = await userModel.findOne(phone);
    if(mobileAlreadyExists)
    
        return res.status(400).send({status : false, message : "Phone number has already been used."});
};

const loginUser = async function(req,res)
{

};

module.exports={createUser,loginUser};