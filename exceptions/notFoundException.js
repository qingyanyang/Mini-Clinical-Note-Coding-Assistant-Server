export default class NotFoundException extends Error {
    constructor(message = 'Not Found', details) {
        super(message);
        this.name = 'NotFoundException';
        this.status = 404;
        this.details = details;
    }
}