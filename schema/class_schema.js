const mongoose = require('mongoose');

const {Schema} = mongoose;


const ClassSchema = new Schema ({
    class_code: {type: String , required: true},
    class_year: {type: String , required: true},
    class_student_count : {type: Number , required: true, default: 0},
    class_teacher : {type : mongoose.Schema.Types.ObjectId , ref: 'Teacher', required: true },
    class_avarage_grade : {type : Number , required: false, default: 0},
})  


const Class = mongoose.model('Class' , ClassSchema);

module.exports = Class;