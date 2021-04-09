const {Product} = require('../models')
const constant = require('../services/constant')
const Transformer = require('object-transformer')
const Response = require('../services/response')
const { Op } = require('sequelize')
const moment = require('moment')
const product_transformer = require('../transformers/product')
const fs = require('fs');
const {addEditProduct} = require('../services/apivalidation')

module.exports = {
     GetProduct:async (req,res) => {
         let requestParams = req.query
         const limit =
             requestParams.per_page && requestParams.per_page > 0
                 ? +requestParams.per_page
                 : constant.PER_PAGE
         const pageNo =
             requestParams.page && requestParams.page > 0
                 ? +requestParams.page
                 : 1
         const offset = (pageNo - 1) * limit
         let query = {}
        if(requestParams.search){
            query  = {
                ...query,
                [Op.or]:{
                    category: {
                        [Op.like]:`%${requestParams.search}%`
                    },
                    name:{
                        [Op.like]:`%${requestParams.search}%`
                    }
                }
            }
        }
        await Product.findAndCountAll({
            where:query,
            limit:limit,
            order:[['updatedAt','DESC']],
            offset:offset
        }).then((response)=>{
            if(response.count > 0){
                const meta = {}
                meta.total = response.count
                meta.per_page = limit
                meta.page = pageNo

                return Response.successResponseData(
                    res,
                    new Transformer.List(response.rows, product_transformer.detail).parse(),
                    constant.SUCCESS,
                    res.locals.__('success'),
                    meta
                )
            } else {
                return Response.successResponseData(
                    res,
                    [],
                    constant.SUCCESS,
                    res.locals.__('noDataFound')
                )
            }
        })
    },
    DeleteProduct:async (req,res) => {
        const reqParam = req.params
            const product = await Product.findOne({
                where: {
                    id: reqParam.id
                }
            })
            if (product) {
                await Product.destroy({
                    where: {
                        id: reqParam.id
                    }
                }).then(() => {
                    return Response.successResponseWithoutData(
                        res,
                        res.locals.__('productDeletedSuccess'),
                        constant.SUCCESS,
                    )
                })
            } else {
                return Response.successResponseWithoutData(
                    res,
                    res.locals.__('productDoesNotExist'),
                    constant.FAIL,
                )
            }
    },
    GetOneProduct:async (req,res) => {
        const reqParam = req.params
        const product = await Product.findOne({
            where: {
                id: reqParam.id
            }
        })
        if (product) {
            return Response.successResponseData(
                res,
                new Transformer.Single(product, product_transformer.detail).parse(),
                constant.SUCCESS,
                res.locals.__('success'),
            )
        } else {
            return Response.successResponseWithoutData(
                res,
                res.locals.__('productDoesNotExist'),
                constant.FAIL,
            )
        }
    },
    AddProduct: async (req, res) =>{
        const reqParam = req.body
        addEditProduct(reqParam, res, async (validate) => {
            if(reqParam.id){
            await Product.findOne({
                where: {
                    id: reqParam.id
                }
            }).then(async (response) => {
                if (response) {
                    fs.unlink(`./public/product/${response.image}`, (err) => {
                        if (err) {
                            console.log("failed to delete local image:"+err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });

                    const image = `${moment().unix()}.png`
                    await module.exports.imageUpload(image,reqParam.image)
                    await Product.update({
                        name: reqParam.name,
                        price: reqParam.price,
                        sku: reqParam.sku,
                        image: image,
                        category: reqParam.category
                    }, {
                        where: {
                            id: reqParam.id
                        }
                    }).then(() => {
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('productUpdatedSuccess'),
                            constant.SUCCESS,
                        )
                    })
                } else {
                    return Response.successResponseWithoutData(
                        res,
                        res.locals.__('productDoesNotExist'),
                        constant.FAIL,
                    )
                }
            })
            } else {
                const image = `${moment().unix()}.png`
                await module.exports.imageUpload(image,reqParam.image)
                await Product.create({
                    name: reqParam.name,
                    price: reqParam.price,
                    sku: reqParam.sku,
                    image: image,
                    category: reqParam.category
                })
                return Response.successResponseWithoutData(
                    res,
                    res.locals.__('productCreatedSuccess'),
                    constant.SUCCESS,
                )
            }
        })
    },
    async imageUpload(image,req_image) {
        let m = req_image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let b = Buffer.from(m[2], 'base64');
        fs.writeFileSync(`./public/product/${image}`, b);
    }
}
