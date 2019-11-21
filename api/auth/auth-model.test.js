const db = require('../../database/database')
const authModel = require('./auth-model')

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe('authModel', () => {
    describe('addUser', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        test('should resolve to an object', () => {
            return authModel.addUser({email, password, name, phone_number})
                .then(user => {
                    expect(user).toBeDefined()
                    expect(typeof user).toBe('object')
                })
        })

        test('should resolve with id, email, name, and phone_number', () => {
            return authModel.addUser({email, password, name, phone_number})
                .then(user => {
                    expect(user.id).toBeDefined()
                    expect(user.email).toBe(email)
                    expect(user.name).toBe(name)
                    expect(user.phone_number).toBe(phone_number)
                })
        })

        test('should resolve without password', () => {
            return authModel.addUser({email, password, name, phone_number})
                .then(user => {
                    expect(user.password).toBeUndefined()
                })
        })
    })
})