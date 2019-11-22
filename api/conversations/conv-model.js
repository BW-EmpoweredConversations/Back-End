const db = require('../../database/database')

// const { findUser } = require('../users/users-model')
/*! cannot require from a file that requires this file */

module.exports = {
    findConv,
    findUser,
    updateConv,
    deleteConv,
}

function findUser(filter) {
    if (filter) return db('users').where(filter).first()
    else return db('users')
}

function findConv(filter) {
    if (filter) return db('conversations').where(filter).first()
    else return db('conversations')
}

function updateConv(id, changes) {
    try {
        return db('conversations').where({id}).update(changes)
            .then(() => findConv({id}))
    }
    catch (err) {throw err}
}

function deleteConv(id) {
    return db('conversations').where({id}).del()
}
