const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authModel = require('./auth-model')

module.exports = router

router.post('/register', async (req, res) => {

    // check body
    if (!req.body) return res.status(400).json({message: 'Missing content application/json'})

    // check fields and types
    for (let prop of ['email', 'password', 'name', 'phone_number']) {
        if (!req.body[prop]) return res.status(400).json({message: 'Missing required property: ' + prop})

        if (typeof req.body[prop] != 'string') return res.status(400).json({message: `Property ${prop} must be a string`})
    }

    // check email pattern
    if (!/\S+@\S+\.\S+/.test(req.body.email)) return res.status(400).json({message: `Property email did not match expected pattern. Pattern example: yourname@website.com`})

    // check phone_number length
    const phone_number = req.body.phone_number.replace(/\D/g,'')
    if (phone_number.length < 10 || phone_number.length > 11) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern example: 555-555-5555`})

    // check if email is unique
    const email = req.body.email
    try {
        const user = await authModel.findUser({email})
        if (user) return res.status(409).json({message: `The email address is already in use on another account. Please enter a different email address.`})
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }

    // hash passord
    let password
    try {
        password = await bcrypt.hash(req.body.password, 15)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }

    // add new user
    const name = req.body.name
    authModel.addUser({email, password, name, phone_number})
        .then(user => {
            // make token
            jwt.sign({id: user.id}, process.env.SECRET || 'secret key', (err, authorization) => {
                if (err) throw err
                // send user data and authorization token
                res.status(201).json({user, authorization})
            })
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})