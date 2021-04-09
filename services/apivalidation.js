const Joi = require('@hapi/joi')
const Response = require('./response')
const Helper = require('./Helper')

module.exports = {
    loginValidation: (req, res, callback) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .max(200)
                .required(),
            password: Joi.string().trim().min(8).max(100).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('loginValidation', error))
            )
        }
        return callback(true)
    },
    addUser: (req, res, callback) => {
        const schema = Joi.object({
            first_name:Joi.required(),
            last_name:Joi.required(),
            category:Joi.required(),
            mobile:Joi.string().trim()
                .min(5)
                .max(15)
                .regex(/^[0-9]*$/).required(),
            image:Joi.string().required(),
            gender:Joi.number().valid(1, 2, 3).required(),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .max(200)
                .required(),
            password: Joi.string().trim().min(8).max(100).required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userRegistrationValidation', error))
            )
        }
        return callback(true)
    },
    addEditProduct: (req, res, callback) => {
        const schema = Joi.object({
            id:Joi.number().optional(),
            name:Joi.string().required(),
            price:Joi.number().required(),
            sku:Joi.string().required(),
            image:Joi.string().required(),
            category:Joi.string().required(),
        })
        const { error } = schema.validate(req)
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('addEditProductValidation', error))
            )
        }
        return callback(true)
    },
}
