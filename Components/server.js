const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ai_for_agri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

const registeredFarmersSchema = new mongoose.Schema({
  name: String,
  contactInfo: String,
  state: String,
  district: String,
  taluka: String,
  password: String,
});

const RegisteredFarmer = mongoose.model('registered_farmers', registeredFarmersSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { name, contactInfo, state, district, taluka, password } = req.body;

    // Check if user already exists
    const existingUser = await RegisteredFarmer.findOne({ contactInfo });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new RegisteredFarmer({
      name,
      contactInfo,
      state,
      district,
      taluka,
      password: hashedPassword,
    });

    await newFarmer.save();
    console.log('Registration successful');
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error registering farmer:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { contactInfo, password } = req.body;

    // Find the user by contact number
    const user = await RegisteredFarmer.findOne({ contactInfo });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Authentication successful
    res.status(200).json({ message: 'Login successful', name: user.name });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
