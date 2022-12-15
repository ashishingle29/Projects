const urlModel = require("../model/urlModel")
const shortid = require('shortid');
const axios = require("axios")
const redis = require('redis')
const { promisify } = require('util')


//=================validation===========================//

const valid = function (value) {
    if (typeof value == "undefined" || typeof value == null) {
        return false;
    }
    if (typeof value == "string" && value.trim().length == 0) {
        return false;
    }
    return true;
};

//---------Validation for URL---------------

function isValidURL(url) {
    let res = url.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
    return (res !== null) ? true : false
};

//========================[Apply redis and connect]================

const redisConnect = redis.createClient(
    14652,
    "redis-14652.c299.asia-northeast1-1.gce.cloud.redislabs.com",
    { no_ready_check: true }
);

redisConnect.auth("uMq15mB5TBzteVVvb4sAZEIhrtHbe3Sp", function (err) {
    if (err) throw err;
});

redisConnect.on("connect", async function () {
    console.log("Redis is Connected...");
});


const GET_ASYNC = promisify(redisConnect.GET).bind(redisConnect);
const SET_ASYNC = promisify(redisConnect.SETEX).bind(redisConnect);



//========================[Function for Create Shorten URL]==========================//

const urlShort = async (req, res) => {
    try {
        const data = req.body
        const longUrl = data.longUrl.trim();

        //========================================================

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Body can't be empty" })
        if (Object.keys(data).length > 1) return res.status(400).send({ status: false, message: "Please Provide Only Long URL" })

        if (!longUrl) return res.status(400).send({ status: false, message: "longUrl is required" })
        if (!valid(longUrl)) return res.status(400).send({ status: false, message: "You cannot enter empty string" })

        if (!isValidURL(longUrl)) return res.status(400).send({ status: false, message: "Please Provide Long Url in Currect Formet" })

        //======for validating url using axios
        let option = {
            method: 'get',
            url: longUrl
        }
        let validateUrl = await axios(option)
            .then(() => longUrl)
            .catch(() => null)

        if (!validateUrl) { return res.status(400).send({ status: false, message: `This Link: ${longUrl} is not Valid URL.` }) }


        // =======================Get from redis=======================
        let cachedData = await GET_ASYNC(`${longUrl}`)

        if (cachedData) {
            let parseData = JSON.parse(cachedData)
            return res.status(200).send({ status: true, data: parseData })
        }

        let shortUrlId = shortid.generate().toLowerCase();
        let baseUrl = "http://localhost:3000/"
        let obj = {
            "urlCode": shortUrlId,
            "longUrl": longUrl,
            "shortUrl": baseUrl + shortUrlId
        }

        let findData = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, __v: 0 })

        if (findData) {
            await SET_ASYNC(`${longUrl}`, 1 * 60 * 60, JSON.stringify(obj))
            return res.status(200).send({ status: true, data: findData })
        }
        await urlModel.create(obj);

        //================= create in redis===================
        await SET_ASYNC(`${longUrl}`, 1 * 60 * 60, JSON.stringify(obj))
        return res.status(201).send({ status: true, data: obj })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//==============================[Function to Fetch the URL Data from DB]=========================================//

let getData = async (req, res) => {
    try {

        let urlCode = req.params.urlCode

        if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Please provide a valid URL code" })

        let findLongUrl = await urlModel.findOne({ urlCode: urlCode });
        if (!findLongUrl) return res.status(404).send({ status: false, message: "Url code not found" })

        let cachedData = await GET_ASYNC(`${findLongUrl.longUrl}`)

        if (cachedData) {
            let parseData = JSON.parse(cachedData)
            return res.status(302).redirect(parseData.longUrl)

        } else {

            await SET_ASYNC(`${findLongUrl.longUrl}`, 1 * 60 * 60, JSON.stringify(findLongUrl))
            return res.status(302).redirect(findLongUrl.longUrl)
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}



module.exports = { urlShort, getData }