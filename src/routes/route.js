const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register',userController.createUser);
router.post('/login',userController.loginUser);
router.get('/user/:userId/profile', userController.getUser);
router.put('/user/:userId/profile', userController.updateUser);

router.all('/*', function(req,res){
  res.status(400).send({status: false, message: "Invalid request"});
})

module.exports = router