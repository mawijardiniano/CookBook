const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const recipeRoutes = require('./routes/recipe');
const userRouter = require('./routes/user');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: 'https://cookbookweb.onrender.com', // Update this to match the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // If you're using cookies or authentication tokens
};

app.use(cors(corsOptions));

// COOP and COEP headers for better cross-origin handling
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Ensures isolation of browsing contexts
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Ensures embedded content is loaded safely
  next();
});

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error: ', err));

app.use("/api/recipe", recipeRoutes);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
