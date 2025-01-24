import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true }
})

const User = mongoose.model('User', userSchema);
export default User