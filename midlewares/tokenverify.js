const jwt = require('jsonwebtoken');

const verifyStudentToken = (req ,res ,next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token){
        return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp'
      });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here')
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
const verifyTeacherToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
    
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

module.exports = { verifyStudentToken,verifyTeacherToken}