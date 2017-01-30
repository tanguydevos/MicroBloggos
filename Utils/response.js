module.exports = {
    success: function(res, message) {
        res.json({
            success: true,
            message: message
        });
    },
    error: function(res, statusCode, message) {
        res.status(statusCode).json({
            success: false,
            message: message
        });
    }
}
