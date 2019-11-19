const jwt = require('jsonwebtoken')

const convModel = require('./conv-model')

const secret = process.env.SECRET || 'secret key'

module.exports = {
    valUserIdAuth,
}

async function valUserIdAuth(req, res, next) {
    if (!req.headers || !req.headers.authorization) return res.status(401).json({message: 'Missing authorization header'})

    const id = req.params.id

    try {
        const conv = await convModel.findConvById(id)
        if (conv) res.locals.conv = conv
        else return res.status(401).json({message: 'Invalid authorization header'})
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }

    jwt.verify(req.headers.authorization, secret, (err, decoded) => {
        if (err || decoded.id != res.locals.conv.user_id) res.status(401).json({message: 'Invalid authorization header'})
        else next()
    })
}