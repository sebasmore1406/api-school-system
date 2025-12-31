const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    // Checamos que mande una autorización, y que los encabezados empiecen con Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            req.role = req.user.role;
            next();
        } catch (e) {
            res.status(401).json({ message: 'Invalid or expired token.' });
        }
    } else {
        res.status(401).json({ message: 'Token not provided.' });
    }
}