const express = require('express')
const helment = require('helmet')
const cors = require('cors')

const authRouter = require('./auth/auth-router')

const server = express()

// middleware
server.use(helment(), cors(), express.json())

// routers
// server.use('/api/auth', authRouter)

server.get('/api', (req, res) => {
    res.json({message: 'Hello World!'})
})

module.exports = server