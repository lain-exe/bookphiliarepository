const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set the views (templates) folder
app.set('views', path.join(__dirname, 'public', 'views'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Serve static files (HTML, CSS, JS)
app.use('/static', express.static(path.join(__dirname, 'public')));

// SQLite database setup
const db = new sqlite3.Database('books.db');

// Create a table for books if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT
    -- Add more columns as needed
  )
`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'mainpage.html'));
});

app.get('/userprofilepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'userprofilepage.html'));
});

app.get('/bookshelfpage', (req, res) => {
    db.all('SELECT * FROM books', (err, books) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('bookshelfpage', { books });
    });
});

app.post('/bookshelfpage', (req, res) => {
    // Handle form submission here
    const bookInfo = req.body;
    console.log('Received book information:', bookInfo);
    // Save the information to your database or perform other actions

    // Redirect back to the bookshelf page or any other page
    res.redirect('/bookshelfpage');
});

// Add more routes for other pages...

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
