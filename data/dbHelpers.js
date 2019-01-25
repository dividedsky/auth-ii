const db = require('../config/dbConfig');

module.exports = {
  getDepartment: department => db('users').select('username', 'department').where({ department }),

  getUsers: () => db('users').select('username', 'department'),

  getUser: username => db('users').where({ username }).first(),

  getUserDepartment:  username => db('users').select('department').where({username}).first(),

  addUser: user => db('users').insert(user),

  getDepartmentList: () => db('users').distinct('department').select(),

}
