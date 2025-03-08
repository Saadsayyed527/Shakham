import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student'], required: true },
    courses: { type: [String], required: true, validate: [arrayLimit, 'You must select exactly 5 courses.'] }
});

// Function to ensure exactly 5 courses are selected
function arrayLimit(val) {
    return val.length === 5;
}

export default mongoose.model('User', UserSchema);
