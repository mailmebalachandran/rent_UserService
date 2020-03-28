const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyToken = async (req, res, next) => {
    try {

        const bearerHeader = req.headers['authorization'];
        if (bearerHeader !== undefined) {
            const tokenDetails = {
                "access_token": bearerHeader.split(' ')[1]
            }
            await axios.post(process.env.AUTH_SERVICE_URL + "/verifyToken", tokenDetails)
                .then((res) => {
                    next();
                })
                .catch((err) => {
                    return res.status(401).send({ messsage: "Unauthorized: " + err.response.data.message });
                });

        }
        else {
            res.status(403).send({ message: "Forbidden No Token" });
        }
    }
    catch (err) {
        res.status(401).send({ message: "Exception In JWT:" + err })
    }
}

module.exports = verifyToken;