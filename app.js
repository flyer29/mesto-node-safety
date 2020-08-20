const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cards.js');
const usersRouter = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const urlDoesNotExist = (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
};

const getTemporaryId = (req, res, next) => {
  req.user = {
    _id: '5f2980dc025e002380f12ec4',
  };
  next();
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(getTemporaryId);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/signup', createUser);
app.use('/signin', login);
app.use('*', urlDoesNotExist);
app.listen(PORT);
