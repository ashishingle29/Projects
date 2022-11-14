const express = require('express');
const router= express.Router();
const authorsController = require('../controllers/authorsController')
const blogsController = require('../controllers/blogsController');


router.get('/authors',authorsController.createAuthor)












module.exports=Router