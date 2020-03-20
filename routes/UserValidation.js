const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
var router = express.Router();


router.post('/loginValidation', async (req, res) => {
    //Mock User 
    try {
        const user =  {
            _id:"SampleId",
            Firstname: "Balachandran"
        }//await User.findOne({ _id: "5e69da460a1f1e3c8490248b" });
        jwt.sign({ user: user }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' }, (err, token) => {
            res.json({
                token: token
            });
        });
    }
    catch (err) {
        res.sendStatus(501).json("Error in getting the user" + err);
    }

});

module.exports = router;