const express = require('express');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    try{
        
    const bearerHeader = req.headers['authorization'];

    if(bearerHeader !== undefined){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_PRIVATE_KEY, (err, authData) => {
            if(err){
                res.status(403).send({message:"Invalid Token"});
            }
            else{
                next();
            }
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