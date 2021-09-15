import { Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import dirname from 'es-dirname';

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const models = {
  connection,
  Sequelize,
};

const modelList = readdirSync(dirname()).filter((file) => file.slice('-9') === '.model.js');

connection.authenticate().then(async () => {
  for (const file of modelList) {
    const { default: modelFile } = await import(`./${file}`);
    const model = modelFile(connection);
    models[model.name] = model;
  }
  connection.sync({ alter: true });
});

export default models;
