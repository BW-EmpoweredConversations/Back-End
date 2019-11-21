const db = require('../../database/database')
const usersModel = require('./users-model')

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe('usersModel', () => {
    describe('findUser', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        test('should resolve to an array with no filter', () => {
            return usersModel.findUser()
                .then(arr => {
                    expect(arr).toBeDefined()
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        test('should resolve to an array with length of the number of users', async () => {
            await usersModel.findUser()
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await db('users').insert({email, password, name, phone_number})

            await usersModel.findUser()
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        test('should resolve to undefined with filter and no match', () => {
            return usersModel.findUser({id: 1})
                .then(user => {
                    expect(user).toBeUndefined()
                })
        })

        test('should resolve to user with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return usersModel.findUser({id: 1})
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
            return usersModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toBeDefined()
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        test('should resolve to an array with length of the number of users', async () => {
            await usersModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await db('users').insert({email, password, name, phone_number})

            await usersModel.findUserNoAuth()
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        test('should resolve to undefined with filter and no match', () => {
            return usersModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user).toBeUndefined()
                })
        })

        test('should resolve to user with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return usersModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.email).toBe(email)
                    expect(user.name).toBe(name)
                    expect(user.phone_number).toBe(phone_number)
                })
        })

        test('should resolve without password with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})

            return usersModel.findUserNoAuth({id: 1})
                .then(user => {
                    expect(user.password).toBeUndefined()
                })
        })
    })

    describe('updateUser', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        it('should update a user', async () => {
            await db('users').insert({email, password, name, phone_number})

            await usersModel.updateUser(1, {name: 'success'})

            const user = await db('users').where({id: 1}).first()

            expect(user.name).toBe('success')
        })

        it('should return the updated user', async () => {
            await db('users').insert({email, password, name, phone_number})

            const user = await usersModel.updateUser(1, {name: 'success'})

            expect(user.name).toBe('success')
        })

        it('should return without password', async () => {
            await db('users').insert({email, password, name, phone_number})

            const user = await usersModel.updateUser(1, {name: 'success'})

            expect(user.password).toBeUndefined()
        })
    })

    describe('deleteUser', () => {

        beforeEach(() => db('users').truncate())

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'

        it('should delete a user', async () => {
            await db('users').insert({email, password, name, phone_number})

            await usersModel.deleteUser(1)

            const user = await db('users').where({id: 1}).first()

            expect(user).toBeUndefined()
        })
    })

    describe('findUserConv', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        it('should return an array', () => {
            return usersModel.findUserConv(1)
                .then(arr => {
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        it('should return with length matching conversation count', async () => {
            
            await db('users').insert({email, password, name, phone_number})

            await usersModel.findUserConv(1)
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })

            await db('conversations').insert({name, phone_number, user_id})

            await usersModel.findUserConv(1)
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })
    })

    describe('addUserConv', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        it('should add a conversation', async () => {
            await db('users').insert({email, password, name, phone_number})

            await db('conversations')
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await usersModel.addUserConv(user_id, {name, phone_number})

            await db('conversations')
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        it('should return added conversation', async () => {
            
            await db('users').insert({email, password, name, phone_number})

            await usersModel.addUserConv(user_id, {name, phone_number})
                .then(conv => {
                    expect(conv).toBeDefined()
                    expect(conv.id).toBeDefined()
                    expect(conv.name).toBe(name)
                    expect(conv.phone_number).toBe(phone_number)
                    expect(conv.user_id).toBe(user_id)
                })
        })
    })
})