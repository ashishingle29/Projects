const express = require("express")
const router = express.Router()
const collegeController = require("../controller/collegeController")
const internController = require("../controller/internController")

router.post("/functionup/colleges", collegeController.createCollege )

router.post("/functionup/interns", internController.createIntern)

router.get("/functionup/collegeDetails",collegeController.getColleges)

router.all("/**", (req, res)=>{
    return res.status(400).send({status:false, message:"check your URL"})
})

module.exports = router