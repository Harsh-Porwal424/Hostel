import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:admin@cluster0.oaalese.mongodb.net/roommate?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  preferences: {
    registrationNo: String,
    phoneNo: String,
    state: String,
    hobbies: String,
    mealType: String
  },
  confirmedRoommate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error signing up' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/api/preferences', async (req, res) => {
  try {
    const { userId } = req.user; // From JWT middleware
    const preferences = req.body;
    await User.findByIdAndUpdate(userId, { preferences });
    res.json({ message: 'Preferences updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating preferences' });
  }
});

app.get('/api/matches', async (req, res) => {
  try {
    const { userId } = req.user; // From JWT middleware
    const currentUser = await User.findById(userId);
    const users = await User.find({
      _id: { $ne: userId },
      confirmedRoommate: { $exists: false }
    });

    const matches = users.map(user => {
      const matchScore = calculateMatchScore(currentUser.preferences, user.preferences);
      return {
        id: user._id,
        name: user.name,
        registrationNo: user.preferences.registrationNo,
        phoneNo: user.preferences.phoneNo,
        state: user.preferences.state,
        matchPercentage: matchScore
      };
    });

    res.json(matches.sort((a, b) => b.matchPercentage - a.matchPercentage));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching matches' });
  }
});

app.post('/api/confirm-roommate', async (req, res) => {
  try {
    const { userId } = req.user;
    const { matchId, confirmed } = req.body;

    if (confirmed) {
      await User.findByIdAndUpdate(userId, { confirmedRoommate: matchId });
      await User.findByIdAndUpdate(matchId, { confirmedRoommate: userId });
    }

    res.json({ message: 'Roommate confirmation updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error confirming roommate' });
  }
});

function calculateMatchScore(preferences1, preferences2) {
  let score = 0;
  
  // State matching
  if (preferences1.state === preferences2.state) score += 30;
  
  // Hobbies matching
  const hobbies1 = preferences1.hobbies.toLowerCase().split(',');
  const hobbies2 = preferences2.hobbies.toLowerCase().split(',');
  const commonHobbies = hobbies1.filter(hobby => hobbies2.includes(hobby));
  score += (commonHobbies.length / Math.max(hobbies1.length, hobbies2.length)) * 40;
  
  // Meal type matching
  if (preferences1.mealType === preferences2.mealType) score += 30;
  
  return Math.round(score);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});