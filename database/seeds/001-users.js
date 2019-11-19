
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('users').insert([
    {
      email: 'tester@email.com',
      password: '$2b$15$I02hm1Y4PbJR6NIYev9Ct.JhKAfINkeqrMaSwPvCuyjwt7C7oUAfa',
      name: 'tester',
      phone_number: '5555555555'
    },
  ]);
};
