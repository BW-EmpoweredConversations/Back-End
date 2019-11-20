const jwt = require('jsonwebtoken')

const secret = process.env.SECRET || 'secret key'

module.exports = {
    valUserAuth,
    checkBody,
    checkStrings
}

function valUserAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) return res.status(401).json({message: 'Missing authorization header'})

    const id = Number(req.params.id)

    jwt.verify(req.headers.authorization, secret, (err, decoded) => {
        if (err || decoded.id != id) res.status(401).json({message: 'Invalid authorization header'})
        else next()
    })
}

function checkBody(req, res, next) {
    if (!req.body) res.status(400).json({message: 'Missing content application/json'})
    else next()
}

function checkStrings(props) {
    return (req, res, next) => {
        // check fields and types
        for (let prop of props) {
            if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

            if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
        }
        next()
    }
}