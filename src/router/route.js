const express = require('express');
const router = express.Router();


const authorsController = require('../controllers/authorsController');
const blogsController = require('../controllers/blogsController');





 router.post("/authors" ,authorsController.createAuthor  )

 


 router.post("/blogs" , blogsController.createBlog  )

 router.get("/blogs",  blogsController.getBlog )

// router.put("/blogs/:blogId", blogsController )

// router.delete("/blogs/:blogId", blogsController  )

// router.delete("/blogs", blogsController  )                     // for queryParams















module.exports = router;