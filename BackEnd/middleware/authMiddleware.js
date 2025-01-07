const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/user/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        console.error('JWT Authentication Error:', err.message);
        res.status(401).json({ error: 'Token is not valid!' });
    }
};

module.exports = authenticate;
