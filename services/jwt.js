const jwt = require('jsonwebtoken')

module.exports = {


    verify(token, callback) {
        try {
            return jwt.verify(token, 'secret', {}, callback)
        } catch (err) {
            return 'error'
        }
    },

    decode(token) {
        const parts = token.split(' ')
        if (parts.length === 2) {
            const scheme = parts[0]
            const credentials = parts[1]
            if (/^Bearer$/i.test(scheme)) {
                return credentials
            }
            return false
        }
        return false
    },
}
