const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController')

//......................User.........................

router.post('/register',userController.createUser);
router.post('/login',userController.loginUser);
router.get('/user/:userId/profile', userController.getUser);
router.put('/user/:userId/profile', userController.updateUser);

//......................Product.........................

router.get('/products',productController.getProductBYQuery)
router.get('/products/:productId',productController.getProduct)



router.all('/*', function(req,res){
  res.status(400).send({status: false, message: "Invalid HTTP request"});
})

module.exports = router