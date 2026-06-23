const Pattern = require("../models/pattern.model");
const Problem = require("../models/problem.model");

const createPattern = async (req, res) => {
  try {
    const pattern = await Pattern.create(req.body);
    res.status(201).json({ success: true, data: pattern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPatterns = async (req, res) => {
  try {
    const [patterns, counts] = await Promise.all([
      Pattern.find().sort({ order: 1 }).lean(),
      Problem.aggregate([{ $group: { _id: "$patternId", problemCount: { $sum: 1 } } }]),
    ]);

    const countByPattern = new Map(counts.map((row) => [String(row._id), row.problemCount]));

    const data = patterns.map((pattern) => ({
      ...pattern,
      problemCount: countByPattern.get(String(pattern._id)) || 0,
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPatternBySlug = async (req, res) => {
  try {
    const pattern = await Pattern.findOne({ slug: req.params.slug });
    if (!pattern) {
      return res.status(404).json({ success: false, message: "Pattern not found" });
    }
    res.status(200).json({ success: true, data: pattern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePattern = async (req, res) => {
  try {
    const pattern = await Pattern.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pattern) {
      return res.status(404).json({ success: false, message: "Pattern not found" });
    }
    res.status(200).json({ success: true, data: pattern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePattern = async (req, res) => {
  try {
    const pattern = await Pattern.findOneAndDelete({ slug: req.params.slug });
    if (!pattern) {
      return res.status(404).json({ success: false, message: "Pattern not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPattern,
  getPatterns,
  getPatternBySlug,
  updatePattern,
  deletePattern,
};
