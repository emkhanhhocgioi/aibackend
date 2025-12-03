const mongoose = require('mongoose');

const {Schema} = mongoose;

const SubjectTeacherSchema = new Schema ({
    classid: {type : mongoose.Schema.Types.ObjectId , ref: 'Class', required: true },
    toan: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    ngu_van: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    tieng_anh: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    vat_ly: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    hoa_hoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    sinh_hoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    lich_su: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    dia_ly: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    giao_duc_cong_dan: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    cong_nghe: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    tin_hoc: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    the_duc: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    am_nhac: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    my_thuat: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
    });
        
    module.exports = mongoose.model('SubjectTeacher', SubjectTeacherSchema);