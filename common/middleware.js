const jwt = require('jsonwebtoken');
const {getUserDepartment} = require('../data/dbHelpers');

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

exports.ensureValidUser = (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    res.status(400).json({ error: 'user must have a username and password' });
  } else {
    next();
  }
}

exports.checkDepartment = async (req, res, next) => {
  const userInfo = await getUserDepartment(req.decodedToken.username);
  const userDept = userInfo.department;
  const dept = req.params.department;
  
  if (userDept !== dept) {
    res.status(403).json({error: `stay in the ${userDept} department! You do not have access to the ${dept} department list.`})
  }
  else {
    next();
  }
}
