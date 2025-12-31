const express = require('express');

const studentRouter = express.Router();

// Jalamos el middleware 
const { protect } = require('../middleware/authMiddleware');

const controller = require('../controllers/studentController');

studentRouter.route('/registerStudent').post(protect, controller.createStudent);
studentRouter.route('/getAllStudents').get(protect, controller.getAllStudents);

module.exports = studentRouter;