require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const cors = require('cors');
const db = knex(knexConfig.development);

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());
server.use(cors({ credentials: true, origin: 'http://localhost:3000'} ));

server.get('/', (req, res) => {
  res.status(200).send('wheee, the server is running')
})

function generateToken(user) {
  const payload = {
    username: user.username,
  }

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '10m',
  }

  return jwt.sign(payload, secret, options);
}

server.post('/register', (req, res) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.status(400).json({error: 'user must have a username and password'})
  } else {
    user.password = bcrypt.hashSync(user.password, 14);
    db('users').insert(user)
      .then(id => {
        if (id.length) {
    res.status(201).json({message: `thanks for registering, ${user.username}. You can now sign in.`})
        } else {
          res.status(500).json({error: 'something bad happened.'})
        }
      })
      .catch(err => {
        res.status(500).json({error: `there was an error: ${err}`})
      })
  } 
})

server.post('/login', (req, res) => {
  const creds = req.body;
  // ensure password and username were sent
  if (!creds.password || !creds.username) {
    res.status(400).json({error: 'please provide a username and password'})
    return null;
  }
  // ensure password and username are valid
  db('users').where({username: creds.username}).first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // username and password are a match, generate token and return
        const token = generateToken(user);
        res.status(200).json({ message: `welcome, ${user.username}`, token })
      } else {
        // username and/or password are invalid
        res.status(401).json({error: `invalid username or password`})
      }
    })
    .catch(err => {
      res.status(500).json({error: `there was an error accessing the database: ${err}`})
    })
})

const lock = ( req, res, next ) => {
  // check JWT to be sure user is logged in
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({error: 'invalid token'})
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  }
}

server.get('/users', lock, (req, res) => {
  db('users').select('username', 'department')
    .then(userList => {
      res.status(200).json(userList);
    })
    .catch(err => {
      res.status(400).json({error: `there was an error accessing the database: ${err}`})
    })
})

module.exports = server;
