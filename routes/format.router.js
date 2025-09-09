import { Router } from 'express';
import { createFormatTranscript } from '../controllers/format.controller.js';

const FormatRouter = Router();

FormatRouter.post('/', createFormatTranscript);

export default FormatRouter;