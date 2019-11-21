const db = require('../../database/database')
const convModel = require('./conv-model')

beforeAll( async () => {
    await db('conversations').truncate()
    await db('users').truncate()
})

describe.skip('convModel', () => {
    describe('findConv', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        test('should resolve to an array with no filter', () => {
            return convModel.findConv()
                .then(arr => {
                    expect(arr).toBeDefined()
                    expect(Array.isArray(arr)).toBe(true)
                })
        })

        test('should resolve to an array with length of the number of conversations', async () => {
            await db('users').insert({email, password, name, phone_number})

            await convModel.findConv()
                .then(arr => {
                    expect(arr).toHaveLength(0)
                })
            
            await db('conversations').insert({name, phone_number, user_id})

            await convModel.findConv()
                .then(arr => {
                    expect(arr).toHaveLength(1)
                })
        })

        test('should resolve to undefined with filter and no match', () => {
            return convModel.findConv({id: 1})
                .then(conv => {
                    expect(conv).toBeUndefined()
                })
        })

        test('should resolve to conv with filter and match', async () => {
            await db('users').insert({email, password, name, phone_number})
            
            await db('conversations').insert({name, phone_number, user_id})

            return convModel.findConv({id: 1})
                .then(conv => {
                    expect(conv).toBeDefined()
                    expect(conv.name).toBe(name)
                    expect(conv.phone_number).toBe(phone_number)
                    expect(conv.user_id).toBe(user_id)
                })
        })
    })

    describe('updateConv', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        it('should update a conversation', async () => {
            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})

            await convModel.updateConv(1, {name: 'success'})

            const conv = await db('conversations').where({id: 1}).first()

            expect(conv.name).toBe('success')
        })

        it('should return the updated conv', async () => {
            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})

            const conv = await convModel.updateConv(1, {name: 'success'})

            expect(conv.name).toBe('success')
        })
    })

    describe('deleteConv', () => {

        beforeEach( async () => {
            await db('conversations').truncate()
            await db('users').truncate()
        })

        const email = 'test@email.com'
        const password = 'password'
        const name = 'testing'
        const phone_number = '+15555555555'
        const user_id = 1

        it('should delete a user', async () => {
            await db('users').insert({email, password, name, phone_number})
            await db('conversations').insert({name, phone_number, user_id})

            await convModel.deleteConv(1)

            const conv = await db('conversations').where({id: 1}).first()

            expect(conv).toBeUndefined()
        })
    })
})