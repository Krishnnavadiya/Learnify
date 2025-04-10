const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Educator',
    },
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;