const { isValidObjectId } = require('mongoose');
const cartModel = require('../models/cartModel')
const productModel = require("../models/productModel");
const userModel = require('../models/userModel');


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< UPDATE-API >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


const updateOrder = async (req,res) =>{
    try{
    

        const userId = req.params.userId
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}
