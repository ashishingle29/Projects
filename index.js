const express = require("express")
const mongoose = require("mongoose")
const app = express()

app.use(express.json())


app.use("/", route)

mongoose.connect("mongodb+srv://amanprajapat82780:Lucky82780@newproject.3qdy8y3.mongodb.net/group16Database?retryWrites=true&w=majority",{
    useNewUrlParser : true
}).then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

app.listen(3000, ()=>{
    console.log("server running on port ", 3000)
})