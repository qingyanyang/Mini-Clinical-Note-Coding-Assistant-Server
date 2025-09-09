import NotFoundException from "../../exceptions/notFoundException.js";

export default (err, req, res, next) => {
    if (err instanceof NotFoundException) {
        res.status(404).json({ error: err.message });
        return;
    }
    next(err);
}