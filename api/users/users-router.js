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
