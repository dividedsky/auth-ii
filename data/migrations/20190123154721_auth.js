
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('username').notNullable().unique('uq_username');
    tbl.string('password', 128).notNullable();
    tbl.string('department');
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
