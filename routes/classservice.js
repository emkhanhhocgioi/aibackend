const express = require('express')
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const learning_service_url = 'http://localhost:3002'

// Middleware to verify token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
    }
}

// Middleware to verify teacher token
const verifyTeacherToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token không được cung cấp'
            });
        }

        const decoded = jwt.verify(token, 'you_secret_key_here');
        
        // // Check if user is a teacher
        // if (decoded.role !== 'teacher' && !decoded.teacherId) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Chỉ giáo viên mới có thể thực hiện hành động này'
        //       });
        // }
        
        req.user = decoded;
        next();
    } catch (error) {
      
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
    }
}



router.post('/create', verifyTeacherToken, async (req, res) => {
    try {
        const userInfo = req.user;
        console.log('User Info:', req.user);

        const { class_code ,class_subject,class_year} = req.body;
        console.log(class_code);
        console.log(userInfo.userId)
        // Validate required fields
        if (!class_code) {
            return res.status(400).json({
                success: false,
                message: 'class_code is required'
            });
        }

        // Thay vì gửi cả object, gửi từng key-value riêng
        const response = await axios.post(
            `${learning_service_url}/api/class/create`,
            {
                class_code: class_code,
                class_subject: class_subject,
                class_teacher: userInfo.userId,
                class_year: class_year,
            
                class_avarage_grade: 0
            },
            { headers: { user: JSON.stringify(userInfo) } }
        );

        return res.json({
            success: true,
            decodedUser: userInfo,
            serviceResponse: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Không thể tạo class",
            error: error.message
        });
    }
});

router.get('/get', verifyTeacherToken, async (req, res) => {
    try {
        const userInfo = req.user;
      

        // Gọi API đến learning service để lấy danh sách lớp của giáo viên
        const response = await axios.get(
            `${learning_service_url}/api/class/teacher/${userInfo.userId}`,
            { headers: { user: JSON.stringify(userInfo) } }
        );

        return res.json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách lớp",
            error: error.message
        });
    }
});

router.delete('/delete/:id', verifyTeacherToken, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;

        // Validate class ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Class ID is required'
            });
        }

        // Gọi API đến learning service để xóa lớp
        const response = await axios.delete(
            `${learning_service_url}/api/class/${id}`,
            { headers: { user: JSON.stringify(userInfo) } }
        );

        return res.json({
            success: true,
            message: 'Class deleted successfully',
            data: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Không thể xóa class",
            error: error.message
        });
    }
});

router.post('/enroll', async (req, res) => {
    try {
        const userInfo = req.user;
        const { studentid, classid } = req.body;
        console.log(req.body)
        // Validate required fields
        if (!studentid || !classid) {
            return res.status(400).json({
                success: false,
                message: 'studentid and classid are required'
            });
        }

        // Gọi API đến learning service để đăng ký học sinh vào lớp
        const response = await axios.post(
            `${learning_service_url}/api/class/enroll`,
            {
                studentid: studentid,
                classid: classid
            },
            { headers: { user: JSON.stringify(userInfo) } }
        );

        return res.json({
            success: true,
            message: 'Student enrolled successfully',
            data: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Không thể đăng ký học sinh",
            error: error.message
        });
    }
});
router.get('/all', async (req, res) => {
    try {
      
        const response = await axios.get(
            `${learning_service_url}/api/class/all`
        );

        return res.json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách lớp",
            error: error.message
        });
    }
});
module.exports = router