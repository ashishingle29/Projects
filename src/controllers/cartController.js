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
        const findProductId = await productModel.findOne({_id:productId,isDeleted:false}).select({_id:0})
        if(!findProductId){
          return res.status(404).send({status:false,message:"Product is not  exist "})
        }
         

        if(cartId){
         if (!validValue(cartId)) { return res.status(400).status({ status: false, message: "cardId should not be empty" })}  
         if(!isValidObjectId(productId))return res.status(400).send({status:false,message:"Please provide a valid cartId"})
        }
        //....................cartId....................................

        const findCart = await cartModel.findOne({userId:userId})
        if(!findCart){
            let cartData = {
                userId:userId,
                items:[{productId:productId,quantity:1}],
                totalPrice:findProductId.price,
                totalItems:1
            }
            const createData = await cartModel.create(cartData)
            const finalData = await cartModel.findOne({userId:userId}).select({'items._id':0})
            return res.status(201).send({ status: true, message: "Cart Created Successfully", data: finalData })
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
                let updateCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: array, totalPrice: findCart.totalPrice + findProductId.price, totalItems: array.length }, { new: true }).select({'items._id':0})
                 return res.status(201).send({ status: true, message: "Success", data: updateCart })
             }
        }
//when user add another product
    let objData = {
        $addToSet:{items:{productId:findProductId._id,quantity:1}},
        totalPrice:findProductId.price + findCart.totalPrice,
        totalItems:findCart.totalItems + 1
    }
         let  updateCart = await cartModel.findOneAndUpdate({ userId: userId }, objData, { new: true }).select({'items._id':0})
           return res.status(201).send({ status: true, message: "Success", data: updateCart });
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

//................................Update Cart................................

const updateCart = async function (req,res){
    try{

        const userId = req.params.userId
        const data = req.body
        let {cartId, productId,removeProduct} = data
        if(Object.keys(data).length == 0){return res.status(400).send({status:false, message: "Please provide some Data"})}

        if(!cartId){ return res.status(400).send({status: false, message: "CartId is required"})}
        if(!isValidObjectId(cartId)) { return res.status(400).send({status: false, message: "Please provide valid cartId"})}
        const cartCheck = await cartModel.findById({_id:cartId})
        if(!cartCheck){ return res.status(404).send({status: false, message: "cartId not found"})} 

        if(!productId){ return res.status(400).send({status: false, message: "productId is required"})}
        if(!isValidObjectId(productId)) { return res.status(400).send({status: false, message: "Please provide valid productId"})}
        const productCheck = await productModel.findOne({_id:productId, isDeleted:false})
        if(!productCheck){ return res.status(404).send({status: false, message: "productId not found"})} 

        if(!removeProduct){ return res.status(400).send({status: false, message: "removeProduct is required"})}
        if(removeProduct != 0 && removeProduct != 1){ return res.status(400).send({status:false, message: "please input a Number 0 or 1 in removeProduct Key"})}
        if(cartCheck.items.length ==0){ return res.status(400).send({status: false, message: "No product found in items"})}

        if(removeProduct == 0){
            for(let i= 0; i< cartCheck.items.length; i++){
                if(cartCheck.items[i].productId == productId){
                    const ProductPrice = productCheck.price * cartCheck.items[i].quantity
                    const finalprice = cartCheck.totalPrice - ProductPrice
                    cartCheck.items.splice(i,1)
                    const totalItems = cartCheck.totalItems -1 
                    const finalPriceAndUpdate = await cartModel.findOneAndUpdate({userId:userId},{items: cartCheck.items,totalPrice: finalprice, totalItems: totalItems}, {new:true})
                    return res.status(200).send({ status: true, message: "CartData Successfully Updated", data: finalPriceAndUpdate });
                }
            }
        }else if(removeProduct == 1){
            for(let i= 0; i< cartCheck.items.length; i++){
                if(cartCheck.items[i].productId == productId){
                const quantityUpdate = cartCheck.items[i].quantity -1

                    if(quantityUpdate < 1){
                        const ProductPrice = productCheck.price * cartCheck.items[i].quantity
                    const finalprice = cartCheck.totalPrice - ProductPrice
                    cartCheck.items.splice(i,1)
                    const totalItems = cartCheck.totalItems -1 
                    const finalPriceAndUpdate = await cartModel.findOneAndUpdate({userId:userId},{items: cartCheck.items,totalPrice: finalprice, totalItems: totalItems}, {new:true})
                    return res.status(200).send({ status: true, message: "CartData Successfully Updated", data: finalPriceAndUpdate });
                    
                }else{
 
                        const finalprice = cartCheck.totalPrice - productCheck.price
                        const totalItems = cartCheck.totalItems
                        cartCheck.items[i].quantity = quantityUpdate

                        const finalPriceAndUpdate = await cartModel.findOneAndUpdate({userId:userId},{items: cartCheck.items,totalPrice: finalprice, totalItems: totalItems}, {new:true})
                    return res.status(200).send({ status: true, message: "CartData Successfully Updated", data: finalPriceAndUpdate });
                    }
                }
            }

        }


    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}





//..................................GET CART.................................................

const getCart = async function (req, res) {
    try{
    const userId = req.params.userId
    if (!isValidObjectId) { return res.status(400).send({ status: false, message: "Please provide valid userId" }); }

    const cartData = await cartModel.findOne({ userId: userId, isDeleted: false }).select({'items._id':0})
    
    if (!cartData) { return res.status(400).send({ status: false, message: "Cart not found/already deleted" }); }

    return res.status(200).send({ status: true, message: "Success", data: cartData })
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
//........................................DEleteCart...............................................
const deleteCart = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please provide valid userId" }); }

        const cartData = await cartModel.findOne({ userId: userId, isDeleted: false })
        if (!cartData) { return res.status(400).send({ status: false, message: "Cart not found/already deleted" }); }

        const saveData = await cartModel.findOneAndUpdate({ userId: userId}, {$set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })

        return res.status(204).send({ staus: true, message: "Cart successfully deleted", data: saveData })

    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports = {createCart,getCart,deleteCart, updateCart}