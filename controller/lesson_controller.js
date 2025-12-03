const Lesson = require('../schemas/lesson')

// Create a new lesson
const createLesson = async (req, res) => {
    try {
        const { classid, teacherid, name, timeCreated, desc, answer ,  metadata } = req.body;

        if (!classid || !teacherid || !name || !desc || !metadata) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newLesson = new Lesson({
            classid,
            teacherid,
            name,
            timeCreated: timeCreated || new Date(),
            desc,
            metadata: " "
        });

        const savedLesson = await newLesson.save();
        res.status(201).json({
            message: 'Lesson created successfully',
            lesson: savedLesson
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating lesson',
            error: error.message
        });
    }
};

// Get all lessons
const getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find()
            .populate('classid')
            .populate('teacherid');
        res.status(200).json({
            message: 'Lessons retrieved successfully',
            lessons: lessons
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving lessons',
            error: error.message
        });
    }
};

// Get lesson by ID
const getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id)
            .populate('classid')
            .populate('teacherid');
        
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json({
            message: 'Lesson retrieved successfully',
            lesson: lesson
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving lesson',
            error: error.message
        });
    }
};

// Update lesson
const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { classid, teacherid, name, desc, metadata } = req.body;

        const updatedLesson = await Lesson.findByIdAndUpdate(
            id,
            {
                classid,
                teacherid,
                name,
                desc,
                metadata
            },
            { new: true, runValidators: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json({
            message: 'Lesson updated successfully',
            lesson: updatedLesson
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating lesson',
            error: error.message
        });
    }
};

// Delete lesson
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLesson = await Lesson.findByIdAndDelete(id);

        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.status(200).json({
            message: 'Lesson deleted successfully',
            lesson: deletedLesson
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting lesson',
            error: error.message
        });
    }
};

module.exports = {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson
};