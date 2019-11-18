
exports.up = function(knex) {
  return knex.schema
    // users
    .createTable('users', tbl => {
        // id: primary key
        tbl.increments().unique().notNullable()
        // email: string required unique
        tbl.string('email').unique().notNullable()
        // password: string required
        tbl.string('password').notNullable()
        // name: string required
        tbl.string('name').notNullable()
        // phone_number: string required
        tbl.string('phone_number').notNullable()
    })
    // conversations
    .createTable('conversations', tbl => {
        // id: primary key
        tbl.increments().unique().notNullable()
        // name: string required
        tbl.string('name').notNullable()
        // phone_number: string required
        tbl.string('phone_number').notNullable()
        // created_at: datetime defaults
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
        // expires_in: string defaults
        tbl.string('expires_in').defaultTo('24h')
        // user_id: foreign key
        tbl.integer('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('conversations')
    .dropTable('users')
};
