// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: { filename: './database/development.db3' },
    useNullAsDefault: true,
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
      },
    },
  },

  testing: {
    client: 'sqlite3',
    connection: { filename: './database/testing.db3' },
    useNullAsDefault: true,
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' },
    pool: {
      afterCreate: (conn, done) => {
        // runs after a connection is made to the sqlite engine
        conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
      },
    },
  },

};
