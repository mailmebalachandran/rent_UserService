const User = require('../models/User');
const ObjectID = require('mongodb').ObjectID;

const getUsers = async () => {
    try {
        const users = await User.find();
        return users;
    }
    catch(err) {
        throw err;
    }
}

const getUser = async (_id) => {
    try {
        const user = await User.findOne({_id});
        return user;
    }
    catch(err) {
        throw err;
    }
}

const saveUser = async (user) => {
    try {
        const userData = new User(user);
        const savedUser = await userData.save();
        return savedUser;
    }
    catch(err) {
        throw err;
    }
}

const updateUser = async (user) => {
    try {
        const updatedUser = await User.findByIdAndUpdate({_id : ObjectID(user._id)}, { $set: user });
        return updatedUser;
    }
    catch(err) {
        throw err;
    }
}

const deleteUser = async (_id) => {
    try {
        const deletedUser = await User.deleteOne({ _id });
        return deletedUser;
    }
    catch(err) {
        throw err;
    }
}

const authenticateUser = async (userName, password) => {
    try {
        const user = await User.findOne({ UserName: userName, Password: password })
        return user;
    }
    catch(err) {
        throw err;
    }
}

const checkUserAlreadyExists = async (UserName) =>{
    
    try{
        const user = await User.findOne({UserName});
        return user;
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    getUsers,
    getUser,
    saveUser,
    updateUser,
    deleteUser,
    authenticateUser,
    checkUserAlreadyExists
}