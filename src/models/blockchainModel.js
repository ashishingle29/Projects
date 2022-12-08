const mongoose = require('mongoose');

const BlockChainSchema = new mongoose.Schema({
    "symbol": {                 // String and Unique
        type: String,
        unique: true
    },     
    "name": {                   // String and Unique
        type: String,
        unique: true
    },     
    "marketCapUsd": {           // String  ( not Number)
        type: String,
        unique: true
    },     
    "priceUsd": {               //String
        type: String,
        unique: true
    }       
})


module.exports = mongoose.model('CryptoBlockChain', BlockChainSchema)