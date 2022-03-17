const { Joi } = require('express-validation')

module.exports = {
    login:{
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    verifySMS:{
        body: Joi.object({
            email: Joi.string().required(),
            code: Joi.string().required()
        })
    },
    forgotPassword:{
        body: Joi.object({
            email: Joi.string().required()
        })
    },
    verifyToken:{
        body: Joi.object({
            token: Joi.string().required()
        })
    },
    resetPassword:{
        body: Joi.object({
            token: Joi.string().required(),
            password: Joi.string().required()
        })
    }
}