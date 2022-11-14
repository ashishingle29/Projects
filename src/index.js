const express = require('express'); 
const {default : mongoose} = require('mongoose'); 
const bodyParser = require('body-parser'); 
const route = require('./router/route'); 
 
const app = express() 
 
 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
 
 
mongoose.connect("mongodb+srv://ashishingle:root@assignment.rkryykd.mongodb.net/BlogProject?retryWrites=true&w=majority", { useNewUrlParser: true}) 
.then(() => console.log("MongoDb Is Ready To Boom")) 
.catch(err => console.log(err)); 
 
app.use('/', route); 
 
app.listen(process.env.PORT || 3000, function(){ 
    console.log('Express app running on port ' + (process.env.PORT || 3000 )) 
});