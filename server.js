const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://Duelist:test@projectshowdown.bmdeinp.mongodb.net/?retryWrites=true&w=majority/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Create a schema and model for the button state
const buttonSchema = new mongoose.Schema({
  isClicked: Boolean
}, {collection: 'buttons'});
const Button = mongoose.model('Button', buttonSchema);

// Create Express app
const app = express();
const port = 3000;

// Serve static files
app.use(express.static('public'));

// GET route to fetch the current button state
app.get('/api/button', async (req, res) => {
  try {
    const button = await Button.findOne();
    res.json({ isClicked: button ? button.isClicked : false });
  } catch (error) {
    console.error('Error fetching button state:', error);
    res.sendStatus(500);
  }
});

// POST route to handle button click
app.post('/api/button', async (req, res) => {
  try {
    let button = await Button.findOne();
    if (!button) {
      button = new Button({ isClicked: false });
    }
    button.isClicked = !button.isClicked;
    await button.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating button state:', error);
    res.sendStatus(500);
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
