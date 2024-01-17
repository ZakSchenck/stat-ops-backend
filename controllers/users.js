const bcrypt = require('bcrypt');
const pool = require('../config/dbPool');
const jwt = require('jsonwebtoken');


// Registers new user POST request
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query pool for email, username, and pw
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).send("Error registering new user");
    }
};

// User login POST request
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Checks if password matches up with decrypted password
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                // 400 error if credentials do not match
                res.status(400).send("Invalid credentials");
            }
        } else {
            // 400 error if user does not exist
            res.status(400).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Error logging in");
    }
};