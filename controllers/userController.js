const userService = require('../services/userService');
const userValidation = require('../validation/userValidation');
const axios = require('axios');
require('dotenv/config');

const getUsers = async (req, res) => {
    const getUserData = await userService.getUsers();
    return res.status(200).send(getUserData);
};

const getUser = async (req, res) => {
    console.log(req.body);
    const getUserData = await userService.getUser(req.body._id);
    return res.status(200).send(getUserData);
};

const saveUser = async (req, res) => {
    try {
        const validationResult = userValidation.saveValidation(req.body);
        if (validationResult) {
            return res.status(400).send({ message: validationResult.details[0].message })
        }
        const token = req.headers['authorization'];
        const authData = await decodeToken(token.split(' ')[1]);
        req.body.CreatedBy = authData.user._id

        const checkUser = await userService.checkUserAlreadyExists(req.body.UserName);

        if (checkUser === undefined || checkUser === null) {
            const savedUser = await userService.saveUser(req.body)
            return res.status(200).send(savedUser);
        }
        else {
            return res.status(400).send({ message: "The Username is already exists." });
        }
    }
    catch {
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {

    try {
        const validationResult = userValidation.updateValidation(req.body);
        if (validationResult) {
            return res.status(400).send({ message: validationResult.details[0].message })
        }

        const token = req.headers['authorization'];
        const authData = await decodeToken(token.split(' ')[1]);

        req.body.UpdatedBy = authData.user._id

        const updatedUser = await userService.updateUser(req.body);

        return res.status(200).send(updatedUser);
    }
    catch {
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {

    try {
        const validationResult = userValidation.deleteValidation(req.body);
        if (validationResult != null) {
            return res.status(400).send({ message: validationResult.details[0].message })
        }
        const { deletedCount } = await userService.deleteUser(req.body._id)
        if( deletedCount && deletedCount>0) {
            return res.status(200).send({ message: "Deleted Successfully" });
        }
        else {
            return res.status(404).send({ message: "User Doesn't in the system" });
        }
    }
    catch {
        return res.status(500).send({ message: "Internal Server Error" });
    }

};

const authenticateUser = async (req, res) => {

    try {
        const validationResult = userValidation.authenticateValidation(req.body);
        if (validationResult != null) {
            return res.status(400).send({ message: validationResult.details[0].message })
        }
        const user = await userService.authenticateUser(req.body.UserName, req.body.Password);
        if (user != null || user != undefined) {
            let accessAndRefreshToken = await axios.post(process.env.AUTH_SERVICE_URL + "/authenticateUser", user)
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    return res.status(400).send({ messsage: err.message });
                });
            return res.status(200).send(accessAndRefreshToken);
        }
        else {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
    }
    catch {
        return res.status(500).send({ message: "Internal Server Error" });
    }

};

const decodeToken = async (token) => {
    const tokenDetails = {
        "access_token": token
    }
    return await axios.post(process.env.AUTH_SERVICE_URL + "/decodeToken", tokenDetails)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return ({ message: err });
        });
}


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    authenticateUser,
    getUser
};