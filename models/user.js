const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `Ссылка ${props.value} не проходит валидацию!`,
    },
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `Email ${props.value} не проходит валидацию!`,
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
