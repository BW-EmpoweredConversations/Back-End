const db = require('../../database/database')

module.exports = {
    addUser,
    findUser,
    findUserNoAuth,
}

function addUser(user) {
    try {
        return db('users').insert(user, 'id')
            .then(resp => {
                const id = resp[0]
                return findUserNoAuth({id})
            })
    }
    catch (err) {
        throw err
    }
}

function findUser(filter) {
    if (filter) return db('users').where(filter).first()
    else return db('users')
}

function findUserNoAuth(filter) {
    if (filter) return db('users').select('id', 'email', 'name', 'phone_number').where(filter).first()
    else return db('users').select('id', 'email', 'name', 'phone_number')
}