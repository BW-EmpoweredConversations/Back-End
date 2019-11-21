const db = require('../../database/database')
const authModel = require('./auth-model')

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

    describe('findUser', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        test('should resolve to an array with no filter', () => {
            return authModel.findUser()
                .then(arr => {
                    expect(arr).toBeDefined()
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        test('should resolve to an array with length of the number of users', async () => {
            await authModel.findUser()
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await db('users').insert({email, password, name, phone_number})

            await authModel.findUser()
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        test('should resolve to undefined with filter and no match', () => {
            return authModel.findUser({id: 1})
                .then(user => {
                    expect(user).toBeUndefined()
                })
        })

        test('should resolve to user with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return authModel.findUser({id: 1})
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.email).toBe(email)
                    expect(user.name).toBe(name)
                    expect(user.password).toBe(password)
                    expect(user.phone_number).toBe(phone_number)
                })
        })
    })

    describe('findUserNoAuth', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        test('should resolve to an array with no filter', () => {
            return authModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toBeDefined()
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        test('should resolve to an array with length of the number of users', async () => {
            await authModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await db('users').insert({email, password, name, phone_number})

            await authModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        test('should resolve to undefined with filter and no match', () => {
            return authModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user).toBeUndefined()
                })
        })

        test('should resolve to user with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return authModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.email).toBe(email)
                    expect(user.name).toBe(name)
                    expect(user.phone_number).toBe(phone_number)
                })
        })

        test('should resolve without password with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return authModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user.password).toBeUndefined()
                })
        })
    })
})