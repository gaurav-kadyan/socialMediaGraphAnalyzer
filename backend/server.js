import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import githubRoutes from './routes/github.routes.js';
<<<<<<< Updated upstream
// import linkedinRoutes from './routes/linkedin.routes.js';
=======
import linkedinRoutes from './routes/linkedin.routes.js';
import graphRoutes from './routes/graph.routes.js'
>>>>>>> Stashed changes


const app = express();

// console.log(process.env);
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/github', githubRoutes);
<<<<<<< Updated upstream
// app.use('/api/linkedin', linkedinRoutes);
=======
app.use('/api/linkedin', linkedinRoutes);
app.use('/api/graph', graphRoutes);
>>>>>>> Stashed changes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});