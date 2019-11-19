const router = require('express').Router()
const ms = require('ms')

const convModel = require('./conv-model')
const { valUserIdAuth } = require('./conv-middleware')

module.exports = router

router.post('/', (req, res) => {
    // check body
    if (!req.body) return res.status(400).json({message: 'Missing content application/json'})

    // check fields and types
    for (let prop of ['name']) {
        if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

        if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
    }

    if (!req.body.code) return res.status(400).json({message: 'Missing required property: code'})

    const id = Number(req.body.code)
    const name = req.body.name

    convModel.findConv({id, name})
        .then(arr => {
            const conv = arr[0]
            if (!conv) res.sendStatus(404)
            else {
                // TODO: CHECK EXPIRATION
                // if (Date.now > Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)) 
                
                // TODO: SEND SMS
                
                res.json({id, message: 'Thank you.'})
            }
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.get('/:id', valUserIdAuth, (req, res) => {
    const conv = res.locals.conv
    const {id, name, phone_number, user_id} = conv
    const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString()
    res.json({id, name, phone_number, expires, user_id})
})