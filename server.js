// Import Required Modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('mongoose'); // MongoDB object modeling tool
const cors = require('cors'); // Middleware to handle CORS
const path = require('path'); // To serve static files

// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public/

// MongoDB Connection String
const mongoURI = 'mongodb://localhost:27017/'; // Replace quizApp with your DB name

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model 
const questionSchema = new mongoose.Schema({
  questionText: String,
  options: Object, // Holds options like { A: "Option A", B: "Option B" }
  correctAnswer: String, // The correct answer key (e.g., "A")
});

const Question = mongoose.model('Question', questionSchema);

// API Endpoint: Fetch all categories (collection names)
app.get('/api/categories', async (req, res) => {
  try {
    // Access the 'test_quizes' database
    const db = mongoose.connection.useDb('test_quizes');
    // Get all collection names from the database
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.log('Error fetching collections:', err);
      } else {
        const folderNames = collections.map(collection => collection.name);
        console.log('Folder Names:', folderNames);
      }
    });
    const collections = await db.collections();
    console.log(collections)
    
    // Extract the collection names (categories)
    // const categoryNames = collections.map(collection => collection.collectionName);

    // Send the category names as JSON response
    res.json(categoryNames);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API Endpoint: Fetch all questions
app.get('/api/questions', async (req, res) => {
  try {
    // Extract the category from the query parameters
    const category = req.query.category;
    
    console.log(req.query);

    // Validate the category (optional, but recommended)
    const allowedCategories = ['science', 'c', 'python', 'java', 'javascript', 'dsa', 'cpp'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Access the test_quizzes database and the dynamic category collection
    const categoryCollection = mongoose.connection.useDb('test_quizes').collection(category);

    // Fetch all documents (questions) from the chosen category collection
    const questions = await categoryCollection.find({}).toArray();

    // Send the fetched questions as a JSON response
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
