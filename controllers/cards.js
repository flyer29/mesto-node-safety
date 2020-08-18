const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'card validation failed') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
