import rateLimit from 'express-rate-limit'

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: {
            code: 'TOO_MANY_REQUESTS',
            message: 'Too many requests, please try again after 15 minutes.'
        }
    }
})

export default rateLimiter
