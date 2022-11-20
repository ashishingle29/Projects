const blogsModel = require("../models/blogsModel");
const authorsModel = require("../models/authorsModel");
const moment = require("moment");
const jwt = require("jsonwebtoken");

//========this is a function it will validate our condition includes undefined,null,string=================================//
let IsVerified = function (value) {
  if (typeof value === undefined || typeof value === null) {
    return false;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return true;
  }
};
//=================it will filter the array content and also validation for array type of string============================//
let IsArr = function (value) {
  if (typeof value === "object") {
    value = value.filter((x) => x.trim());
    if (value.length == 0) return false;
    else return true;
  }
};

//================================================createBlog Api logic Part====================================================//

const createBlog = async function (req, res) {
  try {
    let data = req.body; //getting data from the req body
    //here we are checking that whether data is available or not in req Body
    if (Object.keys(data) == 0)
      return res
        .status(400)
        .send({ status: false, msg: "BAD REQUEST NO DATA PROVIDED" });
    let { authorId, tags, title, category, subcategory, body } = data;

    //checking all the data is given or not
    if (!IsVerified(authorId)) {
      return res.status(400).send({ status: false, msg: "Author is required" });
    }
    const ObjectId = require("mongodb").ObjectId;
    const validId = ObjectId.isValid(authorId);
    if (!validId) {
      return res
        .status(404)
        .send({ status: false, msg: "Invalid AuthorId " });
    }

    let AuthorId = await authorsModel.find({_id:authorId})
    if(AuthorId.length==0){ return res.status(400).send({ status: false, msg: "AuthorId doesn't exist in Database" });}


    if (!IsArr(tags)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Tags is required or It should be in Array",
        });
    }
    if (!IsVerified(category)) {
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });
    }
    if (!IsArr(subcategory)) {
      return res
        .status(400)
        .send({
          status: false,
          msg: "Tags is required or It should be in Array",
        });
    }
    if (!IsVerified(title)) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }
    if (!IsVerified(body)) {
      return res.status(400).send({ status: false, msg: "body is required" });
    }
    if (data.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, msg: "Bad request , Data is required " });
    } else {
      //Blog Successfully Created
      let savedData = await blogsModel.create(data);
      return res.status(201).send({ msg: savedData });
    }
  } catch (err) {
    //its a exception handler part if your logic will not excute by any
    console.log("It seems an error", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};
//==================================================getBlog Api logic Part=========================================================//

const getBlog = async function (req, res) {
  try {
    const queryParams = req.query; //getting data from Query params
    const authId = queryParams.authorId; //get authorID from Query params

    // checking AuthorID is available or not in database
    if (authId) {
      const ObjectId = require("mongodb").ObjectId;
      const validId = ObjectId.isValid(authId);

      //authorId is not valid
      if (!validId) {
        return res
          .status(404)
          .send({ status: false, msg: "Invalid AuthorId " });
      }
    }

    // we are finding the data is available or not in quary params
    const Blog = await blogsModel.find({
      isDeleted: false,
      isPublished: true,
      ...queryParams,
    });

    if (Blog.length == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "Document doesnt exist" });
    }

    if (Blog) {
      return res.status(200).send({ status: true,count:Blog.length, msg: Blog });
    }
  } catch (err) {
    //its a exception handler part if your logic will not excute by any
    console.log("It seems an error", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//=================================================createBlog Api logic Part==========================================//

const updateblog = async function (req, res) {
  try {
    const blogId = req.params.blogId; //get blogID from path params
    const blogdata = req.body; //get blog Data from req body
    let date = moment().format(); //using for date

    // below  part of code will update the blog
    const blogupdate = await blogsModel.updateOne(
      { _id: blogId, isDeleted: false },
      {
        $set: {
          title: blogdata.title,
          body: blogdata.body,
          category: blogdata.category,
          isPublished: blogdata.isPublished,
        },
        $addToSet: { tags: blogdata.tags, subcategory: blogdata.subcategory },
      }
    );

    // below  part of code will provide the published date
    const isPublishedtrue = await blogsModel.updateOne(
      { _id: blogId, isDeleted: false, isPublished: true },
      { $set: { publishedAt: date } }
    );

    //Successfully updated data
    return res
      .status(200)
      .send({ status: true, msg: "Document successfuly Updated"  });
  } catch (err) {
    //its a exception handler part if your logic will not excute by any
    console.log("It seems an error", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//=================================================deleteBlogsByParams========================================================//

const deleteBlogs = async function (req, res) {
  try {
    const blogId = req.params.blogId; //get blogID from path params

    //blog is available or not in our database
    const deleteTrue = await blogsModel.find({ _id: blogId, isDeleted: false });
    if (deleteTrue) {
      const date = moment().format(); //it will print the delete time
      const deletedBlog = await blogsModel.updateMany(
        { _id: blogId, isDeleted: false  },
        { $set: { isDeleted: true, deletedAt: date ,isPublished:false } }
      );
      if (deletedBlog.matchedCount == 0) {
        // it will count the number of deletetion
        return res
          .status(404)
          .send({
            status: false,
            msg: "Document doesnt exist/Document Already Deleted  ",
          });
      }
      //check the condition, if matched then data deleted successfully
      if (deletedBlog) {
        return res
          .status(200)
          .send({ status: true, msg: "Document successfuly Deleted" });
      }
    }
  } catch (err) {
    //its a exception handler part if your logic will not excute by any
    // console.log("This is your blunder mistake:", err.message)
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//=================================================deleteBlogsByQuery=======================================================//

const DeleteBlog = async function (req, res) {
  try {
    let queryParams = req.query;
    

    const date = moment().format(); //FOR DATE
   
    const Token = req.headers["x-api-key"];
    const decodedtoken = jwt.verify(Token, "Secret-Key")
    let id = decodedtoken.authorId

 // is will update the isDeleted value false to true
    const Blog = await blogsModel.updateOne(
      { isDeleted: false, authorId:id, ...queryParams },
      { $set: { isDeleted: true,isPublished:false } }
    );

    //no data available or not
    if (Blog.matchedCount == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "document doesnt exist" });
    }

    //our data is deleted successfully
    if (Blog) {
      return res.status(200).send({ status: true, msg: Blog });
    }
  } catch (err) {
    //its a exception handler part if your logic will not excute by any
    // console.log("It seems an error", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//==========================================================finish=============================================================//

module.exports = { getBlog, createBlog, deleteBlogs, updateblog, DeleteBlog };

// module.exports.getBlog = getBlog

// module.exports.createBlog = createBlog

// module.exports.deleteBlogs = deleteBlogs

// module.exports.updateblog = updateblog

// module.exports.DeleteBlog = DeleteBlog
