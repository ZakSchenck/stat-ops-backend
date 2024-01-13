const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares
app.use(express.json()); // for parsing application/json

// Routes
const playerRoutes = require('./routes/playerRoutes');
app.use('/', playerRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});