require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Sample API Route
app.get('/api/mes', (req, res) => {
    res.json({ message: 'Hello from Express inside React!' });
});

// Serve React frontend in production
app.use(express.static(path.join(__dirname, '../build')));

// Uncomment if you want to only see raw express backend in dev
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("client/build"));
  
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//     });
//   }

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
