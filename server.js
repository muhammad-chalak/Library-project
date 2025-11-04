const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
// زیادکراو بۆ مامەڵەکردن لەگەڵ فایلەکان و Cloudinary
const multer = require('multer'); 
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const util = require('util');

dotenv.config();
const app = express();

// پاککردنەوەی فایلی کاتی: بۆ سڕینەوەی ئەو فایلانەی Multer لەسەر سێرڤەری لۆکاڵی خەزنی دەکات
const unlinkFile = util.promisify(fs.unlink);

// ڕێکخستنی Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

// ڕێکخستنی Multer بۆ هەڵگرتنی کاتی فایلەکان لەسەر سێرڤەری لۆکاڵی
// 'uploads/' دەبێت بە دەست دروست بکرێت
const upload = multer({ dest: 'uploads/' }); 

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
    image: { type: String, required: true }, // URL to the image (Cloudinary URL)
    pdfUrl: { type: String, required: true }, // URL to the PDF file (Cloudinary URL)
    imagePublicId: { type: String, required: true }, // NEW: Cloudinary Public ID for image
    pdfPublicId: { type: String, required: true }    // NEW: Cloudinary Public ID for PDF
});
const Book = mongoose.model('Book', BookSchema);

// --- API Route for adding a new book (Admin only - HAMESHAYY KHAZN KRDN) ---
app.post('/api/books', 
    upload.fields([
        { name: 'bookFile', maxCount: 1 }, 
        { name: 'bookImage', maxCount: 1 }
    ]), 
    async (req, res) => {
    
    // وەرگرتنی داتا و وشەی نهێنی
    const { adminPassword, title, author, category } = req.body;
    const pdfFile = req.files && req.files.bookFile ? req.files.bookFile[0] : null;
    const imageFile = req.files && req.files.bookImage ? req.files.bookImage[0] : null;
    
    let uploadedPdfPublicId = null;
    let uploadedImagePublicId = null;
    let uploadedPdfUrl = null;
    let uploadedImageUrl = null;

    // A utility function to clean up local files
    const cleanup = async () => {
        if (pdfFile) await unlinkFile(pdfFile.path).catch(console.error);
        if (imageFile) await unlinkFile(imageFile.path).catch(console.error);
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
        // 1. Upload PDF to Cloudinary
        const pdfPublicIdBase = `${category.replace(/\s/g, '_')}/${path.parse(pdfFile.originalname).name}-${Date.now()}`;
        const pdfResult = await cloudinary.uploader.upload(pdfFile.path, {
            folder: 'shahana-library-pdfs', // Folder in Cloudinary
            resource_type: 'raw', // Use 'raw' for non-image files like PDF
            public_id: pdfPublicIdBase,
        });
        uploadedPdfUrl = pdfResult.secure_url;
        uploadedPdfPublicId = pdfResult.public_id; // Save public_id for later deletion

        // 2. Upload Image to Cloudinary
        const imagePublicIdBase = `${category.replace(/\s/g, '_')}/${path.parse(imageFile.originalname).name}-${Date.now()}`;
        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
            folder: 'shahana-library-images', // Folder in Cloudinary
            public_id: imagePublicIdBase,
        });
        uploadedImageUrl = imageResult.secure_url;
        uploadedImagePublicId = imageResult.public_id; // Save public_id for later deletion

        // 3. Save Book Metadata to MongoDB Atlas
        const newBook = new Book({ 
            title, 
            author, 
            category, 
            image: uploadedImageUrl, 
            pdfUrl: uploadedPdfUrl,
            imagePublicId: uploadedImagePublicId, // NEW
            pdfPublicId: uploadedPdfPublicId      // NEW
        });
        await newBook.save();
        
        res.status(201).json(newBook);

    } catch (error) {
        console.error('Error in /api/books POST:', error);
        // Attempt to clean up cloudinary if upload failed halfway
        if (uploadedPdfPublicId) await cloudinary.uploader.destroy(uploadedPdfPublicId, { resource_type: 'raw' }).catch(console.error);
        if (uploadedImagePublicId) await cloudinary.uploader.destroy(uploadedImagePublicId).catch(console.error);
        
        res.status(500).json({ message: 'Error adding book', error: error.message });
    } finally {
        // 4. CLEANUP: Delete temporary local files
        await cleanup();
    }
});

// --- API Route to get all books ---
app.get('/api/books', async (req, res) => {
    try {
        const { category } = req.query; // Check for a category query parameter
        let query = {};
        if (category && category !== 'هەموو کتێبەکان') {
            query = { category };
        }
        
        // Find books and sort by title
        const books = await Book.find(query).sort({ title: 1 }); 
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
});

// --- API Route to Delete a Book (Admin only - HAMESHAYY SRINWA) ---
app.delete('/api/books/:id', async (req, res) => {
    // Check for Admin Password (passed in request headers for security)
    const adminPassword = req.headers['x-admin-password']; 
    const bookId = req.params.id;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // 1. Find the book
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // 2. Delete files from Cloudinary using the stored public IDs
        const pdfDeleteResult = await cloudinary.uploader.destroy(book.pdfPublicId, { resource_type: 'raw' });
        const imageDeleteResult = await cloudinary.uploader.destroy(book.imagePublicId);
        
        // console.log('Cloudinary PDF Deletion Result:', pdfDeleteResult);
        // console.log('Cloudinary Image Deletion Result:', imageDeleteResult);


        // 3. Delete book metadata from MongoDB Atlas
        await Book.deleteOne({ _id: bookId });

        res.status(200).json({ message: 'Book and files deleted successfully' });

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});


// Serve static files (your HTML, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
