const internModel = require('../models/internModel')
const collgeModel = require("../models/collegeModel")


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    return re.test(email);
}



const createIntern = async function (req, res) {
    try {
        let data = req.body
        if(Object.keys(data).length==0){res.status(400).send({status:false, message: "Please Provided Data"})}


        let {name, email, mobile, collegeName} = data;

        if(!name){res.status(400).send({status:false, message: "Please Enter name"})}
        if(!email){res.status(400).send({status:false, message: "Please Enter email"})}
        if(!mobile){res.status(400).send({status:false, message: "Please Enter mobile"})}
        if(!collegeName){res.status(400).send({status:false, message: "Please Enter collegeName"})}

        let checkName = name.match(/[0-9]/)
        if(checkName || typeof(name) != "string"){ return res.status(400).send({status:false, message:"Please enter a valid name"})}       
        
        function upperCase(string){return string.replace(string[0], string[0].toUpperCase())}
        data.fname = upperCase(name) 
      
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "Please enter a valid Email" }) }
        
        let internData = await internModel.find({email:email})
        if(internData.length != 0){return res.status(400).send({status:false, message:"Email already exits please enter another email"})}
       
        if(mobile.length != 10 || typeof(mobile) !="string" ){return res.send({status:false, message:"Please enter a valid mobile number"})}
        
        let dataByMobile = await internModel.find({mobile:mobile})
        if(dataByMobile.length != 0){return res.status(400).send({status:false, message:"Mobile number already exits, please enter another mobile number"})}
       
        collegeName = collegeName.toLowerCase()

        let dataByCollege = await collgeModel.findOne({name: collegeName})
        if(!dataByCollege){return res.status(400).send({status:false, message:"there is no intern with this college name"})} 

        data.collegeId = dataByCollege._id       
       
        let result = await internModel.create(data)
        res.status(201).send({status: true, data: result})


    } catch (error) {
        res.status(500).send({status: false, msg: error.message})
    }
}

module.exports = {createIntern}
