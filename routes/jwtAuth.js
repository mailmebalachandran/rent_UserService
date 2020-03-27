const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyToken = async (req, res, next) =>{
    try{
        
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader !== undefined){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const tokenDetails = {
            "access_token" : bearerToken
        }
        await axios.post(process.env.AUTH_SERVICE_URL + "api/authService/verifyToken", tokenDetails)
        .then((res) =>{
           next();
        })
        .catch((err) => {
            return res.status(400).send({messsage: err.message});
        });
        
    }
    else{
        res.status(403).send({message: "Authentication failed"});
    }
}
catch(err){
    res.status(401).send({message:"Exception is "+ err})
}
}

module.exports = verifyToken;