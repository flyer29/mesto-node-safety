const jwt = require('jsonwebtoken');

const key = 'a06963e97a290c279d1a6eedec59d9000a968e22fdcf239bdc5ec2b1a78b7cae';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

module.exports = {
  auth,
};
