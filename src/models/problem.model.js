const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            required: true,
        },
        patternId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pattern',
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        leetcodeLink: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Problem', problemSchema);