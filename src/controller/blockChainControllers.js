const axios = require("axios");
const blockchainModel = require("../models/blockchainModel");




const getblockChain = async function (req, res) {
    try {

    
        const webapi = {
            method: "GET",
            url: 'https://api.coincap.io/v2/assets/',
            headers: { Authorization: "Bearer bbc0f20f-3687-48d0-9018-f41ba033995b" }
        }

        let result = await axios(webapi)
        
        console.log(result)
        data = result.data.data
        
        //sort according to growth
        const sortdata = data.sort((a, b) => { return a.changePercent24Hr - b.changePercent24Hr });
        
        // delete old data
        await blockchainModel.deleteMany()
        
        // recreate create data
        const finaldata = await blockchainModel.create(sortdata)
        
        final = await blockchainModel.find().select({__v:0, _id:0})

        res.status(200).send({ status: true, data: final })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { getblockChain }
