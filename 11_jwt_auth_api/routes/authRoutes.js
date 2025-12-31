const express = require ('express');
const { registerUser, loginUser, userProfile } = require ('../controllers/authController');
const authRouter = express.Router();
const { protect } = require('../middleware/authMiddleware');

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.route('/profile').post(protect, userProfile);

module.exports = authRouter;