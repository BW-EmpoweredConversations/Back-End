const db = require('../../database/database')

module.exports = {
    findConv,
    findConvById,
}

function findConv(filter) {
    if (filter) return db('conversations').where(filter)
    else return db('conversations')
}

function findConvById(id) {
    return db('conversations').where({id}).first()
}