const Student = require('../schema/student');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Function đăng ký tài khoản học sinh
const registerStudent = async (req, res) => {
    try {
        const { name, email, password, className, grade } = req.body;

        // Kiểm tra email đã tồn tại
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo học sinh mới
        const newStudent = new Student({
            name,
            email,
            password: hashedPassword,
            class: className,
            grade
        });

        // Lưu vào database
        await newStudent.save();

        res.status(201).json({
            message: "Tạo tài khoản thành công",
            student: {
                id: newStudent._id,
                name: newStudent.name,
                email: newStudent.email,
                class: newStudent.class,
                grade: newStudent.grade
            }
        });

    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
// Funtion tạo lượng lớn tài khoản cho học sinh
const createManyStudents = async (req, res) => {
  try {
    let students = req.body.students || req.body;
    
    console.log("Received data:", students)
    console.log("Is array?", Array.isArray(students))
    
    // Nếu students không phải mảng
    if (!Array.isArray(students)) {
      // Nếu req.body là một object (học sinh đơn lẻ)
      if (req.body.email && req.body.name && !req.body.students) {
        students = [req.body];
      } 
      else {
        return res.status(400).json({ message: "Students array is required. Expected format: {students: [...]}" });
      }
    }
    
    // Đảm bảo students không trống
    if (students.length === 0) {
      return res.status(400).json({ message: "Students array cannot be empty" });
    }

    console.log("Creating", students.length, "students");

    // Hash password cho từng học sinh
    const hashedStudents = await Promise.all(
      students.map(async (student) => {
        if (student.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(student.password, salt);
          return { ...student, password: hashedPassword };
        }
        return student;
      })
    );

    // Lưu hàng loạt
    const result = await Student.insertMany(hashedStudents);

    res.status(200).json({
      success: true,
      inserted: result.length,
      message: "Students created successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create students", error });
  }
};
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm học sinh theo email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Kiểm tra mật khẩu
        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { 
              userId: student._id.toString(),
              email: student.email,
              role: 'student',
              iat: Date.now()
            },
            process.env.JWT_SECRET || 'your_secret_key_here',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                class: student.class,
                grade: student.grade
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};




// Function lấy tất cả thông tin học sinh (không bao gồm password)
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).select('-password');
        
        res.status(200).json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách học sinh:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    createManyStudents,
    getAllStudents
};