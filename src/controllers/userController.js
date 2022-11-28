const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");

//=============Create User===============
const createUser = async function (req, res) {
    try {
        let user = req.body
        if (Object.keys(user).length == 0) {
            return res.status(400).send({ status: false, message: "please enter user details" })
        }
      const arr=["title","name","phone","email","password"]
      for(let field of arr){
        if (!user[field]) {
            return res.status(400).send({ status: false, message:  `${field} is required`})
        }
      }
        let { title, name, phone, email, password } = user
        // if (!title) {
        //     return res.status(400).send({ status: false, message: "title is required" })
        // }

        if (title != "Mr" && title != "Mrs" && title != "Miss") {
            return res.status(400).send({ status: false, message: "title can only be mr,mrs and miss" })
        }

        // if (!name) {
        //     return res.status(400).send({ status: false, message: "user name is required" })
        // }

        if (!(/^[a-zA-Z ]+$/.test(name))) {
            return res.status(400).send({ status: false, message: "user name should be in alphabets" })
        }

        // if (!phone) {
        //     return res.status(400).send({ status: false, message: "phone number is required" })
        // }

        let checkphone = await userModel.findOne({ phone: user.phone })
        if (checkphone) {
            return res.status(400).send({ status: false, message: "phone number is already taken" })
        }

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "enter valid phone number" })
        }

        // if (!email) {
        //     return res.status(400).send({ status: false, message: "user email is required" })
        // }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: "enter valid user's email" })
        }

        let checkEmail = await userModel.findOne({ email: user.email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "email is already taken" })
        }

        // if (!password) {
        //     return res.status(400).send({ status: false, message: "password is required" })
        // }

        if (!/^[a-zA-Z0-9@]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "password should be between 8 to 15 characters" })
        }
        const userCreated = await userModel.create(user)
        return res.status(201).send({ staus: true, message: "Success", data: userCreated })
    }
    catch (err) {

        return res.status(500).send({ staus: false, message: err })
    }
}

//=====================User Login===================
const createLogin = async function (req, res) {
    try {
        let login = req.body
        if (Object.keys(login).length == 0) {
            return res.status(400).send({ status: false, message: "please enter login details" })
        }
        const email = req.body.email
        const password = req.body.password
        if (!email) {
            return res.status(400).send({ status: false, messsage: "email is required " })
        }

        if (!password) {
            return res.status(400).send({ status: false, messsage: "password is required " })
        }

        const user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(404).send({ status: false, msg: "Email or Password not found" })
        }

        const token = jwt.sign(
            {
                userId: user._id,
             exp:Math.floor(Date.now()/1000)+60*2
            },
            "project3"
        )
        return res.status(200).send({ status: true, token: token })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err })
    }

}
module.exports.createUser = createUser
module.exports.createLogin = createLogin