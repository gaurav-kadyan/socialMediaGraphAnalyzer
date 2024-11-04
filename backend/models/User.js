import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    platform: String,
    connections: [{
        username: String,
        name: String,
        profileUrl: String
    }],
    lastUpdated: Date
});

export default mongoose.model('User', userSchema);