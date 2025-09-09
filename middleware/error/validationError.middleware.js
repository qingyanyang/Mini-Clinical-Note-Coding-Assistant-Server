
export default (err, req, res, next) => {
    if (err?.name === 'ZodError' && Array.isArray(err.issues)) {
        const details = err.issues.map(i => ({
            path: i.path?.join('.') || '(root)',
            message: i.message,
        }));
        return res.formatResponse({ message: 'Validation failed', details }, 400);
    }
    next(err);
}