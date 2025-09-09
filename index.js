import config from "./config/app.js";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import formatResponseMiddleware from './middleware/formatResponse.middleware.js';
import pathNotFoundMiddleware from './middleware/pathNotFound.middleware.js';
import validationErrorMiddleware from './middleware/error/validationError.middleware.js';
import notFoundErrorMiddleware from './middleware/error/notFoundError.middleware.js';
import unknownErrorMiddleware from './middleware/error/unknownError.middleware.js';

import v1Router from './routes/index.js';
import db from './utils/db.js';

db.pragma('journal_mode = WAL');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(formatResponseMiddleware);
app.use('/api/v1', v1Router);
app.use(pathNotFoundMiddleware);
app.use(validationErrorMiddleware);
app.use(notFoundErrorMiddleware);
app.use(unknownErrorMiddleware);

// health check
app.get("/", (_, res) => {
    res.status(200).send("Server running.");
});

app.listen(Number(config.PORT), '0.0.0.0', () => {
    console.info(`Server listening on port ${config.PORT}`)
})