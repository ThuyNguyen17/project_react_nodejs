const mongoose = require('mongoose');

const ViolationSchema = new mongoose.Schema({
    assignmentId: { type: String, required: true },
    userId: { type: String, required: true },
    studentName: { type: String },
    violationType: {
        type: String,
        enum: ['TAB_SWITCH', 'FULLSCREEN_EXIT', 'DEVTOOLS_OPEN', 'COPY_PASTE', 'OTHER'],
        default: 'OTHER'
    },
    details: { type: String },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'violations', timestamps: true });

module.exports = mongoose.model('Violation', ViolationSchema);
