const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;


const userSchema = new Schema({
    
    firstName: {type:String, required:true, trim:true},
    lastName: {type:String, required:true, trim:true},
    email: {type:String, required:true, unique:true, lowercase:true, trim:true},
    password: {type: String},
    roles: {type: [String], default: ['Applicant']},
    googleId : {type: String},
    signupMethod: {type: String},
    createdAt: {type:Date, default: Date.now}
});

const User = model('User', userSchema);
module.exports = User;