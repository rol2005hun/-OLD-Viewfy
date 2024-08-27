const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    description: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    privacy: {
        type: String,
        required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ownerName: {
      type: String
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = Post = mongoose.model('posts', postSchema);