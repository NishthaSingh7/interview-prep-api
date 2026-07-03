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
        summary: {
            type: String,
            default: "",
            trim: true,
        },
        brief: {
            scenario: { type: String, default: "" },
            given: { type: String, default: "" },
            output: { type: String, default: "" },
            constraints: { type: String, default: "" },
            examples: {
                type: [
                    {
                        input: { type: String, default: "" },
                        output: { type: String, default: "" },
                        explanation: { type: String, default: "" },
                    },
                ],
                default: [],
            },
            fromLeetcode: { type: Boolean, default: false },
        },
        leetcodeLink: {
            type: String,
        },
        practiceLink: {
            type: String,
        },
        source: {
            type: String,
            enum: ['LeetCode', 'GeeksforGeeks', 'InterviewBit', 'HackerRank', 'Codeforces', 'Educative', 'Other'],
            default: 'LeetCode',
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Problem', problemSchema);