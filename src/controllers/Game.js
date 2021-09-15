import models from '$src/models';

const validateInput = (data) => {
  if (data.status && typeof data.status !== 'boolean') return false;
  if (data.timeLeft && typeof data.timeLeft !== 'number') return false;
  return true;
};

export default {
  async create(req, res) {
    if (!validateInput(req.body)) {
      return res.status(400).json({
        message: 'Sent datas does not match prerequisites',
      });
    }

    const createdGame = await models.Game.create({
      ...req.body,
      UserId: req.token.user.id,
    });

    return res.status(201).json(createdGame);
  },

  async getAll(_req, res) {
    const games = await models.Game.findAll({ include: [{ model: models.User }] });
    return res.status(200).json(games);
  },

  async getOne(req, res) {
    const { gameId } = req.params;

    const game = await models.Game.findOne({
      where: { id: gameId },
      include: [{ model: models.User }],
    });

    if (!game) {
      return res.status(404).json({
        message: 'Game not found',
      });
    }

    return res.status(200).json(game);
  },

  async updateOne(req, res) {
    if (!validateInput(req.body)) {
      return res.status(400).json({
        message: 'Sent datas does not match prerequisites',
      });
    }

    const { gameId } = req.params;

    const gameToUpdate = await models.User.findOne({ where: { id: gameId } });

    if (!gameToUpdate) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!req.token.user.isAdmin && req.token.user.id !== gameToUpdate.UserId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    await models.Game.update({ ...req.body, UserId: req.token.user.id }, { where: { id: gameId } });

    const updatedGame = await models.Game.findOne({
      where: { id: gameId },
      include: [{ model: models.User }],
    });

    return res.status(200).json(updatedGame);
  },

  async deleteOne(req, res) {
    const { gameId } = req.params;

    const gameToDelete = await models.Game.findOne({ where: { id: gameId } });

    if (!gameToDelete) {
      return res.status(404).json({
        message: 'Game not found',
      });
    }

    if (!req.token.user.isAdmin && req.token.user.id !== gameToDelete.UserId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    models.Game.destroy({ where: { id: gameId }, include: [{ model: models.User }] });

    return res.status(200).json(gameToDelete);
  },
};
