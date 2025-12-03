const Class = require('../schemas/class_schema')
const ClassStudent = require('../schemas/class_student')

// Create a new class
const createClass = async (req, res) => {
    try {
        const { class_code, class_subject, class_year, class_teacher, class_avarage_grade } = req.body;
        console.log('Request body:', req.body);

        // Validate required fields
        if (!class_code || !class_subject || !class_year || !class_teacher || class_avarage_grade === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: class_code, class_subject, class_year, class_teacher, class_avarage_grade'
            });
        }

        // Create new class instance
        const newClass = new Class({
            class_code: class_code.trim(),
            class_subject: class_subject.trim(),
            class_year: class_year.trim(),
            class_student_count: 0,
            class_teacher: class_teacher.trim(),
            class_avarage_grade: Number(class_avarage_grade)
        });

        // Save to database
        const savedClass = await newClass.save();

        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            data: savedClass
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Error creating class',
            error: error.message
        });
    }
};

// Get classes by teacher
const getTeacherClass = async (req, res) => {
    try {
        const { teacher_id } = req.params;
        console.log(teacher_id)
        // Validate teacher
        if (!teacher_id) {
            return res.status(400).json({
                success: false,
                message: 'class_teacher is required'
            });
        }

        // Find all classes by teacher
        const classes = await Class.find({ class_teacher : teacher_id });

        if (!classes || classes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No classes found for this teacher'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Classes retrieved successfully',
            data: classes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving classes',
            error: error.message
        });
    }
};
const getAllClass = async (req, res) => {
    try {
      
        // Find all classes by teacher
        const classes = await Class.find();

        if (!classes || classes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No classes found for this teacher'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Classes retrieved successfully',
            data: classes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving classes',
            error: error.message
        });
    }
};


// Delete a class by ID
const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user || JSON.parse(req.headers.user || '{}');

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Class ID is required'
            });
        }

        // Find the class
        const classToDelete = await Class.findById(id);

        if (!classToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        // Check if user is the teacher of this class
        if (classToDelete.class_teacher !== userInfo.userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only the class teacher can delete this class'
            });
        }

        // Delete the class
        const deletedClass = await Class.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Class deleted successfully',
            data: deletedClass
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting class',
            error: error.message
        });
    }
};


const studentEnroll = async (req,res) => {

    try {
        const {studentid , classid } = req.body;
        
        
        const isExist = await ClassStudent.findOne({studentID : studentid  , classID : classid})
        
        if(isExist){
         res.status(409).json({
            success: false,
            message: "File đã tồn tại trong hệ thống."
        });
        }
        
        const doc = new ClassStudent({
            studentID: studentid,
            classID: classid,
            timeJoin: new Date()
        })

        const savedDoc = await doc.save();

        return res.status(200).json({
            success: true,
            message: "Enroll thành công.",
            data: savedDoc
        });
    } catch (error) {
         console.error("Error enroll:", error);
        return res.status(500).json({
            success: false,
            message: "Server error.",
            error: error.message
        });
    }

}

module.exports = {
    createClass,
    deleteClass,
    studentEnroll,
    getTeacherClass,
    getAllClass 
};