const request = require('supertest')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../../database/database')
const middleware = require('./users-middleware')

const server = express()

server.use(express.json())

jest.mock('twilio')

middleware.valUserAuth = jest.fn((req, res, next) => {
    next()
})

server.use('/api/users', require('./users-router'))

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe('/api/users', () => {
    describe('GET /:id', () => {

        beforeEach( async () => {
            // await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1
        const code = 1

        test('should respond status code 404 Not Found with no match', () => {
            return request(server).get('/api/users/1').expect(404)
        })

        test('should respond status code 200 Okay with a match', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).get('/api/users/1').expect(200)
        })
    })

    describe('PUT /:id', () => {

        beforeEach( async () => {
            // await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        test('should respond status code 400 Bad Request with no body', () => {
            return request(server).put('/api/users/1').expect(400)
        })

        test('should respond status code 400 Bad Request without phone_number ', () => {
            return request(server).put('/api/users/1').send({}).expect(400)
        })

        test('should respond status code 400 Bad Request with misformatted phone_number', () => {
            return request(server).put('/api/users/1').send({phone_number: '5555555'}).expect(400)
        })

        test('should respond status code 404 Not Found with no match', () => {
            return request(server).put('/api/users/1').send({phone_number: '+16666666666'}).expect(404)
        })

        test('should respond status code 200 Okay on success', async () => {
            await db('users').insert({email, password, name, phone_number})
            
            return request(server).put('/api/users/1').send({phone_number: '+16666666666'}).expect(200)
        })
    })

    describe('DELETE /:id', () => {

        beforeEach( async () => {
            // await db('conversations').truncate()
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

        test('should respond status code 404 Not Found with no match', () => {
            return request(server).delete('/api/users/1').expect(404)
        })

        test('should respond status code 204 No Content on success', async () => {

            await db('users').insert({email, password, name, phone_number})
            
            return request(server).delete('/api/users/1').expect(204)
        })
    })

    describe('GET /:id/conversations', () => {

        beforeEach( async () => {
            // await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1
        const code = 1

        test('should respond status code 404 Not Found with no match', () => {
            return request(server).get('/api/users/1/conversations').expect(404)
        })

        test('should respond status code 200 Okay with a match', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).get('/api/users/1/conversations').expect(200)
        })
    })

    describe('POST /:id/conversations', () => {

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
            return request(server).post('/api/users/1/conversations').expect(400)
        })

        test('should respond status code 400 Bad Request without name ', () => {
            return request(server).post('/api/users/1/conversations').send({phone_number}).expect(400)
        })

        test('should respond status code 400 Bad Request without phone_number ', () => {
            return request(server).post('/api/users/1/conversations').send({name}).expect(400)
        })

        test('should respond status code 400 Bad Request with misformatted phone_number', () => {
            return request(server).post('/api/users/1/conversations').send({name, phone_number: '5555555'}).expect(400)
        })

        test('should respond status code 404 Not Found with no match', () => {
            return request(server).post('/api/users/1/conversations').send({name, phone_number}).expect(404)
        })

        test('should respond status code 200 Okay with a match', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).post('/api/users/1/conversations').send({name, phone_number}).expect(200)
        })
    })
})