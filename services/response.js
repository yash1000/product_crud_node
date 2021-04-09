module.exports = {

    successResponseData(res, data, code = 1, message, extras) {
        const response = {
            data,
            meta: {
                code,
                message,
            },
        }
        if (extras) {
            Object.keys(extras).forEach((key) => {
                if ({}.hasOwnProperty.call(extras, key)) {
                    response.meta[key] = extras[key]
                }
            })
        }
        return res.send(response)
    },

    successResponseWithoutData(res, message, code = 1) {
        const response = {
            data: null,
            meta: {
                code,
                message,
            },
        }
        return res.send(response)
    },

    errorResponseWithoutData(res, message, code = 0) {
        const response = {
            data: null,
            meta: {
                code,
                message,
            },
        }
        return res.send(response)
    },

    errorResponseData(res, message, code = 400) {
        const response = {
            code,
            message,
        }
        return res.status(code).send(response)
    },

    validationErrorResponseData(res, message, code = 400) {
        const response = {
            code,
            message,
        }
        return res.status(code).send(response)
    },
}
