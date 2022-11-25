const express = require("express")
const mongoose = require("mongoose")
const route = require("./route/route")
const app = express()

app.use(express.json())


app.use("/", route)

mongoose.connect("mongodb+srv://ashishingle:root@assignment.rkryykd.mongodb.net/group16Database?retryWrites=true&w=majority",{
    useNewUrlParser : true
}).then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

app.listen(3000, ()=>{
    console.log("server running on port ", 3000)
})
