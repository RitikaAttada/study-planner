const mongoose=require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    date: {type: String, required: true},
    completed:{type: Boolean, default: false},
    plannedMinuted:{type: Number, default: 30},
    actualMinutes:{type: Number, default: 0}
}, {timestamps: true});


module.exports = mongoose.model('Task', taskSchema);