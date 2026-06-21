const Pattern = require("../models/pattern.model");

const createPattern = async (req, res) => {
  try {
    const pattern = await Pattern.create(req.body);

    res.status(201).json({
      success: true,
      data: pattern,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPattern,
};
