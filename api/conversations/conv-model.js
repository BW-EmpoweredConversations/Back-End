const db = require('../../database/database')

module.exports = {
    findConv,
    findConvById,
    updateConv,
    deleteConv,
}

function findConv(filter) {
    if (filter) return db('conversations').where(filter)
    else return db('conversations')
}

function findConvById(id) {
    return db('conversations').where({id}).first()
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
