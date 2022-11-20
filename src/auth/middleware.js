const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");

//=====================Authantication============================//
const midd1 = async function (req, res, next) {
  try {
    const Token = req.headers["x-api-key"]; //getting the token from Header


    // checking token must be present or not in header
    if (!Token)
      return res
        .status(404)
        .send({ status: false, msg: "token must be present" });          
    jwt.verify(Token, "Secret-Key", (error, decodedtoken) => {           //call back
      if (error)
        return res.status(401).send({ status: false, msg: "token is invalid" });
      else {
        req.decodedtoken = decodedtoken;           // req globel oject 
        return next();
      }
    });
  } catch (err) {
    //its a exception handler part if your logic will not excute by any condition
    return res.status(500).send({ msg: err.message });
  }
};

//=================================Authorization=================================//

const authorisation = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"]; //getting the token from Header
    const decodedtoken = jwt.verify(token, "Secret-Key"); //decode token/verify

    let toBeupdatedblogId = req.params.blogId; //getting blogId from path params for validation
    const toauthorid = req.query.authorId; //getting authorId from Query params for validation
    const to_id = req.query._id; //getting blogId from Query params for validation

    //check validation for author id
    if (toauthorid) {
      const ObjectId = require("mongodb").ObjectId;
      const validId = ObjectId.isValid(toauthorid);

      //invalid Author Id
      if (!validId) {
        return res
          .status(404)
          .send({ status: false, msg: "Invalid authorId " });
      }
    }
    //........................Check validation for BlogId by Query params .............................................//

    if (to_id) {
      const ObjectId = require("mongodb").ObjectId;
      const validId = ObjectId.isValid(to_id);
      //invalid BlogId
      if (!validId) {
        return res
          .status(404)
          .send({ status: false, msg: "Invalid Objectid " });
      }
    }

    //........................Check validation for BlogId by Path params .......................................//

    if (toBeupdatedblogId) {
      const ObjectId = require("mongodb").ObjectId;
      const validId = ObjectId.isValid(toBeupdatedblogId);
      //invalid BlogId
      if (!validId) {
        return res.status(404).send({ status: false, msg: "Invalid BlogId" });
      }
    }
    //............................User Authorised or not ...............................................//

    if (toBeupdatedblogId) {
      const updatingAuthorId = await blogsModel
        .find({ _id: toBeupdatedblogId })
        .select({ authorId: 1, _id: 0 });
      const authorsId = updatingAuthorId.map((x) => x.authorId);
      const id = decodedtoken.authorId;
      if (id != authorsId)
        return res
          .status(403)
          .send({
            status: false,
            msg: "You are not authorised to perform this task 1",
          });
    } else {
      let AuthorId = req.query.authorId; //getting authorId from Query Parama
      toBeupdatedblogId = AuthorId;
      let id = decodedtoken.authorId; //getting authorId by token

      //for Filterout all data given in Query Parama by using rest Operator/Destructure
      let queryParams = req.query; //getting data from Quary params
      const log = await blogsModel.findOne({ authorId: id, ...queryParams });
      if (log) {
        //for pass the next function
        return next();
      }
      //checking the token data
      if (id != AuthorId)
        return res
          .status(403)
          .send({
            status: false,
            msg: "You are not authorised to perform this task 2",
          });
    }
    next();
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//==========================Exporting Functions======================//
module.exports.authorisation = authorisation;
module.exports.midd1 = midd1;
