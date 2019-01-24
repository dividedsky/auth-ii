require('dotenv').config();
const express = require('express');

const middlewareConfig = require('../config/middleware');
const db = require('../config/dbConfig');

const {generateToken, lock} = require('../common/middleware');

const server = express();
middlewareConfig(server);


server.get('/', (req, res) => {
  res.status(200).send('wheee, the server is running');
});


server.post('/register', (req, res) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.status(400).json({ error: 'user must have a username and password' });
  } else {
    user.password = bcrypt.hashSync(user.password, 14);
    db('users')
      .insert(user)
      .then(id => {
        if (id.length) {
          res
            .status(201)
            .json({
              message: `thanks for registering, ${
                user.username
              }. You can now sign in.`,
            });
        } else {
          res.status(500).json({ error: 'something bad happened.' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: `there was an error: ${err}` });
      });
  }
});

server.post('/login', (req, res) => {
  const creds = req.body;
  // ensure password and username were sent
  if (!creds.password || !creds.username) {
    res.status(400).json({ error: 'please provide a username and password' });
    return null;
  }
  // ensure password and username are valid
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
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


server.get('/users/department', lock, (req, res) => {
  // find current user's department
  let department;
  console.log(req.decodedToken);

  db('users')
    .where({ username: req.decodedToken.username })
    .first()
    .then(user => {

      department = user.department;
      db('users')
        .where({ department })
        .then(list => {

          res.status(200).json(list);
        });
    })
    .catch(err => {
      res.status(500).json({error: `there was an error accessing the database: ${err}`})
    })
});

server.get('/users', lock, (req, res) => {
  console.log(req.decodedToken);

  db('users')
    .select('username', 'department')
    .then(userList => {
      res.status(200).json(userList);
    })
    .catch(err => {
      res
        .status(400)
        .json({ error: `there was an error accessing the database: ${err}` });
    });
});

module.exports = server;
