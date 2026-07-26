import rateLimit, {ipKeyGenerator} from 'express-rate-limit'

export const loginRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,

    keyGenerator: (req) => {
        const email = req.body?.email ? req.body.email.toLowerCase().trim() : '';
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        return `login_limit:${ip}:${email}`;
    },

    // AQUI: Deshabilitamos el check estricto de IPv6 para custom keyGenerators
    validate: {
        keyGeneratorIpFallback: false,
    },

    handler: (req, res) => {
        return res.status(429).send('Too many failed tries. Try again later.');
    },

    skipSuccessfulRequests: true,
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

    validate: { xForwardedForHeader: false, default: false },

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