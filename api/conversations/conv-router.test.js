const request = require('supertest')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../../database/database')
const middleware = require('./conv-middleware')

const server = express()

server.use(express.json())

jest.mock('twilio')
middleware.valUserIdAuth = jest.fn((req, res, next) => {
    res.locals.conv = {
        id: 1,
        name: 'testing',
        phone_number: '+15555555555',
        created_at: '2019-11-20 20:45:33',
        expires_in: '24h',
        user_id: 1
    }
    next()
})

server.use('/api/conversations', require('./conv-router'))

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe('/api/conversations', () => {
    describe('POST /', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1
        const code = 1

        test('should respond status code 400 Bad Request with no body', () => {
            return request(server).post('/api/conversations/').expect(400)
        })

        test('should respond status code 400 Bad Request with missing name', () => {
            return request(server).post('/api/conversations/').send({code}).expect(400)
        })

        test('should respond status code 400 Bad Request with missing code', () => {
            return request(server).post('/api/conversations/').send({name}).expect(400)
        })

        test('should respond status code 200 Okay on success', async () => {
            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})
            return request(server).post('/api/conversations/').send({name, code}).expect(200)
        })
    })

    describe('GET /:id', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        // test('should respond status code 401 Unauthorized with no token', () => {
        //     return request(server).get('/api/conversations/1').expect(401)
        // })

        test('should respond status code 200 Okay on success', async () => {

            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})
            
            return request(server).get('/api/conversations/1').expect(200)
        })

        test('should respond an object', async () => {

            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})
            
            return request(server).get('/api/conversations/1')
                .then(conv => {
                    expect(typeof conv).toBe('object')
                })
        })
    })

    describe('PUT /:id', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        test('should respond status code 400 Bad Request with no body', () => {
            return request(server).put('/api/conversations/1').expect(400)
        })

        test('should respond status code 400 Bad Request without expires ', () => {
            return request(server).put('/api/conversations/1').send({}).expect(400)
        })

        test('should respond status code 200 Okay on success', async () => {

            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})
            
            return request(server).put('/api/conversations/1').send({expires: new Date(Date.now() + 24*60*60*1000).toISOString()}).expect(200)
        })
    })

    describe('DELETE /:id', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1
        const code = 1

        // test('should respond status code 401 Unauthorized with no token', () => {
        //     return request(server).get('/api/conversations/1').expect(401)
        // })

        test('should respond status code 204 No Content on success', async () => {

            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})
            
            return request(server).delete('/api/conversations/1').expect(204)
        })
    })
})