const express = require('express');
const router = express.Router();



const authorsController = require('../controllers/authorsController');
const blogsController = require('../controllers/blogsController');
const authMidd = require('../auth/middleware');
const blogsModel = require('../models/blogsModel');

const deleteblog = async function (req , res){
    let queryParams = req.query

    const blog = await blogsModel.updateMany({isDeleted:false ,isPublished:true , ...queryParams},{$set:{isDeleted:true}})
    
    return res.status(200).send({status : true , msg:blog})
}





 router.post("/authors" ,authorsController.createAuthor  )

 


 router.post("/blogs" , authMidd.midd1 , blogsController.createBlog  )       // midd1




 router.get("/blogs", authMidd.midd1, blogsController.getBlog )





 router.put("/blogs/:blogId",authMidd.midd1,authMidd.authorisation, blogsController.updateblog )




 router.delete("/blogs/:blogId",authMidd.midd1,authMidd.authorisation, blogsController.deleteBlogs  )


 

 router.delete("/blogs",authMidd.midd1,authMidd.authorisation, blogsController.DeleteBlog)           // for queryParams


//==============================for login==========================================//

 router.post("/login" ,authorsController.authorslogin  )














module.exports = router;