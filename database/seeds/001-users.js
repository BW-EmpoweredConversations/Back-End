
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('users').insert([
    {
      email: 'tester@email.com',
      password: '$2y$15$nY47c1FNjxHIJsBduM1XYuE5/WggnAaf5pkgNp8utW91Oz2cmcJKi',
      name: 'tester',
      phone_number: '5555555555'
    },
  ]);
};
