import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['superadmin','admin', 'user'], default: 'user' },});

const UserModel = model('User', userSchema);

export default UserModel;