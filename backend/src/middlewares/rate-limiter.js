import rateLimit from 'express-rate-limit'

export const loginRateLimit = rateLimit({
    windowMs: 10*60*1000,
    max: 5,

    keyGenerator: (req) => {
        const email = req.body?.email ? req.body.email.toLowerCase().trim() : '';
        return `login_limit:${req.ip}:${email}`;
    },

    handler: (req, res) => {
        return res.status(429).send('Too many failed tries. Try again later.')
    },

    skipSuccesfulRequests: true,
});


export const urlLimiter = rateLimit({

    windowMs: 24*60*60*1000,
    max: (req) => {
        return req.user ? 20 : 5;
    },

    keyGenerator: (req) => {
        if(req.user) {
            return `user:${req.user.id}`;
        }
        return `anon:${req.ip}`;
    },

    handler: (req, res) => {
        const isUser = Boolean(req.user);
        const limit = isUser ? 20:5;

        return res.status(429).json({
            error: isUser
                ? `You have reached your daily limit (${limit} URLs/day)`
                : `You have reached your free limit. Register for free to get more uses`
        });
    }
})