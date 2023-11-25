import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  console.log("verifyToken middleware is being called");

    try {
        let token;

        // Check headers
        if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '').trim();
        }

        // Check query parameters
        if (!token && req.query.token) {
            token = req.query.token.trim();
        }

        // Check cookies
        if (!token && req.cookies.token) {
            token = req.cookies.token.trim();
        }

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            // Token has expired
            return res.status(401).json({ error: 'Token has expired' });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};
