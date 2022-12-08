const express = require('express');
const axios = require("axios");
const blockChainControllers = require('../controller/blockChainControllers')
const router = express.Router();

router.get('/assets', blockChainControllers.getblockChain)



router.all('/*',function (req,res){
    res.status(400).send({status:false, message: 'Invalid HTTP Request'})
})

module.exports = router