const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import cors module
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const session = require('express-session'); // Import express-session for session management

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware setup
app.use(session({
  secret: 'your-secret-key', // Change to a secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // For development, use secure: false (use secure: true in production)
}));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'passwordmanageruser',  // Replace with your MySQL username
  password: 'password',         // Replace with your MySQL password
  database: 'password_manager_db'  // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/manage-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-password.html'));
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)';
    
    db.query(query, [name, email, hashedPassword, phone], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Error registering user', error: err });
        return;
      }
      res.status(200).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ message: 'Error logging in', error: err });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      try {
        // Compare hashed password
        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
          // Store user_id in session
          req.session.user_id = user.id;  // This assumes you're using express-session
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ message: 'Invalid email or password' });
        }
      } catch (error) {
        console.error('Error comparing password:', error);
        res.status(500).json({ message: 'Error logging in', error });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Save password endpoint
app.post('/save-password', (req, res) => {
  const { site_name, username, password_hash } = req.body;
  
  // Ensure the user is logged in
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'User not logged in' });
  }
  
  const user_id = req.session.user_id;  // Get the user_id from the session

  const query = 'INSERT INTO passwords (site_name, username, password_hash, user_id) VALUES (?, ?, ?, ?)';
  
  db.query(query, [site_name, username, password_hash, user_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ message: 'Error saving password', error: err });
      return;
    }
    res.status(200).json({ message: 'Password saved successfully' });
  });
});


// Get passwords endpoint
app.get('/get-passwords', (req, res) => {
  // Ensure the user is logged in
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  const userId = req.session.user_id;  // Get the user_id from the session
  const query = 'SELECT site_name, username, password_hash FROM passwords WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching passwords' });
      return;
    }

    const passwords = results.map(row => ({
      site_name: row.site_name,
      username: row.username,
      password_hash: row.password_hash
    }));

    res.json({ passwords });
  });
});

// Route to delete a password by ID
app.delete('/delete-password', (req, res) => {
  const { id } = req.body;
  if (!id) {
      return res.status(400).json({ error: 'Password ID is required' });
  }

  const passwordIndex = passwords.findIndex(p => p.id === id);
  if (passwordIndex === -1) {
      return res.status(404).json({ error: 'Password not found' });
  }

  // Remove password from the list
  passwords.splice(passwordIndex, 1);
  res.json({ message: 'Password deleted successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
