import config from '../../config/app.js';

export default (err, req, res, next) => {
    console.error(`${err.message}\nstack: ${err.stack}`);

    res.formatResponse(
        "Unexpected error happened, please try again later",
        500,
        config.NODE_ENV === 'dev' && { stack: err.stack }
    );
}