import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    cnic: { type: Number, require: true, unique: true },
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isFirstLogin: { type: Boolean, require: true },
})

const User = mongoose.model('User', userSchema);
export default User