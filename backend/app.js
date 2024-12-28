const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const recipeRoutes = require('./routes/recipe')
const userRouter = require('./routes/user')
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error: ', err));

app.use("/api/recipe", recipeRoutes)
app.use("/api/user", userRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
