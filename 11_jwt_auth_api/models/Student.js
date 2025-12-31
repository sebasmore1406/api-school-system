const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentID: { type: Number, required: true, trim: true, unique: true },
    name:      { type: String, required: true, trim: true },
    age:       { type: Number, required: true, min: 0 },
    career:    { type: String, required: true },
    semester:  { type: Number, required: true, min: 1 },
    average:   { type: Number, required: true, min: 1, max: 10 },
    courses:   { type: [String], default: [] },
    active:    { type: Boolean, default: true },
    created:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema)