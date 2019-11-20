const router = require('express').Router()
const ms = require('ms')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)

const convModel = require('./conv-model')
const { valUserIdAuth, checkBody, checkStrings } = require('./conv-middleware')

module.exports = router

router.post('/', checkBody, checkStrings(['name']), async (req, res) => {
    
    if (!req.body.code) return res.status(400).json({message: 'Missing required property: code'})

    const id = req.body.code
    const name = req.body.name

    try {
        const [conv] = await convModel.findConv({id, name})
        if (!conv) return res.sendStatus(404)

        const user = await convModel.findUserById(conv.user_id)
        if (!user) return res.sendStatus(404)

        // TODO: CHECK EXPIRATION
        // if (Date.now > Date.parse(conv.created_at + ' Z') + ms(conv.expires_in))

        // send SMS
        if (user.phone_number != '+15555555555') {
            await client.messages
            .create({
                body: `Hello ${user.name}. ${conv.name} replied they're ready for your conversation.`,
                from: '+12056066299',
                to: user.phone_number
            })
        }

        res.json({id: conv.id, message: 'Thank you.'})
    }
    catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

router.get('/:id', valUserIdAuth, (req, res) => {
    const conv = res.locals.conv
    const {id, name, phone_number, user_id} = conv
    const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString()
    res.json({id, name, phone_number, expires, user_id})
})

router.put('/:id', checkBody, checkStrings(['expires']), valUserIdAuth, (req, res) => {

    const expires = req.body.expires
    if (Date.now() > Date.parse(expires)) return res.status(400).json({message: 'That time has already passed.'})
    
    const conv = res.locals.conv
    const expires_in = ms(Date.parse(expires) - Date.parse(conv.created_at + ' Z'))
    
    convModel.updateConv(conv.id, {expires_in})
        .then(conv => {
            const {id, name, phone_number, user_id} = conv
            const expires = new Date(Date.parse(conv.created_at + ' Z') + ms(conv.expires_in)).toISOString() // BUG: ms rounds values, so 24-36 hours -> 1 day
            res.json({id, name, phone_number, expires, user_id})
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})

router.delete('/:id', valUserIdAuth, (req, res) => {
    const id = res.locals.conv.id
    convModel.deleteConv(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
})