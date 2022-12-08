const express=require("express");
const route =require("./router/router.js")
const mongoose=require("mongoose")
const axios = require("axios");

const app=express();

app.use(express.json());
mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://ashishingle:root@assignment.rkryykd.mongodb.net/BlockChain")

.then(()=>console.log("MongoDB is connected"))
.catch((error)=>console.log(error));

app.use("/",route);

app.listen( 3000, function () {
    console.log("Express App Running on Port: 3000");
  });

