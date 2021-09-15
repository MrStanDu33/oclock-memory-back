import Express from 'express';
import userRouter from '$src/router/User';

const App = Express();

App.use(Express.json());

App.use('/api/v1/user', userRouter);

export default App;
