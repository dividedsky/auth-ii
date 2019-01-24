require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');

const middlewareConfig = require('../config/middleware');
const db = require('../config/dbConfig');
const {
  getUsers,
  getUser,
  getDepartment,
  getUserDepartment,
  addUser,
} = require('../data/dbHelpers');

const { generateToken, lock, ensureValidUser, checkDepartment } = require('../common/middleware');

const server = express();
middlewareConfig(server);

server.get('/', (req, res) => {
  res.status(200).send('wheee, the server is running');
});

server.post('/register', ensureValidUser, (req, res) => {
    // encrypt pw before adding user
    req.body.password = bcrypt.hashSync(req.body.password, 14);
    addUser(req.body)
      .then(id => {
        if (id.length) {
          res.status(201).json({
            message: `thanks for registering, ${
              req.body.username
            }. You can now sign in.`,
          });
        } else {
          res.status(500).json({ error: 'something bad happened.' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: `there was an error: ${err}` });
      });
});

server.post('/login', ensureValidUser, (req, res) => {
  const creds = req.body;
  getUser(creds.username)
    .then(user => {
      console.log('user', user);
      console.log(user.password);
      console.log(creds.password);
      
      
      
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        
        // username and password are a match, generate token and return
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token });
      } else {
        // username and/or password are invalid
        res.status(401).json({ error: `invalid username or password` });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `there was an error accessing the database: ${err}` });
    });
});

server.get('/users/department', lock, async (req, res) => {
  // find current user's department
  try {
  const department = await getUserDepartment(req.decodedToken.username);
  const departmentList = await(getDepartment(department.department));
  res.status(200).json(departmentList);
  } catch(err) {
       res
         .status(500)
         .json({ error: `there was an error accessing the database: ${err}` });
  }
});

server.get('/users', lock, (req, res) => {
  getUsers()
    .then(userList => {
      res.status(200).json(userList);
    })
    .catch(err => {
      res
        .status(400)
        .json({ error: `there was an error accessing the database: ${err}` });
    });
});

server.get('/users/department/:department', lock, checkDepartment, async (req, res) => {
  const department = req.params.department;
  try {
  const departmentList = await(getDepartment(department));
  res.status(200).json(departmentList);
  } catch(err) {
       res
         .status(500)
         .json({ error: `there was an error accessing the database: ${err}` });
  }
});

module.exports = server;
