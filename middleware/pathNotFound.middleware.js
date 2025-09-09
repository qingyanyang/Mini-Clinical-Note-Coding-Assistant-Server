export default (req, res) => {
    res.formatResponse(`Path ${req.originalUrl} not found`, 404);
}