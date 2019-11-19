const db = require('../../database/database')

module.exports = {
    findUser,
    findUserNoAuth,
    updateUser,
    deleteUser,
}

function findUser(filter) {
    if (filter) return db('users').where(filter).first()
    else return db('users')
}

function findUserNoAuth(filter) {
    if (filter) return db('users').select('id', 'email', 'name', 'phone_number').where(filter).first()
    else return db('users').select('id', 'email', 'name', 'phone_number')
}

function updateUser(id, changes) {
    try {
        return db('users').where({id}).update(changes)
            .then(() => findUserNoAuth({id}))
    }
    catch (err) {throw err}
}

function deleteUser(id) {
    return db('users').where({id}).del()
}