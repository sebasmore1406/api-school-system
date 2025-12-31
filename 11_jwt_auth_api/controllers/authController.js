const jwt = require('jsonwebtoken');
const User = require('../models/User');

// jwt firmado es una cadena encriptada que nos permite transaccionar entre cliente y servidor
// como una llave, el token abre la API para que el cliente la pueda utilizar

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const user = await User.create({ userName, email, password, role });
        res.status(201).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            token: generateToken(user._id, user.role)
        });
    } catch (e) {
        res.status(500).json({ message: `Error while creating user: ${e.message}` })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Wrong credentials' })
    }
}

exports.userProfile = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.status(200).json({
            userName: user.userName,
            email: user.email,
            role: user.role
        })
    } else {
        res.status(404).json({ message: 'User not found' })
    }
}