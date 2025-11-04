const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB Atlas!'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a simple Book Schema (Model)
const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // URL to the image
    pdfUrl: { type: String, required: true } // URL to the PDF file
});
const Book = mongoose.model('Book', BookSchema);

// API Route for adding a new book (Admin only - NEEDS FILE UPLOAD LOGIC)
app.post('/api/books', async (req, res) => {
    // Simple password check (NOT SECURE in a real API, needs proper token/session)
    const { adminPassword, title, author, category, image, pdfUrl } = req.body;
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // NOTE: In a real app, you would handle file uploads (image & PDF) 
        // and get the actual image and pdfUrl before this step.
        const newBook = new Book({ title, author, category, image, pdfUrl });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
});

// API Route to get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

// Serve static files (your HTML, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// YOU MUST IMPLEMENT FILE UPLOAD LOGIC (e.g., using 'multer' for local or 'cloudinary' for cloud storage)
