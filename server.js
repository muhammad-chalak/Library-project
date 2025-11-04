const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs/promises'); // For file operations
const multer = require('multer');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid'); // For unique IDs (requires npm install nanoid)

// Load Environment Variables
dotenv.config();
const app = express();

// --- Lowdb (Local JSON Database) Setup ---
const dbFilePath = path.join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(dbFilePath);
const db = new Low(adapter, { books: [] });

// Function to load the database
async function loadDb() {
    await db.read();
    // Ensure the data structure is initialized if file is empty
    db.data ||= { books: [] };
    await db.write();
}
loadDb();

// --- Multer (File Upload) Setup for Local Storage ---
const localUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Determine destination based on file type
            if (file.fieldname === 'bookFile') { // PDF
                cb(null, path.join(__dirname, 'public', 'pdfs'));
            } else if (file.fieldname === 'bookImage') { // Image
                cb(null, path.join(__dirname, 'public', 'photos'));
            } else {
                cb(new Error('Invalid field name for upload'), null);
            }
        },
        filename: (req, file, cb) => {
            // Create a unique filename based on extension
            const ext = path.extname(file.originalname);
            cb(null, `${nanoid()}${ext}`); // Use nanoid to ensure uniqueness
        }
    })
});

// Middlewares
app.use(express.json()); // To parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// --- API Route for adding a new book (Admin only - HAMESHAYY KHAZN KRDN) ---
app.post('/api/books', 
    localUpload.fields([
        { name: 'bookFile', maxCount: 1 }, 
        { name: 'bookImage', maxCount: 1 }
    ]), 
    async (req, res) => {
    
    const { adminPassword, title, author, category } = req.body;
    const pdfFile = req.files && req.files.bookFile ? req.files.bookFile[0] : null;
    const imageFile = req.files && req.files.bookImage ? req.files.bookImage[0] : null;
    
    // Cleanup function in case of error (delete locally uploaded files)
    const cleanup = async () => {
        if (pdfFile && pdfFile.path) await fs.unlink(pdfFile.path).catch(console.error);
        if (imageFile && imageFile.path) await fs.unlink(imageFile.path).catch(console.error);
    };

    // Check 1: Admin Password
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        await cleanup();
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check 2: Missing Files or Data
    if (!title || !author || !category || !pdfFile || !imageFile) {
        await cleanup();
        return res.status(400).json({ message: 'Missing book data, PDF file, or Image file.' });
    }

    try {
        await db.read(); // Read the latest state

        // Filenames are already set by Multer and stored in public/pdfs and public/photos
        const newBook = { 
            _id: nanoid(), // Lowdb uses simple object/array structure, we add a MongoDB-like ID
            title, 
            author, 
            category, 
            image: `photos/${imageFile.filename}`, // Relative path for the client
            pdfUrl: `pdfs/${pdfFile.filename}`, // Relative path for the client
            createdAt: new Date(),
        };

        db.data.books.push(newBook);
        await db.write(); // Save the new book to db.json
        
        res.status(201).json(newBook);

    } catch (error) {
        console.error('Error in /api/books POST:', error);
        await cleanup();
        res.status(500).json({ message: 'Error adding book', error: error.message });
    }
});

// --- API Route to get all books ---
app.get('/api/books', async (req, res) => {
    try {
        await db.read();
        const { category } = req.query; 
        
        let books = db.data.books;

        if (category && category !== 'هەموو کتێبەکان') {
            books = books.filter(book => book.category === category);
        }
        
        // Simple sort by creation date (newest first)
        books.sort((a, b) => b.createdAt - a.createdAt);

        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

// --- API Route to Delete a Book (Admin only - HAMESHAYY SRINWA) ---
app.delete('/api/books/:id', async (req, res) => {
    const adminPassword = req.headers['x-admin-password']; 
    const bookId = req.params.id;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await db.read();
        const bookIndex = db.data.books.findIndex(b => b._id === bookId);

        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        const bookToDelete = db.data.books[bookIndex];

        // 1. Delete files from the local file system (HAMESHAYY SRINWA)
        const pdfPath = path.join(__dirname, 'public', bookToDelete.pdfUrl);
        const imagePath = path.join(__dirname, 'public', bookToDelete.image);

        // Safely delete files
        await fs.unlink(pdfPath).catch(err => console.error(`Failed to delete PDF file: ${err.message}`));
        await fs.unlink(imagePath).catch(err => console.error(`Failed to delete Image file: ${err.message}`));


        // 2. Delete book metadata from Lowdb
        db.data.books.splice(bookIndex, 1);
        await db.write(); // Save the change

        res.status(200).json({ message: 'Book and files deleted successfully' });

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

// Start the server
const PORT_NUM = process.env.PORT || 5000;
app.listen(PORT_NUM, () => console.log(`Server running on port ${PORT_NUM}`));
