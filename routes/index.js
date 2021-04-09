const route = require('express').Router()
const UserController = require('../controller/UserController')
const ProductController = require('../controller/ProductConstroller')
const { apiTokenAuth } = require('../middlewares/api')
const connect = require('connect')

const authMiddleware = (() => {
    const chain = connect();
    [apiTokenAuth].forEach((middleware) => {
        chain.use(middleware)
    })
    return chain
})()


route.post('/login',UserController.Login)
route.post('/add-user',UserController.AddCustomer)
route.post('/add-edit-product',authMiddleware,ProductController.AddProduct)
route.delete('/product/:id',authMiddleware,ProductController.DeleteProduct)
route.get('/product/:id',authMiddleware,ProductController.GetOneProduct)
route.get('/product',authMiddleware,ProductController.GetProduct)

module.exports = route

