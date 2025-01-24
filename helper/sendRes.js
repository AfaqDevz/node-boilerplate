export default function sendRes(res, status, data, error, message) {
    res.status(status).json({
        error: error,
        data: data,
        message: message
    })
}