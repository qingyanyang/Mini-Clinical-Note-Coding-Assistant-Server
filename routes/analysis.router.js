import { Router } from 'express';
import { createAnalysis } from '../controllers/analysis.controller.js';

const AnalysisRouter = Router();

AnalysisRouter.post('/', createAnalysis);

export default AnalysisRouter;