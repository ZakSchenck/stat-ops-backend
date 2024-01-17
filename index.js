const express = require('express');
const app = express();
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

// Middlewares
app.use(express.json()); // for parsing application/json

// Routes
const playerRoutes = require('./routes/playerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/players', authMiddleware, playerRoutes); 
app.use('/api/v1/matches', authMiddleware, matchRoutes);
app.use('/api/v1/users', userRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});