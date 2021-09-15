import Express from 'express';
import auth from '$src/middlewares/auth';
import GameController from '$src/controllers/Game';

const Router = Express();

Router.get('/', auth, GameController.getAll);
Router.post('/', auth, GameController.create);
Router.get('/:gameId', auth, GameController.getOne);
Router.put('/:gameId', auth, GameController.updateOne);
Router.delete('/:gameId', auth, GameController.deleteOne);

export default Router;
