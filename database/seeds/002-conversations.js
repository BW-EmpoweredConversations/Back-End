
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('conversations').insert([
    {
      name: 'receiver',
      phone_number: '+15555555555',
      user_id: 1
    },
  ]);
};
