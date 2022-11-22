const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");


function isValidURL(string) {
    let res = string.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
    return (res !== null) ? true : false
};


const createCollege = async function (req, res) {
    try {
        const data = req.body;
        if (Object.keys(data).length == 0) {return res.status(400).send({ status: false, message: "Please Provided Data" }) }

        let { name, fullName, logoLink } = data;

        if (!name) {return res.status(400).send({ status: false, message: "Please Enter Name" }) }
        if (!fullName) {return res.status(400).send({ status: false, message: "Please Enter fullName" }) }
        if (!logoLink) {return res.status(400).send({ status: false, message: "Please Enter logoLink" }) }

        function isValidname(firstname) {return (typeof firstname !== "string" || /^[a-zA-Z]+$/.test(firstname)) ? true : false }

        if (!isValidname(name)) {return res.status(400).send({ status: false, message: "Please enter a valid name" }) }
        data.name = name.toLowerCase()
        

        let dataByName = await collegeModel.findOne({ name: name })
        if (dataByName) {return res.status(400).send({ status: false, message: "This College alredy exits" }) }

        if (typeof (fullName) != "string") {return res.status(400).send({ status: false, message: "Please enter a valid fullName" }) }

        if (!isValidURL(logoLink)) {return res.status(400).send({ status: false, message: "Please enter a valid logo Link" }) }

        const result = await collegeModel.create(data);
        return res.status(201).send({ status: true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




const getColleges = async (req, res) => {

    try {
        let data = req.query.collegeName
        if (!data) { return res.status(400).send({ status: false, message: "Please enter college name in URL" }) }
        data = data.toLowerCase() 

        let collegeData = await collegeModel.findOne({ name: data, isDeleted: false }).select({ isDeleted: 0, __v: 0 }).lean()
        if (!collegeData) { return res.status(404).send({ status: false, message: "College not found by this name" }) }

        let internData = await internModel.find({ collegeId: collegeData._id, isDeleted: false }).select({ collegeId: 0, isDeleted: 0, __v: 0 })
        if (internData.length == 0) { internData = "No intern found" }

        collegeData.interns = internData;
        delete collegeData._id

        res.status(200).send({status:true, data:collegeData})

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}






module.exports = { createCollege, getColleges }
