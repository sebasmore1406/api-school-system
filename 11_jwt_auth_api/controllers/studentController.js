const Student = require('../models/Student');
const User = require('../models/User');

// CRUD
// Create...
exports.createStudent = async (req, res, next) => {
    try {      
        if (req.user.role === req.role && req.role === 'admin') {
            const student = new Student(req.body);
            await student.save();
            res.status(201).json(student);
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err);
    }
};

// Read by filter...
exports.getAllStudents = async (req, res, next) => {
    try {
        // Obtenemos solamente dos de las propiedades del request
        if (req.user.role === req.role && req.role === 'admin') {
            const { career, minAverage } = req.query;
            const filter = { active: true };
            if (career) {
                filter.career = career;
            }
            if (minAverage) {
                filter.minAverage = { $gte: Number(minAverage) };
            }
            const students = await Student.find(filter).sort({ created: -1 });
            res.json(students);
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err);
    }
};

// Read by student ID...
exports.getStudentByID = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            let { q } = req.query;
            const student = await Student.findOne({
                studentID: q,
                active: true
            });
            if (!student) {
                return res.status(404).json({ message: 'Student not found, please check if ID is correct.' });
            }
            res.json(student);
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err);
    }
};

// Read students by name...
exports.getStudentByName = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            const { q } = req.query;
            const filter = { active: true };
            if (!q || q === '') {
                return res.status(404).json({ message: `You must specify Student's name.` });
            }
            filter.name = { $regex: q, $options: 'i' };
            const student = await Student.find(filter).sort({ name: 1 });
            res.json(student);
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err);
    }
}

// Update...
exports.updateStudent = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            let { q } = req.query;
            let student;
            if (isFinite(q)) {
                q = Number(q)
            student = await Student.findOneAndUpdate(
                { studentID: q, active: true },
                req.body,
                { new: true, runValidators: true }
            )
        } else {
            const filter = { active: true };
            filter.name = { $regex: q, $options: 'i' };
            student = await Student.findOneAndUpdate(
                filter,
                req.body,
                { new: true, runValidators: true }
            )
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found, please check if information is correct.' });
        }
        res.json(student)
    } else {
        res.status(401).json({message: `Unauthorized user.`})
    }
    } catch (err) {
        next(err);
    }
};

// Patch Courses...
exports.changeCourses = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            const student = await Student.findById(req.params.id);
            if (!student || !student.active) {
                return res.status(404).json({ message: 'Student not found, please check if Id is correct.' });
            }
            const previousCourses = student.courses;
            const { coursesToAdd, coursesToRemove } = req.body;
            if (coursesToAdd == [] && coursesToRemove == []) {
                return res.status(400).json({ message: 'Please choose an option.' });
            }
            let updatedStudent;
            let addAction;
            let removeAction;
            if (coursesToAdd != []) {
                for (let index = 0; index < previousCourses.length; index++) {
                    for (let jndex = 0; jndex < coursesToAdd.length; jndex++) {
                        if (previousCourses[index] === coursesToAdd[jndex]) {
                            console.log(`Student already enrolled in course ${coursesToAdd[jndex]}.`);
                            coursesToAdd.splice(jndex, 1);
                            break;
                        }
                    }
            }
            // $addToSet evita duplicados... me hubiera ahorrado todo esto...
            addAction = { $push: { courses: { $each: coursesToAdd } } };
            updatedStudent = await Student.findByIdAndUpdate(req.params.id, addAction, {
                new: true, query: { active: true }
            });
            
        }
        if (coursesToRemove != []) {
            removeAction = { $pull: { courses: { $in: coursesToRemove } } };
            updatedStudent = await Student.findByIdAndUpdate(req.params.id, removeAction, {
                new: true, query: { active: true }
            });
        }
    } else {
        res.status(401).json({message: `Unauthorized user.`})
    }
        res.json(updatedStudent);
    } catch (err) {
        next(err);
    }
};

// Delete...
/*
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({
                message: 'Student not found, check if Id is correct'
                });
                }
                res.json({ message: 'Student successfully deleted' });
                } catch (err) {
                    next(err);
                    }
                    };*/
                    
exports.softDeleteStudent = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found, please check if ID is correct.' });
            }
            if (!student.active) {
                return res.status(409).json({ message: 'This student is already deleted.' });
            }
            student.active = false;
            await student.save();
            res.json({ message: 'Student successfully deleted.' })
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err)
    }
};

exports.restoreStudent = async (req, res, next) => {
    try {
        if (req.user.role === req.role && req.role === 'admin') {
            const student = await Student.findById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found, please check if ID is correct.' });
            }
            if (student.active) {
                return res.status(409).json({ message: 'This student is not deleted.' });
            }
            student.active = true;
            await student.save();
            res.json({ message: 'Student successfully restored.' })
        } else {
            res.status(401).json({message: `Unauthorized user.`})
        }
    } catch (err) {
        next(err)
    }
};