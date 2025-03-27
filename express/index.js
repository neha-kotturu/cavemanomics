require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API Route
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Express inside React!' });
});

// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
