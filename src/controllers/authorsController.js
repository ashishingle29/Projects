const AuthorModel = require("../models/authorsModel");
const jwt = require("jsonwebtoken");

//this is validator to validate the below data
const IsVerified = function (value) {
  if (typeof value === undefined || typeof value === null) {
    return false;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return true;
  }
};
//=======================================================createAuthor============================================================//
const createAuthor = async function (req, res) {
  try {
    const data = req.body;

    //here we are checking that whether data is available or not in req body
    if (Object.keys(data) == 0)
      return res
        .status(400)
        .send({ status: false, msg: "BAD REQUEST NO DATA PROVIDED" });
    const { fname, lname, title, email, password } = data;

    //condition for first name
    if (!IsVerified(fname)) {
      return res
        .status(400)
        .send({ status: false, msg: "First name is required" });
    }

    //condition for last name
    if (!IsVerified(lname)) {
      return res
        .status(400)
        .send({ status: false, msg: "Last name is required" });
    }

    //condition for title
    if (!IsVerified(title)) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }

    //title should be Mr,Miss,Mrs
    if (!(title == "Mr" || title == "Miss" || title == "Mrs")) {
      return res
        .status(400)
        .send({
          status: false,
          message: "please provide valid title ( Mr , Mrs or Miss)",
        });
    }

    // whether email is valid or not and also should be present in database
    if (!IsVerified(email)) {
      return res.status(400).send({ status: false, msg: "Email is required" });
    }

    // regex helps us to validate the email and test the email combination
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid email" });
    }

    //it will find that email is already available in our database or not
    const emailMatch = await AuthorModel.findOne({ email });
    if (emailMatch)
      return res
        .status(400)
        .send({
          status: false,
          message:
            "This email is already in use,please provide another email or login",
        });

    //it will check that password is given or not
    if (!IsVerified(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });
    }

    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid password" });
    }
    const savedData = await AuthorModel.create(data);
    return res.status(201).send({ msg: savedData });
  } catch (error) {
    //its a exception handler part if your logic will not excute by any
    console.log(error);
    return res.status(500).send({ msg: error.message });
  }
};

//===================================================authorsLogin=============================================================//
const authorslogin = async function (req, res) {
  try {
    const mail = req.body.email; // here we are taking email,password from our postman body
    const pass = req.body.password;
    const data = req.body;

    //here we are checking that whether data is available or not in object
    if (Object.keys(data) == 0)
      return res.status(400).send({ status: false, msg: "No input provided" });

    // whether email is given or not
    if (!IsVerified(mail)) {
      return res.status(400).send({ status: false, msg: "Email is required" });
    }

    // whether password is given or not
    if (!IsVerified(pass)) {
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });
    }

    //it will match the email from author model
    const userMatch = await AuthorModel.findOne({ email: mail });
    if (!userMatch)
      return res.status(400).send({ status: false, msg: "Email is incorrect" });

    //it will match the password from author model
    const userMatch2 = await AuthorModel.findOne({ password: pass });
    if (!userMatch2)
      return res
        .status(400)
        .send({ status: false, msg: "Password is incorrect" });

    //it will generate the by the help of object Id
    const token = jwt.sign(
      {
        authorId: userMatch._id.toString(),
        expiresIn: "1h",
      },
      "Secret-Key"
    );
    // this is for set the header in postman headers section
    res.setHeader("x-api-key", token);
    return res
      .status(200)
      .send({ status: true, msg: "You are successfully logged in", token });
  } catch (error) {
    //its a exception handler part if your logic will not excute by any
    console.log(error);
    return res.status(500).send({ msg: error.message });
  }
};

module.exports = { createAuthor, authorslogin };

// module.exports.createAuthor = createAuthor
// module.exports.authorslogin = authorslogin
