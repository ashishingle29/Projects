const AWS = require("aws-sdk");
require('dotenv').config()


AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region:"ap-south-1"
})

let uploadFile = async (file) =>{
    return new Promise(function(resolve, reject) {
        let s3 = new AWS.S3({apiVersion: "2006-03-01"});
   
        var uploadParams= {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",  
            Key: "abc/" + file.originalname, 
            Body: file.buffer
        }

        s3.upload(uploadParams,function(err,data){
            if(err){
                return reject({"error":err})
            }

            console.log("File uploaded succesfully")
            return resolve(data.Location)
        }) 
    })
}


module.exports = uploadFile
