const { Joi } = require('express-validation')

module.exports = {
    company:{
        body: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
            SIRET: Joi.string().required(),
            VAT: Joi.string().required()
        })
    }
}