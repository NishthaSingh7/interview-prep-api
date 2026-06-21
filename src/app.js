// This is where we create our app using express
const express = require("express");
const app = express();

const problemRoutes = require('./routes/problem.routes');
const patternRoutes = require("./routes/pattern.routes");

// Middleware to parse JSON bodies
app.use(express.json());

// Use the problem routes
app.use('/api/v1/problems', problemRoutes);


app.use("/api/v1/patterns", patternRoutes);
module.exports = app;