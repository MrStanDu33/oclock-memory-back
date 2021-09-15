import Express from 'express';
import auth from '$src/middlewares/auth';
import UserController from '$src/controllers/User';

const Router = Express();

Router.post(
  '/signup',
  (req, _res, next) => {
    req.withAuth = true;
    next();
  },
  UserController.create,
);
Router.post('/login', UserController.login);
Router.get('/', auth, UserController.getAll);
Router.post('/', auth, UserController.create);
Router.get('/:userId', auth, UserController.getOne);
Router.put('/:userId', auth, UserController.updateOne);
Router.delete('/:userId', auth, UserController.deleteOne);
Router.post('/guest', UserController.getGuestToken);

export default Router;
