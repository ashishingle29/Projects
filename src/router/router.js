const express = require("express")
const router = express.Router()
const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")
const middleware = require("../middleware/authMiddleware")

router.post("/authors",authorController.createAuthor)

router.post("/blogs", middleware.authentication, blogController.createBlog)

router.get("/blogs", middleware.authentication,  blogController.getBlogs)

router.put("/blogs/:blogId", middleware.authentication, middleware.authorization,  blogController.updateBlog)

router.delete("/blogs/:blogId", middleware.authentication, middleware.authorization, blogController.deleteBlog)

router.delete("/blogs", middleware.authentication,  blogController.deleteByField)

router.post("/login", authorController.authorLogin)


module.exports = router;