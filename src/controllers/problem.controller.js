const { get } = require('mongoose');
const Problem  = require('../models/problem.model');
const patternId = require('../models/pattern.model');
const createProblem = async ( req, res ) => {

    try {
        // creat a new problem
        const problem = await Problem.create(req.body);
        
        // return the created problem
        res.status(201).json({
            success: true,
            data: problem
        });
    } catch(error) {

        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }

}

// Get All Problems + Filters

// difficulty	?difficulty=Easy
// patternId	?patternId=abc123
// search (title)	?search=two
const getProblems = async (req, res) => {
  try {
    // Filters
    const { difficulty, patternId, search } = req.query;
    let filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (patternId) {
      filter.patternId = patternId;
    }
    // here search is implemented using regex to allow partial matches and case-insensitive search on the title field
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // populate is used below to get the pattern details along with the problem details
    const problems = await Problem.find(filter).populate("patternId");
    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProblemBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const problem = await Problem.findOne({ slug }).populate("patternId");

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }
        res.status(200).json({
            success: true,
            data: problem
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}
module.exports = {
    createProblem, getProblems, getProblemBySlug
}