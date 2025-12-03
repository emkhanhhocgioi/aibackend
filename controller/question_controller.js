const { default: mongoose } = require('mongoose');
const Question = require('../schemas/test_question')

const addQuestion = async (req, res) =>{
    try {
        const  {testid , difficult ,question,questionType ,grade, solution,metadata} = req.body
         
        if(!testid || !difficult || !question || !questionType || !grade || !solution   ){
             return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        const questiondocs = new Question({
            testid,
            difficult,
            question,
            questionType,
            grade,
            solution,
            metadata,
            
        })
        await questiondocs.save();
         
        if(questiondocs){
            res.status(200).json({
                success: true,
                message: 'success',
               
            })
        }
    } catch (error) {
        console.log(error)
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
    
}


const editQuestion = async (req, res) => {
    try {
        const { 
            questionId,  // ID của câu hỏi cần update
            testid, 
            difficult, 
            question, 
            questionType, 
            grade, 
            solution, 
            metadata, 
         
        } = req.body;

        // Validate dữ liệu đầu vào
        if (!questionId) {
            return res.status(400).json({
                success: false,
                message: 'Question ID là bắt buộc'
            });
        }

        // Kiểm tra câu hỏi có tồn tại không
        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy câu hỏi'
            });
        }

        // Chuẩn bị dữ liệu cập nhật (chỉ update các trường được gửi lên)
        const updateData = {};
        if (testid !== undefined) updateData.testid = testid;
        if (difficult !== undefined) updateData.difficult = difficult;
        if (question !== undefined) updateData.question = question;
        if (questionType !== undefined) updateData.questionType = questionType;
        if (grade !== undefined) updateData.grade = grade;
        if (solution !== undefined) updateData.solution = solution;
        if (metadata !== undefined) updateData.metadata = metadata;
       

        // Thêm thời gian cập nhật
        updateData.updatedAt = new Date();

        // Cập nhật câu hỏi
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { $set: updateData },
            { 
                new: true,  // Trả về document sau khi update
                runValidators: true  // Chạy validation của schema
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Cập nhật câu hỏi thành công',
            data: updatedQuestion
        });

    } catch (error) {
        console.error('Error updating question:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi cập nhật câu hỏi',
            error: error.message
        });
    }
};
const deleteMultipleQuestions = async (req, res) => {
    try {
        const { questionIds } = req.body; // Array of IDs

        // Validate
        if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Danh sách question IDs là bắt buộc'
            });
        }

        // Xóa nhiều câu hỏi
        const result = await Question.deleteMany({
            _id: { $in: questionIds }
        });

        return res.status(200).json({
            success: true,
            message: `Đã xóa ${result.deletedCount} câu hỏi`,
            data: {
                deletedCount: result.deletedCount
            }
        });

    } catch (error) {
        console.error('Error deleting questions:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server khi xóa câu hỏi',
            error: error.message
        });
    }
};


const fetchTestQuestion = async (req, res) => {
    try {
        const { testid } = req.params;

        // Validate param
        if (!testid) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: testid"
            });
        }

        // Convert to ObjectId
        let testidObj;
        try {
            testidObj = new mongoose.Types.ObjectId(testid);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid testid format"
            });
        }

        // Query DB
        const docs = await Question.find({ testid: testidObj });

        return res.status(200).json({
            success: true,
            data: docs
        });

    } catch (error) {
        console.error("Fetch test question error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


module.exports = {addQuestion,
    deleteMultipleQuestions,
    editQuestion,
   fetchTestQuestion}