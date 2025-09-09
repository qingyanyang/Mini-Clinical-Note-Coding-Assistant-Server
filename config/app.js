
import 'dotenv/config';

const optionalConfigs = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'dev'
};

export default {
    ...optionalConfigs,
}