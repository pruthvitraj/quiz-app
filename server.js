// Import Required Modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('mongoose'); // MongoDB object modeling tool
const cors = require('cors'); // Middleware to handle CORS
const path = require('path'); // To serve static files
const { log } = require('console');
require('dotenv').config();
// Initialize Express App
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// for using EJS as the template engine
app.set('view engine', 'ejs');

// Set the views folder
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public/
console.log("mongoURI = "+process.env.mongoURI);

// MongoDB Connection String
// const mongoURI = 'mongodb://localhost:27017/'; // Replace quizApp with your DB name

// Connect to MongoDB
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Define Mongoose Schema and Model 
const questionSchema = new mongoose.Schema({
  questionText: String,
  options: Object, // Holds options like { A: "Option A", B: "Option B" }
  correctAnswer: String, // The correct answer key (e.g., "A")
});


// const Question = mongoose.model('Question', questionSchema);


app.get('/quiz/:topic', async (req, res) => {
  const topic = req.params.topic; // e.g., 'cpp', 'java'
  try {
    const Quiz = mongoose.model(topic, questionSchema, topic); // third param forces collection name
    const questions = await Quiz.find();
    console.log('Querying collection:', topic);
    res.json(questions);
  } catch (err) {
    res.status(500).send('Error fetching questions: ' + err.message);
  }
});


// API Endpoint: Fetch all categories (collection names)
app.get('/api/categories', async (req, res) => {
  try {
    // Use the native MongoDB connection to access the database
    const db = mongoose.connection.client.db('test_quizes');

    // Get all collections in the database
    const collections = await db.listCollections().toArray();

    // Extract just the names of the collections
    const categoryNames = collections.map(collection => collection.name);

    console.log('Folder Names:', categoryNames[0]);

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
app.get('/api/add-question', async (req, res) => {
  try {
    const db = mongoose.connection.client.db('test_quizes');
    const collections = await db.listCollections().toArray();
    const categoryNames = collections.map(c => c.name);
    res.render('quiz_add', { categories: categoryNames });
  } catch (err) {
    console.error('Error rendering form:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/add-question', async (req, res) => {
  try {
    const { category, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    // Validate
    if (!category || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create the question document
    const question = {
      questionText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctAnswer
    };

    // Insert into the respective category collection in test_quizes DB
    const db = mongoose.connection.client.db('test_quizes');
    const result = await db.collection(category).insertOne(question);

    console.log('Inserted Question:', result.insertedId);
    res.status(200).json({ message: 'Question added successfully!' });

  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
