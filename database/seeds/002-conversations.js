
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('conversations').insert([
    {
      name: 'receiver',
      phone_number: '5555555555',
      user_id: 1
    },
  ]);
};
