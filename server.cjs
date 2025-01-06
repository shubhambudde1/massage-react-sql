const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
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

// Check database connection
app.get('/api/health', (req, res) => {
    db.query('SELECT 1', (err, result) => {
        if (err) {
            console.error('Database connection failed:', err);
            return res.status(500).send('Database connection failed');
        }
        res.send('Database connected successfully');
    });
});

// Check if the table exists
app.get('/api/check-table', (req, res) => {
    const query = `SHOW TABLES LIKE 'messages'`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error checking table:', err);
            return res.status(500).send('Error checking table');
        }
        if (result.length === 0) {
            res.send('Table "messages" does not exist');
        } else {
            res.send('Table "messages" exists');
        }
    });
});

// API to insert message
app.post('/api/messages', (req, res) => {
    const { sender, receiver, message } = req.body;
    console.log('Incoming message data:', { sender, receiver, message }); // Log incoming data
    const query = "INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)";
    db.query(query, [sender, receiver, message], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            return res.status(500).send('Failed to insert message');
        }
        res.status(201).send({ id: result.insertId, sender, receiver, message });
    });
});

// API to fetch all messages
app.get('/api/messages', (req, res) => {
    const query = "SELECT * FROM messages";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).send('Failed to fetch messages');
        }
        res.status(200).json(results);
    });
    // const query2 = "SELECT * FROM users WHERE email = ?";
    // db.query(query, (err, results) => {
    //     if (err) {
    //         console.error('Error fetching messages:', err);
    //         return res.status(500).send('Failed to fetch messages');
    //     }
    //     res.status(200).json(results);
    // });
});

//testing

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
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).send({ message: 'Login failed' });

        if (results.length === 0) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Send back user details, including username
        res.status(200).send({
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email }
        });
    });
});

app.get('/api/username', (req, res) => {
    // Query to fetch all usernames from the `users` table
    const query = "SELECT username FROM users";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching usernames:', err);
            return res.status(500).send({ message: 'Failed to fetch usernames', error: err.message });
        }
        
        // Log the retrieved results to the console
        console.log('Retrieved usernames:');
        
        // Send the results as JSON response
        res.status(200).json(results.map(r => r.username));
    });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
