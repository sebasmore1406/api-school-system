const express = require('express');
const dotenv = require( 'dotenv');
const cors = require( 'cors');
const connectDB = require( './config/db.js');
const authRoutes = require ('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server up and ready on port ${PORT}!`)
});