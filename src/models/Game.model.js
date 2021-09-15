import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;

export default (connection) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  connection.define(
    'Game',
    {
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      timeLeft: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {},
  );
