// working code

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

const RegisteredFarmer = mongoose.model('registered_farmer', registeredFarmersSchema);

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

// Login logic
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

// Crop data post

const cropDetailsSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registered_farmer'
  },
  contactInfo: String,
  crop1: String,
  crop2: String,
  crop3: String,
  crop4: String,
  crop5: String
});

const CropDetails = mongoose.model('crop_details', cropDetailsSchema);

app.post('/api/saveCrops', async (req, res) => {
  try {
    const { contactInfo, crop1, crop2, crop3, crop4, crop5 } = req.body;

    const newCropDetails = new CropDetails({
      contactInfo,
      crop1,
      crop2,
      crop3,
      crop4,
      crop5
    });

    await newCropDetails.save();
    console.log('Crop details saved successfully');
    res.status(201).json({ message: 'Crop details saved successfully' });
  } catch (err) {
    console.error('Error saving crop details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//Fetch Crop Data
// Server-side code (server.js)

app.get('/api/cropHistory/:contactInfo', async (req, res) => {
  try {
    const { contactInfo } = req.params;

    // Query the database to fetch crop history for the given contactInfo
    const cropHistory = await CropDetails.find({ contactInfo });

    if (!cropHistory) {
      return res.status(404).json({ message: 'Crop history not found' });
    }

    res.status(200).json(cropHistory);
  } catch (error) {
    console.error('Error fetching crop history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
