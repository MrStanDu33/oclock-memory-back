import Express from 'express';
import cors from 'cors';
import userRouter from '$src/router/User';
import gameRouter from '$src/router/Game';

const App = Express();

App.use(cors());

App.use(Express.json());

App.use('/api/v1/user', userRouter);
App.use('/api/v1/game', gameRouter);

export default App;
