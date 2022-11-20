const { isValidObjectId } = require("mongoose");
const blogModel = require("../models/blogModel");




//-----Create Blog API-----

const createBlog = async function (req, res) {

    try {
        let data = req.body;
        
        if(Object.keys(data).length==0){return res.status(400).send({status:false, msg: "Please enter detials to create blog"})};

        let { title, body, authorId, tags, category, subcategory } = data;

        if (!title) { return res.status(400).send({ status: false, msg: "Please enter title" }) };
        if (!body) { return res.status(400).send({ status: false, msg: "Please enter body" }) };
        if (!authorId) { return res.status(400).send({ status: false, msg: "Please enter authorId" }) };
        if (!tags) { return res.status(400).send({ status: false, msg: "Please enter tags" }) };
        if (!category) { return res.status(400).send({ status: false, msg: "Please enter category" }) };
        if (!subcategory) { return res.status(400).send({ status: false, msg: "Please enter subcategory" }) };

        if (!isValidObjectId(authorId)) { return res.status(400).send({ status: false, msg: "Please enter valid authorId" }) };
       
        if(typeof(tags)!="object" || typeof(subcategory)!="object"){return res.status(400).send({status:false, msg:"Please enter tags and subcategory values in Array"})};

        if(data.isPublished==true){data.publishedAt=new Date().toLocaleString()}
        if(data.isDeleted==true){data.deletedAt = new Date().toLocaleString()}

        let result = await blogModel.create(data);
        res.status(201).send({ status: true, data: result });

    } catch (err) {
        res.status(500).send({status:false, msg:err.message});
    }

}



//----- API to fetch the blogs -----

const getBlogs = async function (req, res) {

    try {
        let data = req.query;  
        data.isDeleted = false;
        data.isPublished = true;

        let id = req.query.authorId;
        if (id) {
            if (!isValidObjectId(id)) { return res.status(400).send({ status: false, msg: "Please enter valid authorId" }) };
        }

        let result = await blogModel.find(data).populate("authorId");

        if(result.length == 0){return res.status(404).send({status: false, msg: "Blog not found"})}
        else{
            res.status(200).send({ status: true, data: result });
        };

    } catch (err) {
        res.status(500).send({status:false, msg:err.message});
    }
}


//-----API to Update the fields of any Blog------

const updateBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "Please enter valid blog Id" }) }

        let data = req.body;
        let { title, body, tags, category, subcategory } = data

        let obj1 = {}
        let obj2 = {}
        if (title) { obj1.title = title }
        if (body) { obj1.body = body }
        if (category) { obj1.category = category }
        obj1.isPublished = true
        obj1.publishedAt = new Date().toLocaleString()

        if (tags) { obj2.tags = tags}
        if (subcategory) { obj2.subcategory = subcategory }

        let blogData = await blogModel.findById({_id : blogId})
        if(blogData.isDeleted == true){return res.status(400).send({status:false, msg:"This Blog is Deleted"})}
        else{
            let result = await blogModel.findByIdAndUpdate({ _id: blogId },{ $set: obj1, $push: obj2}, { new: true })
            res.status(200).send({ status: true, data: result })
        }
    } catch (err) {
        res.status(500).send({status:false, msg:err.message})
    }
}


//-------API to delete a blog by using blogId---------

const deleteBlog = async function (req, res) {

    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) { return res.status(400).send({ status: false, msg: "Please enter a valid blogId" }) }

        let dataUpdate = {
            isDeleted: true,
            deletedAt: new Date().toLocaleString()
        }
        let blogData = await blogModel.findById({_id : blogId})
        if(blogData.isDeleted == true){return res.status(400).send({status:false, msg:"Blog is already Deleted"})}

        await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: dataUpdate })
        res.status(200).send({ status: true, msg: "Deleted"})

    } catch (err) {
        res.status(500).send({status:false, msg:err.message})
    }
}


//-------API to delete a Blog by any field--------

const deleteByField = async function (req, res) {

    try {
        let data = req.query 
        if (Object.keys(data).length == 0) {return res.status(400).send("Please enter at least one attributes in url") }

        let result = await blogModel.find(data)
        if (result.length==0) { return res.status(404).send({ status: false, msg: "Blog not found" }) }
        
        for (let i = 0; i<result.length; i++) {

            if (result[i].authorId == req.decode.authorId) {

                await blogModel.findByIdAndUpdate({_id:result[i]._id}, {$set:{isDeleted:true, deletedAt: new Date().toLocaleString()}})

                return res.status(200).send({status:true, msg:"Deleted"})
            }
        }
        return res.status(403).send({ status: false, msg: "Authorization failed" })

    } catch (err) {
        res.status(500).send({status:false, msg:err.message})
    }
}


module.exports = { createBlog, getBlogs, updateBlog, deleteBlog, deleteByField }