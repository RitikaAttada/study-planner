const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type:String, required: true, unique: true},
    password:{type:String, required:true},
    streak:{type:Number, default: 0},
    lastActive:{type:Date, default: Date.now}
}, {timestamps: true});

module.exports=mongoose.model('User', userSchema);
