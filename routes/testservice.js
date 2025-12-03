const express = require('express')
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const learning_service_url = 'http://localhost:3002'
const {verifyTeacherToken} = require('../midlewares/tokenverify');


router.post('/create', verifyTeacherToken, async (req, res) => {
    try {
        const { classID, testtitle, subject, participants, closedDate } = req.body;
        const teacherID = req.user.userId;
        console.log(req.body)
        const response = await axios.post(
            `${learning_service_url}/api/test/create`,
            {
                classID,
                teacherID,
                testtitle,
                subject,
                participants,
                closedDate
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Test created successfully",
            data: response.data
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error creating test",
            error: error.response?.data || error.message
        });
    }
});

router.get('/get', verifyTeacherToken, async (req, res) => {
    try {
        const teacherID = req.user.userId;
        console.log('Gateway - req.user:', req.user);
        console.log('Gateway - teacher id:', teacherID);
        
        if (!teacherID) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID not found in token"
            });
        }
        
        const response = await axios.get(
            `${learning_service_url}/api/test/get/${teacherID}`,
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Gateway Error:', error.message);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.get('/data/:testid', verifyTeacherToken, async (req, res) => {
    try {
        const { testid } = req.params;

        if (!testid) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: testid"
            });
        }

        const response = await axios.get(
            `${learning_service_url}/api/test/data/${testid}`,
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Test data fetched successfully",
            data: response.data
        });

    } catch (error) {
        console.error('Error fetching test data:', error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.post('/question/add', verifyTeacherToken, async (req, res) => {
    try {
        const {
            testid,
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata,
            options
            
        } = req.body;
        console.log(req.body)
        // Kiểm tra thiếu field
        if (!testid || !difficult || !question || !questionType || !grade || !solution) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

   
        const response = await axios.post(
            `${learning_service_url}/api/question/create`,
            {
                testid,
                difficult,
                question,
                questionType,
                grade,
                solution,
                metadata,
                options
                
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Question added successfully",
            data: response.data
        });

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.get('/question/fetch/:testid', verifyTeacherToken, async (req, res) => {
    try {
        const { testid } = req.params;
        console.log(testid)
        // Validate param
        if (!testid) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: testid"
            });
        }

        const response = await axios.get(
            `${learning_service_url}/api/question/fetch/${testid}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Error fetching test questions:', error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
});

router.put('/question/edit', verifyTeacherToken, async (req, res) => {
    try {
        const {
            questionId,
            testid,
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata
        } = req.body;

        // Validate
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: questionId"
            });
        }

        const response = await axios.put(
            `${learning_service_url}/api/question/edit`,
            {
                questionId,
                testid,
                difficult,
                question,
                questionType,
                grade,
                solution,
                metadata
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: response.data
        });

    } catch (error) {
        console.error('Error updating question:', error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.response?.data || error.message
        });
    }
});

router.post('/question/delete', verifyTeacherToken, async (req, res) => {
    try {
        const { questionIds } = req.body;

        // Validate
        if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Missing required field: questionIds (array)"
            });
        }

        const response = await axios.post(
            `${learning_service_url}/api/question/delete`,
            {
                questionIds
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Questions deleted successfully",
            data: response.data
        });

    } catch (error) {
        console.error('Error deleting questions:', error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.response?.data || error.message
        });
    }
});

module.exports = router