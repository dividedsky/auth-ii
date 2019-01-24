const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.generateToken = (user) => {
  const payload = {
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '10m',
  };

  return jwt.sign(payload, secret, options);
}

exports.lock = (req, res, next) => {
  // check JWT to be sure user is logged in
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ error: 'invalid token' });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  }
};
