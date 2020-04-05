const express = require('express');
const jwtAuthValidation = require('./jwtAuth');
const userController = require('../controllers/userController'); 

const router = express.Router();

router.get('/getUsers', jwtAuthValidation, userController.getUsers);
router.get('/getUser', jwtAuthValidation, userController.getUser);
router.post('/saveUser', jwtAuthValidation, userController.saveUser);
router.put('/updateUser', jwtAuthValidation, userController.updateUser);
router.delete('/deleteUser', jwtAuthValidation, userController.deleteUser);
router.post('/authenticateUser', userController.authenticateUser);

module.exports = router;