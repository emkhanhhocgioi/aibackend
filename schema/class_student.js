const mongoose = require('mongoose')
const {Schema} = mongoose;

const classStudent = new Schema({
    classID: {type: Schema.Types.ObjectId, required: true, ref: 'Class'},
    studentID: {type: Schema.Types.ObjectId, required: true, ref: 'Student'},
    timeJoin: {type: Date, default: Date.now}
}, { timestamps: true })

const ClassStudent = mongoose.model('ClassStudent', classStudent);

module.exports = ClassStudent;

