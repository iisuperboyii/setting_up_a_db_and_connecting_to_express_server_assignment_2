const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const User = require('./schema'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT

app.use(express.static('static'));
app.use(express.json()); 


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Error connecting to database', err));


app.post('/api/users', async (req, res) => {
  const userData = req.body;


  const user = new User(userData);
  try {
    await user.validate(); 
    await user.save(); 
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
