const db = require('../../database/database')

const {findUser} = require('../users/users-model')

module.exports = {
    findConv,
    findUser,
    updateConv,
    deleteConv,
}

function findConv(filter) {
    if (filter) return db('conversations').where(filter).first()
    else return db('conversations')
}

function updateConv(id, changes) {
    try {
        return db('conversations').where({id}).update(changes)
            .then(() => findConvById(id))
    }
    catch (err) {throw err}
}

function deleteConv(id) {
    return db('conversations').where({id}).del()
}
