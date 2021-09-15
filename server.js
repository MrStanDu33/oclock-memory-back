// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv/config';
import http from 'http';
import app from './src';

app.set('port', 3000);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // eslint-disable-next-line no-use-before-define
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : 'port: 3000';
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// je créé un serveur en utilisant l'Http auquel je rattache l'app Express
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : 'port: 3000';
  console.log(`listening on ${bind}`);
});

// ecouter les requetes envoyées
server.listen(3000);
