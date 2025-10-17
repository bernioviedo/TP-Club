import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const newsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

const NewsModel = model('News', newsSchema);

export default NewsModel;