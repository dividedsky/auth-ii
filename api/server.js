const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).send('wheee, the server is running')
})

module.exports = server;
