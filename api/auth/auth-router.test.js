const request = require('supertest')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../../database/database')

const server = express()

server.use(express.json())

server.use('/api/auth', require('./auth-router'))

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe.skip('/api/auth', () => {
    describe('POST /register', () => {

        beforeEach(() => db('users').truncate())

        bcrypt.hash = jest.fn(password=>password)

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '555-555-5555'

        test('should respond status code 400 Bad Request with no body', () => {
            return request(server).post('/api/auth/register').expect(400)
        })

        test('should respond status code 400 Bad Request with missing email', () => {
            return request(server).post('/api/auth/register').send({phone_number, password, name}).expect(400)
        })

        test('should respond status code 400 Bad Request with missing password', () => {
            return request(server).post('/api/auth/register').send({email, phone_number, name}).expect(400)
        })

        test('should respond status code 400 Bad Request with missing name', () => {
            return request(server).post('/api/auth/register').send({email, password, phone_number}).expect(400)
        })

        test('should respond status code 400 Bad Request with missing phone_number', () => {
            return request(server).post('/api/auth/register').send({email, password, name}).expect(400)
        })

        test('should respond status code 400 Bad Request with misformatted email', () => {
            return request(server).post('/api/auth/register').send({phone_number, password, name, email: 'testing'}).expect(400)
        })

        test('should respond status code 400 Bad Request with misformatted phone_number', () => {
            return request(server).post('/api/auth/register').send({phone_number: '5555555', password, name, email}).expect(400)
        })

        test('should respond status code 409 Conflict with repeat email', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).post('/api/auth/register').send({email, password, name, phone_number}).expect(409)
        })

        test('should respond status code 201 Created on success', () => {
            return request(server).post('/api/auth/register').send({email, password, name, phone_number}).expect(201)
        })
    })

    describe('POST /login', () => {

        beforeEach(() => db('users').truncate())

        bcrypt.compare = jest.fn((a,b) => a === b)

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '555-555-5555'

        test('should respond status code 400 Bad Request with no body', () => {
            return request(server).post('/api/auth/login').expect(400)
        })

        test('should respond status code 400 Bad Request with missing email', () => {
            return request(server).post('/api/auth/login').send({password}).expect(400)
        })

        test('should respond status code 400 Bad Request with missing password', () => {
            return request(server).post('/api/auth/login').send({email}).expect(400)
        })

        test('should respond status code 400 Bad Request with misformatted email', () => {
            return request(server).post('/api/auth/login').send({password, email: 'testing'}).expect(400)
        })

        test('should respond status code 401 Unauthorized with unused email', () => {
            return request(server).post('/api/auth/login').send({password, email}).expect(401)
        })

        test('should respond status code 401 Unauthorized with wrong password', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).post('/api/auth/login').send({email, password: 'wrong'}).expect(401)
        })

        test('should respond status code 200 Okay on success', async () => {
            await db('users').insert({email, password, name, phone_number})
            return request(server).post('/api/auth/login').send({email, password}).expect(200)
        })
    })
})