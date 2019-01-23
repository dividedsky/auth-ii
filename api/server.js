require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());

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
    res.status(200).json({message: `thanks for registering, ${user.username}. You can now sign in.`})
        } else {
          res.status(500).json({error: 'something bad happened.'})
        }
      })
      .catch(err => {
        res.status(500).json({error: `there was an error: ${err}`})
      })
  } 
})

module.exports = server;
