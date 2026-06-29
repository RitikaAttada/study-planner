const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slots: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true }, 
      endTime: { type: String, required: true }, 
      subject: { type: String, required: true },
      color: { type: String, default: '#667eea' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);