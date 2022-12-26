const { isValidObjectId } = require('mongoose');
const cartModel = require('../models/cartModel')
const orderModel  = require('../models/orderModel')



//......................Create Order.........................

const createOrder = async function(req,res){
    try{
        const userId = req.params.userId        
        const data = req.body
        if(Object.keys(data).length == 0) return res.status(400).send({status:false,message:"Please Provide Some Data for create an Order"})
        
        const {cartId} = data
        if(!isValidObjectId(cartId)){return res.status(400).send({staus: false, message: "Please provide a valid cartId"});}

        const cartCheck = await cartModel.findOne({userId: userId, _id:cartId})
        if(!cartCheck){return res.status(400).send({staus: false, message: "Cart not found"});}
        if(cartCheck.items.length ==0){ return res.status(400).send({status: false, message: "No product found in items"})}

        let totalQuantity = 0
        for(let i=0; i< cartCheck.items.length; i++){
            totalQuantity = totalQuantity+ cartCheck.items[i].quantity
        }

        const obj= {
            userId:userId,
            items: cartCheck.items,
            totalPrice: cartCheck.totalPrice,
            totalItems: cartCheck.totalItems,
            totalQuantity:totalQuantity,
        }

        const order = await orderModel.create(obj)
        await cartModel.findOneAndUpdate({ userId: userId}, {$set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true })

        res.status(201).send({status: true, message:"Success", data:order })
    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}

//.....................Update Order..........................
const UpdateOrder = async function(req,res){
    try{
     const userId = req.params.userId;
     if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Please Provide Valid User Id"})
     }
     
     const data = req.body
      const {orderId,status} = data

      if (Object.keys(data).length == 0 ) { return res.status(400).send({ status: false, message: "Please give some data" }); }
  
       const UpdateObj = {}
       if(!orderId){
        return res.status(400).send({status:false,message:"OrderId is required in body"})
       }
       if(!isValidObjectId(orderId)){
        return res.status(400).send({status:false,message:"Please Provide Valid orderId"})
     }

      const findOrder = await orderModel.findOne({_id:orderId,isDeleted:false})
      if(!findOrder){
        return res.status(404).send({status:false,message:"order not Exist with this OrderId"})
      }
 
       if(!status){
        return res.status(400).send({status:false,message:"status is required in body"})
       }

       if(status != "completed" && status !="canceled"){
        return res.status(400).send({status:false,message:"status is only accepted in Completed or canceled"})
       }


       UpdateObj.status = status

       if(findOrder.status == "completed" || findOrder.status == "canceled"){
        return res.status(400).send({status:false,message:"Your order Status is Already Updated. Now You can't change"})
    }
    


     if(findOrder.cancellable == false){
        return res.status(400).send({ status: false, message: "this Order is not  Provide cancellable Policy" });
     }      
     let updateData = await orderModel.findOneAndUpdate({ _id: orderId },{ $set: UpdateObj },{ new: true });
  
      return res.status(200).send({ status: true, message: "Success", data: updateData });

    }catch(error){
        res.status(500).send({status:false, message:error.message})
    }
}

module.exports = {createOrder,UpdateOrder}