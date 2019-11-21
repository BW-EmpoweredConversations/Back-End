const db = require('../../database/database')

const {findUser, findUserNoAuth} = require('../users/users-model')

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