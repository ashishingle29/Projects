const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const route = require('./router/route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://ashishingle:root@assignment.rkryykd.mongodb.net/BlogProject?retryWrites=true&w=majority", { 
    useNewUrlParser: true})  

.then( () => console.log("MongoDb is Ready for you"))
.catch ( err => console.log(err));

app.use('/', route);



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});