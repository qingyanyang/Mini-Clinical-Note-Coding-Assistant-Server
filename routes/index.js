import { Router } from 'express';
import analysisRouter from './analysis.router.js';
import FormatRouter from './format.router.js';


const v1Router = Router();

v1Router.use('/analysis', analysisRouter);
v1Router.use('/format', FormatRouter);

export default v1Router;