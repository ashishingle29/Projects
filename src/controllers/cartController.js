const { isValidObjectId } = require('mongoose');
const cartModel = require('../models/cartModel')
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const{validValue} = require('../validator/validation')


//..........................................CREATE_CART.........................................................
const createCart = async (req,res) =>{
    try{
    
        const userId = req.params.userId;
        if(!isValidObjectId)return res.status(400).send({status:false,message:"userId is not Valid"})
    
        const data = req.body;
        const{productId,cartId}= data
       if(Object.keys(data).length == 0) return res.status(400).send({status:false,message:"Please Provide Some Data for create a Cart"})
         

        if(!productId)return res.status(400).send({status:false,message:"productId is required"})
        if(!isValidObjectId(productId))return res.status(400).send({status:false,message:"Please provide a valid productId "})
        const findProductId = await productModel.findOne({_id:productId,isDeleted:false})
        if(!findProductId){
          return res.status(404).send({status:false,message:"Product is not  exist "})
        }
         

        if(cartId){
      if (!validValue(cartId)) { return res.status(400).status({ status: false, message: "cardId should not be empty" })}  
        if(!isValidObjectId(productId))return res.status(400).send({status:false,message:"Please provide a valid cartId"})
        }
        //....................cartId....................................

        const findCart = await cartModel.findOne({userId:userId});
        if(!findCart){
            let cartData = {
                userId:userId,
                items:[{productId:productId,quantity:1}],
                totalPrice:findProductId.price,
                totalItems:1
            }
            const createData = await cartModel.create(cartData)
            return res.status(201).send({ status: true, message: "Cart Created Successfully", data: createData })
        }
        if(findCart){
            if (!cartId) {
                return res.status(400).send({ status: false, message: "you have already a Cart ,please provide cartId for the user" })
            }
            if(findCart._id != cartId){
                return res.status(404).send({ status: false, message: "Cart id is not correct for this User" })
            }
        }
        
  // when user sending same productId 
        let array = findCart.items;
        for(let i= 0 ; i < array.length;i++){
             if(array[i].productId == productId){
                array[i].quantity = array[i].quantity + 1
                let updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: array, totalPrice: findCart.totalPrice + findProductId.price, totalItems: array.length }, { new: true })
                 return res.status(201).send({ status: true, message: "Success", data: updateCart })
             }
        }
//when user add another product
    let objData = {
        $addToSet:{items:{productId:findProductId._id,quantity:1}},
        totalPrice:findProductId.price + findCart.totalPrice,
        totalItems:findCart.totalItems + 1
    }
         let  updateCart = await cartModel.findOneAndUpdate({ userId: userId }, objData, { new: true })
           return res.status(201).send({ status: true, message: "Success", data: updateCart });
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}



//..................................GET CART.................................................

const getCart = async function (req, res) {
    const userId = req.params.userId
    if (!isValidObjectId) { return res.status(400).send({ status: false, message: "Please provide valid userId" }); }

    const userData = await userModel.findById(userId)
    if (!userData) { return res.status(400).send({ status: false, message: "UserId not found" }); }

    const cartData = await cartModel.findOne({ userId: userId, isDeleted: false })
    if (!cartData) { return res.status(400).send({ status: false, message: "Cart not found/already deleted" }); }

    return res.status(200).send({ status: true, message: "Success", data: cartData })

}
//........................................DEleteCart...............................................
const deleteCart = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId) { return res.status(400).send({ status: false, message: "Please provide valid userId" }); }

        const userData = await userModel.findById(userId)
        if (!userData) { return res.status(400).send({ status: false, message: "UserId not found" }); }

        const cartData = await cartModel.findOne({ userId: userId, isDeleted: false })
        if (!cartData) { return res.status(400).send({ status: false, message: "Cart not found/already deleted" }); }

        const saveData = await cartModel.findOneAndUpdate({ userId: userId, $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })

        return res.staus(204).send({ staus: true, message: "Cart successfully deleted", data: saveData })
    }
    catch (error) {

    }
}
module.exports = {createCart,getCart,deleteCart}