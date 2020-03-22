const Joi = require('@hapi/joi');

const saveValidation = (body) =>{
    const schema = Joi.object({
        FirstName: Joi.string().min(5).max(100).required(),
        MiddleName: Joi.string().allow('').optional(),
        LastName: Joi.string().min(5).max(100).required(),
        PhoneNumber: Joi.string().min(10).max(10).required(),
        EmailId : Joi.string().trim().email().required(),
        UserName : Joi.string().min(5).max(10).required(),
        Password: Joi.string().min(5).max(10).required()
    })
    return schema.validate(body).error
}

const updateValidation = (body) =>{
    const schema = Joi.object({
        _id: Joi.string().required(),
        FirstName: Joi.string().min(5).max(100).required(),
        MiddleName: Joi.string().allow('').optional(),
        LastName: Joi.string().min(5).max(100).required(),
        PhoneNumber: Joi.string().min(10).max(10).required(),
        EmailId : Joi.string().trim().email().required(),
        UserName : Joi.string().min(5).max(10).required(),
        Password: Joi.string().min(5).max(10).required()
    })
    return schema.validate(body).error
}

const deleteValidation = (body) =>{
    const schema = Joi.object({
        _id:Joi.string().required()
    })
    return schema.validate(body).error
}

const authenticateValidation = (body) => {
    const schema = Joi.object({
        UserName : Joi.string().required(),
        Password : Joi.string().required()
    });
    return schema.validate(body).error
}

module.exports = { saveValidation, updateValidation, deleteValidation, authenticateValidation };