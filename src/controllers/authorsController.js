const authorsModel = require('../models/authorsModel');


const createAuthor = async function(req,res){
   try { let data =req.body
    if (Object.keys(data).length !=0){
    let savedData = await authorsModel.create(data)
    res.status(201).send({msg: savedData})

}
else res.status(400).send({msg : "BAD REQUEST"})
   }
   catch(err){
    console.log("It seems an error",err.message);
    res.status(500).send({msg: "Error",error:err.message})
   }
}
module.exports.createAuthor=createAuthor



