const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const userValidation = require('../validation/userValidation');
const asyncMiddleware = require('../common/asyncMiddleware');

const getUsers = async (req, res) => {
        const getUserData = await userService.getUsers();
        return res.status(200).send(getUserData);
};

const saveUser = async (req, res) => {
        const validationResult = userValidation.saveValidation(req.body);
        if(validationResult){
            return res.status(400).send({message:validationResult.details[0].message})
        }
        const token = req.headers['authorization'];
        const authData = jwt.decode(token.split(' ')[1]);
        const {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
        } = req.body
        const userData ={
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
            CreatedBy: authData.user._id,
            UpdatedBy: "",
            UpdatedDateTime:""
        }
        const checkUser = await userService.checkUserAlreadyExists(userData.UserName);
        if(checkUser === undefined || checkUser === null)
        {
            const savedUser = await userService.saveUser(userData)
            return res.status(200).send(savedUser);
        }
        else{
            return res.status(400).send({message: "The Username is already exists."});
        }
};

const updateUser = async (req, res) => {
        const validationResult = userValidation.updateValidation(req.body);
        if(validationResult){
            return res.status(400).send({message:validationResult.details[0].messsage})
        }
        const token = req.headers['authorization'];
        const authData = jwt.decode(token.split(' ')[1]);
        const {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password
        } = req.body
        const userData = {
            FirstName,
            MiddleName,
            LastName,
            PhoneNumber,
            EmailId,
            UserName,
            Password,
            UpdatedBy: authData.user._id
        }
        userData._id= req.body._id;
        const updatedUser = await userService.updateUser(userData);
        return res.status(200).send(updatedUser);
};

const deleteUser = async (req, res) => {
        const validationResult = userValidation.deleteValidation(req.body);
        if(validationResult != null){
            return res.status(400).send({message:validationResult.details[0].message})
        }
        const deletedUser = await userService.deleteUser(req.body._id)
        return res.status(200).send(deletedUser);
};

const authenticateUser = async (req, res) => {
        const validationResult = userValidation.authenticateValidation(req.body);
        if(validationResult != null){
            return res.status(400).send({message:validationResult.details[0].message})
        }
        const user = await userService.authenticateUser(req.body.UserName, req.body.Password);
        if(user != null || user != undefined)
        {
        jwt.sign({ user: user }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' }, (err, token) => {
            return res.status(200).send({
                token: token
            });
        });
        }
        else{
            return res.status(400).send({message : "Invalid Credentials"});
        }
};


module.exports = {
    getUsers,
    saveUser,
    updateUser,
    deleteUser,
    authenticateUser
};