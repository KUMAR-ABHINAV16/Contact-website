const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/contactlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Contact schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while fetching contacts.');
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = new Contact({ name, email, phone });
    await newContact.save();
    res.json(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while creating a new contact.');
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const contactId = req.params.id;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { name, email, phone },
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while updating the contact.');
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    await Contact.findByIdAndRemove(contactId);
    res.send('Contact deleted successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while deleting the contact.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

