const mongoose = require('mongoose');
const { Schema } = mongoose;

const testAnswerSchema = new Schema({
    testID: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },

    studentID: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    answerUrl: {
        type: String,
        required: true
    },

    submissionTime: {
        type: Date,
        required: true,
        default: Date.now
    },

    status: {
        type: String,
        enum: ['Chưa nộp', 'Đã nộp', 'Chậm nộp'],
        default: 'Chưa nộp'
    },

    diem: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    }
}, { timestamps: true });

const TestAnswer = mongoose.model('TestAnswer', testAnswerSchema);
module.exports = TestAnswer;
