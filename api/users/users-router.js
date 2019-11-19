const router = require('express').Router()
const ms = require('ms')

const userModel = require('./users-model')
const { valUserAuth } = require('./users-middleware')

module.exports = router

router.get('/:id', valUserAuth, (req, res) => {
    const id = req.params.id
    
    userModel.findUserNoAuth({id})
        .then(user => {
            if (user) res.json(user)
            else res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.put('/:id', valUserAuth, (req, res) => {

    // check body
    if (!req.body) return res.status(400).json({message: 'Missing content application/json'})

    // check fields and types
    for (let prop of ['phone_number']) {
        if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

        if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
    }
    
    // check phone_number length
    const phone_number = req.body.phone_number.replace(/\D/g,'')
    if (phone_number.length < 10 || phone_number.length > 11) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern example: 555-555-5555`})

    const id = Number(req.params.id)
    
    userModel.findUserNoAuth({id})
        .then(user => {
            if (user) {
                userModel.updateUser(id, {phone_number})
                    .then(user => {
                        res.json(user)
                    })
            }
            else res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.delete('/:id', valUserAuth, (req, res) => {
    const id = Number(req.params.id)
    
    userModel.findUserNoAuth({id})
        .then(user => {
            if (user) {
                userModel.deleteUser(id)
                    .then(() => {
                        res.sendStatus(204)
                    })
            }
            else res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.get('/:id/conversations', valUserAuth, (req, res) => {
    const id = req.params.id
    
    userModel.findUserNoAuth({id})
        .then(user => {
            if (user) {
                userModel.findUserConv(id)
                    .then(arr => {
                        res.json(arr.map(conv => {
                            const {id, name, phone_number, user_id} = conv
                            const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString()
                            return {id, name, phone_number, expires, user_id}
                        }))
                    })
            }
            else res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.post('/:id/conversations', valUserAuth, (req, res) => {
    
    // check body
    if (!req.body) return res.status(400).json({message: 'Missing content application/json'})

    // check fields and types
    for (let prop of ['name', 'phone_number']) {
        if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

        if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
    }
    
    // check phone_number length
    const phone_number = req.body.phone_number.replace(/\D/g,'')
    if (phone_number.length < 10 || phone_number.length > 11) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern example: 555-555-5555`})

    const id = req.params.id
    const name = req.body.name
    
    userModel.findUserNoAuth({id})
        .then(user => {
            if (user) {
                userModel.addUserConv(id, {name, phone_number})
                    .then(conv => {
                        // convert created_at + expires_in to expires
                        const {id, name, phone_number, user_id} = conv
                        const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString()
                        res.json({id, name, phone_number, expires, user_id})
                    })
            }
            else res.sendStatus(404)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})