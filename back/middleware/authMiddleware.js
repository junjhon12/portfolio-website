const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Get the token from the request header.
    // On the frontend, we'll send it as "Authorization": "Bearer <token>"
    const token = req.header('Authorization');

    // Check for token
    if (!token) {
        // 401 means Unauthorized
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // The token comes in the format "Bearer <token>", so we split it and get just the token part.
        const tokenOnly = token.split(' ')[1];

        // Verify the token using your JWT_SECRET
        const decoded = jwt.verify(tokenOnly, process.env.JWT_SECRET);

        // Add the user payload from the token to the request object
        // so our protected routes can access it (e.g., req.user.id)
        req.user = decoded.user;

        // Call next() to pass control to the next middleware function (i.e., the route handler)
        next();

    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;