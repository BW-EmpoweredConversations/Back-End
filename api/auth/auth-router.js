const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authModel = require('./auth-model')
const { checkBody, checkStrings } = require('./auth-middleware')
const { formatPhoneNumber } = require('./auth-utils')

module.exports = router

router.post('/register', checkBody, checkStrings(['email', 'password', 'name', 'phone_number']), async (req, res) => {

    // check email pattern
    if (!/\S+@\S+\.\S+/.test(req.body.email)) return res.status(400).json({message: `Property email did not match expected pattern. Pattern example: yourname@website.com`})

    // check phone_number E.164 format
    const phone_number = formatPhoneNumber(req.body.phone_number)
    if (!phone_number) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern examples: 555-555-5555, +1-555-555-5555`})

    // check if email is unique
    const email = req.body.email
    try {
        const user = await authModel.findUser({email})
        if (user) return res.status(409).json({message: `That email address is already in use. Please enter a different email address.`})
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
            jwt.sign({id: user.id}, process.env.SECRET || 'secret key', {expiresIn: '7d'}, (err, authorization) => {
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

router.post('/login', checkBody, checkStrings(['email', 'password']), async (req, res) => {

    // check email pattern
    if (!/\S+@\S+\.\S+/.test(req.body.email)) return res.status(400).json({message: `Property email did not match expected pattern. Pattern example: yourname@website.com`})

    // find user
    let user
    try {
        const email = req.body.email
        user = await authModel.findUser({email})
        if (!user) return res.status(401).json({message: `Incorrect login information`})
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }

    // check password
    try {
        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) return res.status(401).json({message: `Incorrect login information`})
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }

    // make token
    jwt.sign({id: user.id}, process.env.SECRET || 'secret key', {expiresIn: '7d'}, (err, authorization) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        else {
            // sanitize password
            delete user.password
            // send user data and authorization token
            res.json({user, authorization})
        }
    })
})