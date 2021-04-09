const {MyUser} = require('../models')
const bcrypt = require('bcrypt');
const moment = require('moment')
const Response = require('../services/response')
const fs = require('fs');
const Transformer = require('object-transformer')
const jwt = require('jsonwebtoken')
const user_transformer = require('../transformers/user')
const constant = require('../services/constant')
const {loginValidation,addUser} = require('../services/apivalidation')

module.exports = {
    Login:async (req,res) => {
        const reqParam = req.body
        loginValidation(reqParam, res, async (validate) => {
            const user = await MyUser.findOne({
                where: {
                    email: reqParam.email
                }
            })
            if (!user) {
                return Response.successResponseWithoutData(
                    res,
                    res.locals.__('customerDoesnotExist'),
                    constant.FAIL,
                )
            }
            bcrypt.compare(
                reqParam.password,
                user.password,
                async (err, result) => {
                    console.log('result',result)
                    if (result) {
                        const token = jwt.sign(
                            {
                                id: user.id,
                            },
                            'secret',
                            {algorithm: 'HS512'}
                        )
                        return Response.successResponseData(
                            res,
                            {
                                token: token,
                                user: new Transformer.Single(user, user_transformer.detail).parse()
                            },
                            constant.SUCCESS,
                            res.locals.__('success'),
                        )
                    } else {
                        console.log(err)
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('incorrectPassword'),
                            constant.FAIL,
                        )
                    }
                }
            )
        })
    },
    AddCustomer: async (req ,res) =>{
        const reqParam = req.body
        addUser(reqParam, res, async (validate) => {
            console.log(reqParam)
            MyUser.findOne({
                where: {
                    email: reqParam.email
                }
            }).then(async (response) => {
                if (response) {
                    return Response.successResponseWithoutData(
                        res,
                        res.locals.__('customerExist'),
                        constant.FAIL,
                    )
                } else {
                    await bcrypt.hash(reqParam.password, 10, async function (err, hash) {
                        const image_name = `${moment().unix()}.png`
                        let a = reqParam.image
                        let m = a.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

                        let b = Buffer.from(m[2], 'base64');
                        fs.writeFileSync(`./public/users/${image_name}`, b);

                        MyUser.create({
                            password: hash,
                            first_name: reqParam.first_name,
                            last_name: reqParam.last_name,
                            email: reqParam.email,
                            image: image_name,
                            gender: reqParam.gender,
                            categories: reqParam.category,
                            mobile: reqParam.mobile
                        }).then(() => {
                            return Response.successResponseWithoutData(
                                res,
                                res.locals.__('success'),
                                constant.SUCCESS,
                            )
                        }).catch((e) => {
                            return Response.errorResponseData(
                                res,
                                res.__('internalError'),
                                constant.INTERNAL_SERVER
                            )
                        })
                    });
                }
            })
        })
    }
}
