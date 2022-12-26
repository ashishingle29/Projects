const { isValidObjectId } = require('mongoose');
const cartModel = require('../models/cartModel')
const productModel = require("../models/productModel");
const orderModel  = require('../models/orderModel')
const userModel = require("../models/userModel");
const{validValue} = require('../validator/validation')


//......................Create Order.........................

const createOrder = function(req,res){
    try{

    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}


//.....................Update Order..........................
const UpdateOrder = function(req,res){
    try{

    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}

module.exports = {createOrder,UpdateOrder}