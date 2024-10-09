const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Bankend Error';
    const extraDetails = err.extraDetails || 'Error from Bankend';

    return res.status(status).json({ message, extraDetails })
}
module.exports = errorMiddleware;