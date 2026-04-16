import { Router } from 'express';

import router from '../modules/auth/auth.routes';
import moviesRouter from '../modules/movies/movies.routes';


const appRouter = Router();

appRouter.use('/auth', router);
appRouter.use('/movies', moviesRouter);







export { appRouter };