import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import optionalConfigs from '../config/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = resolve(__dirname, '../data/database.db')

fs.mkdirSync(dirname(DB_PATH), { recursive: true });
fs.accessSync(dirname(DB_PATH), fs.constants.W_OK);

const options = {
    verbose: optionalConfigs.NODE_ENV === 'dev' ? console.log : null,
    readonly: false,
    fileMustExist: false,
};

const db = new Database(DB_PATH, options);

export default db;
