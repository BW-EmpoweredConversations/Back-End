const express = require('express')
const helment = require('helmet')
const cors = require('cors')

const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const convRouter = require('./conversations/conv-router')

const server = express()

// middleware
server.use(helment(), cors(), express.json())

// routers
server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)
server.use('/api/conversations', convRouter)

server.get('/api', (req, res) => {
    res.json({message: 'Hello World!'})
})

module.exports = server