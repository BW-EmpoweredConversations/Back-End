const router = require('express').Router()
const ms = require('ms')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const userModel = require('./users-model')
const { valUserAuth, checkBody, checkStrings } = require('./users-middleware')
const { formatPhoneNumber } = require('./users-utils')

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

router.put('/:id', checkBody, checkStrings(['phone_number']), valUserAuth, async (req, res) => {
    
    const id = req.params.id
    
    // check phone_number E.164 format
    const phone_number = formatPhoneNumber(req.body.phone_number)
    if (!phone_number) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern examples: 555-555-5555, +1-555-555-5555`})
    
    try {
        // check user exists
        let user = await userModel.findUserNoAuth({id})
        if (!user) return res.sendStatus(404)

        // update user
        user = await userModel.updateUser(id, phone_number)
        res.json(user)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.delete('/:id', valUserAuth, async (req, res) => {
    const id = req.params.id
    
    try {
        // check user exists
        const user = await userModel.findUserNoAuth({id})
        if (!user) res.sendStatus(404)

        // delete user
        await userModel.deleteUser(id)
        res.sendStatus(204)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.get('/:id/conversations', valUserAuth, async (req, res) => {
    const id = req.params.id

    try {
        // check user exists
        const user = await userModel.findUserNoAuth({id})
        if (!user) res.sendStatus(404)

        // get user's conversations
        const arr = await userModel.findUserConv(id)
        res.json(arr.map(conv => {
            const {id, name, phone_number, user_id} = conv
            const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString()
            return {id, name, phone_number, expires, user_id}
        }))
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.post('/:id/conversations', checkBody, checkStrings(['name', 'phone_number']), valUserAuth, async (req, res) => {
        
    // check phone_number E.164 format
    const phone_number = formatPhoneNumber(req.body.phone_number)
    if (!phone_number) return res.status(400).json({message: `Property phone_number has the wrong number of digits. Pattern examples: 555-555-5555, +1-555-555-5555`})

    const id = req.params.id
    const name = req.body.name

    try {
        // check user exists
        const user = await userModel.findUserNoAuth({id})
        if (!user) res.sendStatus(404)

        // add new conversation
        const conv = await userModel.addUserConv(id, {name, phone_number})
        
        // if valid number, send SMS
        if (phone_number != '+15555555555') {
            await client.messages
            .create({
                // TODO: ADD WEBSITE LINK
                body: `Hello ${name}. ${user.name} is reaching out to you for a difficult conversation. Please read our advice at ${'website'}, and enter name: "${name}", and code: "${conv.id}" to let ${user.name} know you're ready.`,
                from: '+12056066299',
                to: phone_number
            })
        }

        // convert created_at + expires_in to expires
        conv.expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString() 
        delete conv.created_at
        delete conv.expires_in
        res.json(conv)
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})