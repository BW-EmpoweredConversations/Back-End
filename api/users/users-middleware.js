const jwt = require('jsonwebtoken')

const secret = process.env.SECRET || 'secret key'

module.exports = {
    valUserAuth,
}

function valUserAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) return res.status(401).json({message: 'Missing authorization header'})

    const id = Number(req.params.id)

    jwt.verify(req.headers.authorization, secret, (err, decoded) => {
        if (err || decoded.id != id) res.status(401).json({message: 'Invalid authorization header'})
        else next()
    })
}