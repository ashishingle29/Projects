const { isValidObjectId } = require('mongoose');
const {validName} = require('../validator/validation')
const produtModel = require('../models/productModel');

//.......................................GET_BY_QUERY...................................................


const  getProductBYQuery = async (req,res) =>{
    try{
   
         const data = req.query
         
         let{size,name,priceGreaterThan,priceLessThan}=data;
         const filterQuery = {isDeleted:false}

         if(size){
            size = size.toUpperCase()
            if(size!="S" && size!="XS" && size!="M" && size!="X" && size!="L" && size!="XXL" && size!="XL"){
                return res.status(400).send({status:false,message:"Size is only accept in S, XS, M, X, L, XXL, XL"})
            }
            filterQuery.availableSizes = size
         }
         if(name){
            if(!validName(name)){
                return res.status(400).send({status:false,message:"name is only in alphabet"})
        }
            filterQuery.title = name
         }
         if(priceGreaterThan){
            filterQuery.price = {$gt:priceGreaterThan}
         }
         if(priceLessThan){
            filterQuery.price = {$lt:priceLessThan}
         }

         const productData = await produtModel.find(filterQuery).sort({price:1})
         if (productData.length == 0)
            return res.status(404).send({ status: false, message: "No product found" });

        return res.status(200).send({status:true,message:"product list",data:productData})

    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

//.........................................GET_BY_PARAMS.................................................

const getProduct = async (req,res) =>{
    try{
    const productId = req.params.productId
    if(!isValidObjectId(productId)){
        return res.status(400).send({status:false,message:"Please Provide Valid Product Id"})
    }

    const productData = await produtModel.findOne({_id:productId,isDeleted:false})
    if(!productData){
        return res.status(404).send({status:false,message:"Product Data not Found"})
    }

    return res.status(200).send({ status: true, message: 'Product list', data: productData });
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

module.exports ={getProduct,getProductBYQuery}