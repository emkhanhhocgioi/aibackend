const express = require('express')
const axios = require('axios');
const router = express.Router();
const {verifyTeacherToken} = require('../midlewares/tokenverify')

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// Function gọi API từ auth service
const getAllStudentsFromService = async (req, res) => {
    try {
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/students/all`);
        
        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Lỗi gọi auth service:', error);
        res.status(error.response?.status || 500).json({ 
            message: "Không thể lấy danh sách học sinh",
            error: error.message
        });
    }
};

router.get('/all', getAllStudentsFromService);

module.exports = router;