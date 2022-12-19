const jwt = require("jsonwebtoken");

//-------------------------------[ AUTHENTICATION ]--------------------------------//

const authentication = async function(req,res){
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
          return res.status(400).send({ status: false, message: "Token must be present." });
        }
    
        jwt.verify(token, 'project3group18', function (error, decoded) { //callback function
    
          if (error) {
            return res.status(401).send({ status: false, message: error.message });
          }
          else {
            req.decodedToken = decoded
            Next()
          }
        })
      } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
      }
    
    }
}