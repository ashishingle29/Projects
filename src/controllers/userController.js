const uploadFile = require("../aws/aws");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  validPhone,
  validEmail,
  valid,
  ValidName,
  isValidPincode,
} = require("../validator/validation");

const createUser = async function (req, res) {
    try{
      let data = req.body;
      let file = req.files;
      if (Object.keys(data).length == 0)
        return res
          .status(400)
          .send({ status: false, message: "please give some data" });
  
      const { fname, lname, email, phone,  password, address } = data; //Destructuring
  
      if (!fname)
        return res.status(400).send({ status: false, message: "fname is mandatory" });
      if (!ValidName(fname))
        return res
          .status(400)
          .send({ status: false, message: "fname is invalid" });
  
      if (!lname)
        return res
          .status(400)
          .send({ status: false, message: "lname is mandatory" });
      if (!ValidName(lname))
        return res
          .status(400)
          .send({ status: false, message: "lname is invalid" });
  
      if (!email)
        return res
          .status(400)
          .send({ status: false, message: "email is mandatory" });
      if (!validEmail(email))
        return res
          .status(400)
          .send({ status: false, message: "email is invalid" });
      let findEmail = await userModel.findOne({ email });
      if (findEmail)
        return res.status(400).send({
          status: false,
          message: "user with this email already exists",
        });
  
      if (file && file.length == 0)
        return res
          .status(400)
          .send({ status: false, message: "ProfileImage is a mandatory field" });
  
    
        let url = await uploadFile(file[0]);
        // data["profileImage"] = url;
      
  
      if (!phone)
        return res
          .status(400)
          .send({ status: false, message: "phone is mandatory" });
      if (!validPhone(phone))
        return res
          .status(400)
          .send({ status: false, message: "phone is invalid" });
      let findPhone = await userModel.findOne({ phone });
      if (findPhone)
        return res.status(400).send({
          status: false,
          message: "user with this phone number already exists",
        });
  
      if (!password)
        return res
          .status(400)
          .send({ status: false, message: "password is mandatory" });
      if (!password.length >=8 && password.length <=15)
        return res
          .status(400)
          .send({ status: false, message: "password is invalid (Password Should be Min 8 or Max 15 in length)" });
   //..hashing
            const saltRounds = 10;
            const hash =  bcrypt.hashSync(password,saltRounds)
            // data.password = hash;
      if (!address)
        return res
          .status(400)
          .send({ status: false, message: "Address is required" });
          address = JSON.parse(address)
        if (address) {
            if (address.shipping) {
                if (!valid(address.shipping.street)) {
                  return  res.status(400).send({ status: false, Message: "Please provide street name in shipping address" })
                  
                }
                if (!valid(address.shipping.city)) {
                  return  res.status(400).send({ status: false, Message: "Please provide city name in shipping address" })
                 
                }
                if (!valid(address.shipping.pincode)) {
                  return res.status(400).send({ status: false, Message: "Please provide pincode in shipping address" })
                  
                }
            }
            if (address.billing) {
                if (!valid(address.billing.street)) {
                  return res.status(400).send({ status: false, Message: "Please provide street name in billing address" })
                   
                }
                if (!valid(address.billing.city)) {
                  return  res.status(400).send({ status: false, Message: "Please provide city name in billing address" })
                   
                }
                if (!valid(address.billing.pincode)) {
                  return res.status(400).send({ status: false, Message: "Please provide pincode in billing address" })
                   
                }
            }
        }

    const userData = {
            fname: fname, lname: lname, profileImage: url, email: email,
            phone, password: hash, address: address
        }

      const user = await userModel.create(userData);
      return res.status(201).send({
        status: true,
        message: "user is successfully created",
        data: user });
    
      }
      catch(err){
            return res.status(500).send({ status: false, message: err.message });
    }
}
const userLogin = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, message: "Please enter login details." }); }

        const { email, password } = data

        if (!email) { return res.status(400).send({ status: false, messsage: "Email is required." }); }

        if (!password) { return res.status(400).send({ status: false, messsage: "Password is required." }); }

        const userData = await userModel.findOne({ email: email, password: password })
        if (!userData) { return res.status(404).send({ status: false, message: "Email or Password not found." }); }
        const comparePassword = await bcrypt.compare( password, userData.password)
        if(!comparePassword) return res.status(401).send({ status: false, msg: "Password is incorrect" })

        const token = jwt.sign(
            {
                userId: userData._id,
                iat: new Date().getTime()
            },
            "project5group22", { expiresIn: '1h' }
        )
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: userData._id, token: token } })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const userUpdate = async function (req, res) {
  try {
    const data = req.body;
    const userId = req.params.userId;

    const { address, fname, lname, email, profileImage, phone, password } =
      data;

    const userdata = await userModel.findByIdAndUpdate(
      { userId: userId },
      ...data
    );

    res.status(200).send({ status: true, message: "User profile updated", data: userdata });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};


const getUser = async function (req, res) {
    try {
        const userId = req.params.userId;

        if (!mongoose.isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Please provide a valid user id." }) }

        let user = await userModel.findOne({ _id: userId, isDeleted: false })

        if (!user) { return res.status(404).send({ status: false, message: "user Not Found" }) }

        if (user) {
       return res.status(200).send({ status: true,message: "User profile details", data: user })   
     }
    
    }catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports={createUser,userUpdate,getUser,userLogin}
