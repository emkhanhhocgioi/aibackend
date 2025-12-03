const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LessonSchema = new Schema({
    classid: {tpye: mongoose.Types.ObjectId , ref: 'Class', required: true},
    teacherid: {tpye: mongoose.Types.ObjectId , ref: 'Teacher', required: true},
    name: {type: String , required: true},
    subject:{type: String, required: true},
    timeCreated: {type: Date , required: true},
    desc: {type: String , required: true},
    answer:{type: String ,required: true},
    metadata: {type: String , required: true},
})

const Lesson = mongoose.model('Lesson', LessonSchema)
module.exports = Lesson