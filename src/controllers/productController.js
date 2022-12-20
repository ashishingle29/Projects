const { isValidObjectId } = require('mongoose');
const uploadFile = require("../aws/aws");
const productModel = require("../models/productModel");
const { validName, validImg, priceVerify} = require("../validator/validation");

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CREATE_PRODUCT>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const createproduct = async function (req, res) {
    try {
        let data = req.body;
        let file = req.files;

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please give some data" }); }
    
        let { title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments} = data;
    
        if (!title) { return res.status(400).send({ status: false, message: "Title is mandatory" }); }
        if (!validName(title)) { return res.status(400).send({ status: false, message: "Title should be in alphabets only" }); }
        let findtitle = await productModel.findOne({ title });
        if (findtitle) { return res.status(400).send({ status: false, message: " this title already exists" }); }
       
    
        if (!description) { return res.status(400).send({ status: false, message: "description is mandatory" }); }
        if (!validName(description)) { return res.status(400).send({ status: false, message: "description should be in alphabets only" }); }

        if (!price) { return res.status(400).send({ status: false, message: "Price is mandatory" }); }
        if (!/^[0-9]*$/.test(price)) {
            return res.status(400).send({ status: false, message: "Price should be in Number" });
        }

        if (!currencyId) { return res.status(400).send({ status: false, message: "currencyId is mandatory"});}
        if (currencyId && currencyId != "INR") {
            return res.status(400).send({status: false,message: "Only 'INR' CurrencyId is allowed"});
          }

          if (currencyFormat && currencyFormat != "₹") {
            return res.status(400).send({status: false,message: "Only '₹' Currency Symbol is allowed"});
          }

        if (file && file.length == 0) { return res.status(400).send({ status: false, message: "productImage is a mandatory" }); }
        if (!validImg(file.originalname)) { return res.status(400).send({ status: false, message: "Please provide image in gif|png|jpg|jpeg|webp|svg|psd|bmp|tif|jfif" }); }
        
        let url = await uploadFile(file[0]);
        data.productImage=url
        if (!validName(style)) { return res.status(400).send({ status: false, message: "style should be in alphabets only" }); }
       
        if (!availableSizes) { return res.status(400).send({ status: false, message: "availableSizes is mandatory" }); }

        if (availableSizes !== "S" && availableSizes !== "XS" && availableSizes !== "M" && availableSizes !== "X"&& availableSizes !== "L"  && availableSizes !== "XXL" && availableSizes !== "XL") {
        
            return res.status(400).send({ status: false, message: " availableSizes should be in S/XS/M/X/L/XXL/XL" });
          }
        if(installments){
          if (!/^[0-9]*$/.test(installments)) {
            return res.status(400).send({ status: false, message: "installments should be in Number" });
        }
    }
   let createdproduct = await productModel.create(data)
       return res.status(201).send({ status: true, message: "Success", data: createdproduct })

   }
   catch (err) {
       return res.status(500).send({ status: false, message: err.message })
   }
}
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

module.exports ={getProduct,getProductBYQuery,createproduct}

//line no. 25 if (!/^[0-9]*$/.test(price)) {
            // return res.status(400).send({ status: false, message: "Price should be in Number" });

            // valid img validation name
            //validations in get api
            //trim in model
            
            
        // }