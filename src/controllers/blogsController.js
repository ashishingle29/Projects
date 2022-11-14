const blogsModel = require('../models/blogsModel');

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let { authorId } = data
        let ObjectId = require("mongodb").ObjectId
        if (!authorId) {
            return res.status(404).send("Authorid is require")
        } else {
            let yash = ObjectId.isValid(authorId)


            if (!yash) {
                return res.status(404).send("Invalid AuthorID")
            } else {
                let savedData = await blogsModel.create(data)
                res.status(201).send({ msg: savedData })
            }
        }
    }



    catch (err) {
        console.log("It seems an error", err.message);
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


//==============================================================================================================//



const getBlog = async function (req, res) {
    try {
        let queryParams = req.query

        // let byId = queryParams.authorId
        // let category = queryParams.category

        // let Blog= await blogsModel.find({ authorId : byId ,category : category  })
        let Blog= await blogsModel.find({ isDeleted : false , isPublished : true , ...queryParams })
        res.send({msg: Blog})


    }
    catch (err) {
        console.log("It seems an error", err.message);
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




module.exports.getBlog = getBlog

module.exports.createBlog = createBlog
