const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким ID не найден' });
        return;
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.send(user);
        })
        .catch((err) => {
          if (err._message === 'user validation failed') {
            res.status(400).send({ message: err.message });
            return;
          }
          if (err._message === '') {
            res.status(500).send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((err) => {
      res.send({ message: err });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err._message === 'Validation failed') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err._message === 'Validation failed') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
