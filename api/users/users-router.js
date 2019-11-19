const router = require('express').Router()

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