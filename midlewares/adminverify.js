const jwt = require('jsonwebtoken');



 const adminVerify = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token không được cung cấp' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = jwt.verify(token, secret);

        // kiểm tra trường urole trong payload
        if (!decoded || decoded.urole !== 'admin') {
            return res.status(403).json({ message: 'Yêu cầu quyền admin' });
        }

        // gắn thông tin người dùng đã giải mã vào req để dùng ở handler tiếp theo
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ', error: err.message });
    }
};
module.exports = {
    adminVerify
};