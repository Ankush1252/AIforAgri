const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import cors module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Use cors middleware

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai_for_agri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

//Registration Form 

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, state, district, taluka, password } = req.body;

    // Check if user already exists
    const existingUser = await RegisteredFarmer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newFarmer = new RegisteredFarmer({
      name,
      email,
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

// Crop data post

const cropDetailsSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registered_farmer'
  },
  email: String,
  crop1: String,
  crop2: String,
  crop3: String,
  crop4: String,
  crop5: String
});

const CropDetails = mongoose.model('crop_details', cropDetailsSchema);

app.post('/api/saveCrops', async (req, res) => {
  try {
    const { email, crop1, crop2, crop3, crop4, crop5 } = req.body;

    const newCropDetails = new CropDetails({
      email,
      crop1,
      crop2,
      crop3,
      crop4,
      crop5
    });

    await newCropDetails.save();
    // console.log('Crop details saved successfully');
    res.status(201).json({ message: 'Crop details saved successfully' });
  } catch (err) {
    console.error('Error saving crop details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//Fetch Crop Data

app.get('/api/cropHistory/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Query the database to fetch crop history for the given email
    const cropHistory = await CropDetails.find({ email });

    if (!cropHistory) {
      return res.status(404).json({ message: 'Crop history not found' });
    }

    res.status(200).json(cropHistory);
  } catch (error) {
    console.error('Error fetching crop history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Schema and model for registered farmers
const registeredFarmersSchema = new mongoose.Schema({
  name: String,
  email: String,
  state: String,
  district: String,
  taluka: String,
  password: String,
});
const RegisteredFarmer = mongoose.model('registered_farmer', registeredFarmersSchema);

// Schema and model for password reset tokens
const resetTokenSchema = new mongoose.Schema({
  email: String,
  token: String,
  expiresAt: Date,
});
const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ankushawate1252@gmail.com',
      pass: 'ENTER PASSKEY',
    },
  });

  const mailOptions = {
    from: 'ankushawate1252@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Request password reset
app.post('/api/resetpassword', async (req, res) => {
  const { email } = req.body;

  // Check if the email is already present in the database
  const existingUser = await RegisteredFarmer.findOne({ email });

  if (!existingUser) {
    // If the email is not found, respond with an error message
    return res.status(404).json({ message: 'Email not found. Please register first.' });
  }

  // If the email is found, proceed with generating OTP and sending it
  const otp = generateOTP();
  console.log(otp);
  const resetToken = new ResetToken({
    email: email,
    token: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
  });
  await resetToken.save();

  await sendOTP(email, otp);

  res.json({ message: 'OTP sent to your email. Use it to reset your password.' });
});


// Reset password
app.post('/api/reset-password/verify', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const resetToken = await ResetToken.findOne({ email, token: otp, expiresAt: { $gt: Date.now() } });

  if (!resetToken) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await RegisteredFarmer.findOneAndUpdate({ email }, { password: hashedPassword });

  await ResetToken.deleteOne({ email, token: otp });

  res.json({ message: 'Password reset successfully.' });
});

// Login logic
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email 
    const user = await RegisteredFarmer.findOne({ email });

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
