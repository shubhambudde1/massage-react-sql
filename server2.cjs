// const express = require('express');
// const mysql = require('mysql2');
// const bcrypt = require('bcrypt');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Database connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.connect(err => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         process.exit(1);
//     }
//     console.log("Connected to MySQL database!");
// });

// // Sign Up endpoint
// app.post('/api/signup', async (req, res) => {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//         return res.status(400).send({ message: 'All fields are required' });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
//         db.query(query, [username, email, hashedPassword], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).send({ message: 'User registration failed' });
//             }
//             res.status(201).send({ message: 'User registered successfully' });
            
//         });
//     } catch (err) {
//         res.status(500).send({ message: 'Error hashing password' });
//     }
// });

// // Sign In endpoint
// app.post('/api/signin', (req, res) => {
//     console.log("Received request:", req.body);  // Log the incoming request body

//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send({ message: 'All fields are required' });
//     }

//     const query = "SELECT * FROM users WHERE email = ?";
//     db.query(query, [email], async (err, results) => {
//         if (err) return res.status(500).send({ message: 'Login failed' });

//         if (results.length === 0) {
//             return res.status(401).send({ message: 'Invalid email or password' });
//         }

//         const user = results[0];
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(401).send({ message: 'Invalid email or password' });
//         }

//         res.status(200).send({
//             message: 'Login successful',
//             user: { id: user.id, username: user.username, email: user.email }
//         });
//     });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log("Connected to MySQL database!");
});

// Sign-Up endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'User registration failed' });
            }
            res.status(201).send({ message: 'User registered successfully' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error hashing password' });
    }
});

// Sign-In endpoint
app.post('/api/signin', (req, res) => {
    console.log("Received request:", req.body);  // Log the incoming request body

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    // Query to find the user by email
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ message: 'Login failed due to a server error' });
        }

        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        res.status(200).send({
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
