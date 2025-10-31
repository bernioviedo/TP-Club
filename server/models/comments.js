import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const commentsSchema = new Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
    createdAt: { type: Date, default: Date.now },
});

const CommentsModel = model('Comments', commentsSchema);

export default CommentsModel;