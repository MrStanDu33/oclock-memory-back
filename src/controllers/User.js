import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '$src/models';

const validateCreationInput = (data) => {
  const keys = ['firstName', 'lastName', 'username', 'email', 'password', 'avatar'];
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = data[key];
    if (!value || typeof value !== 'string' || value.length === '0') return false;
  }
  return true;
};

const validateLoginInput = (data) => {
  const keys = ['email', 'password'];
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = data[key];
    if (!value || typeof value !== 'string' || value.length === '0') return false;
  }
  return true;
};

export default {
  async create(req, res) {
    if (!validateCreationInput(req.body)) {
      return res.status(400).json({
        message: 'Sent datas does not match prerequisites',
      });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, process.env.BCRYPT_SALT);

    const userExist = await models.User.findOne({
      where: {
        [models.Sequelize.Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (userExist) {
      return res.status(409).json({
        message: 'Username or email already used',
      });
    }

    const createdUser = await models.User.create({
      ...req.body,
      password: hashedPassword,
      isAdmin: false,
    });

    if (req.withAuth) {
      const accessToken = jwt.sign(
        {
          user: createdUser,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2h' },
      );
      return res.status(201).json({ user: createdUser, accessToken });
    }
    return res.status(201).json(createdUser);
  },

  async login(req, res) {
    if (!validateLoginInput(req.body)) {
      return res.status(400).json({
        message: 'Sent datas does not match prerequisites',
      });
    }

    const userToLog = await models.User.findOne({ where: { email: req.body.email } });

    if (!userToLog) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const passwordMatch = bcrypt.compareSync(req.body.password, userToLog.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid login credentials.',
      });
    }

    const accessToken = jwt.sign(
      {
        user: userToLog,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    );

    return res.status(200).json({ user: userToLog, accessToken });
  },

  async getAll(_req, res) {
    const users = await models.User.findAll({ include: [{ model: models.Game }] });
    return res.status(200).json(users);
  },

  async getOne(req, res) {
    const { userId } = req.params;

    const user = await models.User.findOne({
      where: { id: userId },
      include: [{ model: models.Game }],
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json(user);
  },

  async updateOne(req, res) {
    const { userId } = req.params;

    if (!req.token.user.isAdmin && req.token.user.id !== userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!validateCreationInput(req.body)) {
      return res.status(400).json({
        message: 'Sent datas does not match prerequisites',
      });
    }

    const userExist = await models.User.findOne({
      where: {
        [models.Sequelize.Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
    });

    if (userExist) {
      return res.status(409).json({
        message: 'Username or email already used',
      });
    }

    const userToUpdate = await models.User.findOne({ where: { id: userId } });

    if (!userToUpdate) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, process.env.BCRYPT_SALT);

    await models.User.update({ ...req.body, password: hashedPassword }, { where: { id: userId } });

    const updatedUser = await models.User.findOne({
      where: { id: userId },
      include: [{ model: models.Game }],
    });

    return res.status(200).json(updatedUser);
  },

  async deleteOne(req, res) {
    const { userId } = req.params;

    if (!req.token.user.isAdmin && req.token.user.id !== userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const userToDelete = await models.User.findOne({
      where: { id: userId },
      include: [{ model: models.Game }],
    });

    if (!userToDelete) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    models.User.destroy({ where: { id: userId } });

    return res.status(200).json(userToDelete);
  },
  getGuestToken(_req, res) {
    const accessToken = jwt.sign(
      {
        guest: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    );

    return res.status(200).json({ accessToken });
  },
};
