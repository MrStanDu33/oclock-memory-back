import Express from 'express';
import authWithGuest from '$src/middlewares/authWithGuest';
import GameController from '$src/controllers/Game';

const Router = Express();

Router.get('/', authWithGuest, GameController.getAll);
Router.post('/', authWithGuest, GameController.create);
Router.get('/:gameId', authWithGuest, GameController.getOne);
Router.put('/:gameId', authWithGuest, GameController.updateOne);
Router.delete('/:gameId', authWithGuest, GameController.deleteOne);

export default Router;
