const Problem = require("../models/problem.model");

const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProblems = async (req, res) => {
  try {
    const { difficulty, patternId, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (patternId) filter.patternId = patternId;
    if (search) filter.title = { $regex: search, $options: "i" };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [problems, total] = await Promise.all([
      Problem.find(filter).populate("patternId").skip(skip).limit(limitNum).sort({ createdAt: 1 }),
      Problem.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: problems.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProblemBySlug = async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug }).populate("patternId");
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    }).populate("patternId");

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemBySlug,
  updateProblem,
  deleteProblem,
};
