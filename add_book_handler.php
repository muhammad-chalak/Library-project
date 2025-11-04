<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Location: add-book.php');
    exit;
}

// Function to generate a unique ID
function generate_book_id() {
    return uniqid('book_', true);
}

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Validate inputs
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $author = isset($_POST['author']) ? trim($_POST['author']) : '';
    $category = isset($_POST['category']) ? trim($_POST['category']) : '';

    if (empty($title) || empty($author) || empty($category) || empty($_FILES['book_file']['name']) || empty($_FILES['book_image']['name'])) {
        // Handle error: missing fields
        header('Location: add-book.php?error=missing_fields');
        exit;
    }

    // 2. File Uploads (Crucial part)
    $book_id = generate_book_id();
    $pdf_target_dir = "pdfs/";
    $img_target_dir = "photos/";

    // Sanitize and create new file names
    $pdf_extension = pathinfo($_FILES["book_file"]["name"], PATHINFO_EXTENSION);
    $img_extension = pathinfo($_FILES["book_image"]["name"], PATHINFO_EXTENSION);
    
    $pdf_filename = $book_id . '.' . $pdf_extension;
    $img_filename = $book_id . '.' . $img_extension;
    
    $pdf_target_file = $pdf_target_dir . $pdf_filename;
    $img_target_file = $img_target_dir . $img_filename;

    $uploadOk = 1;
    // Check if directories exist and are writable (Important for proper setup)
    if (!is_dir($pdf_target_dir) || !is_writable($pdf_target_dir)) $uploadOk = 0;
    if (!is_dir($img_target_dir) || !is_writable($img_target_dir)) $uploadOk = 0;

    // Attempt to move uploaded files
    if ($uploadOk && move_uploaded_file($_FILES["book_file"]["tmp_name"], $pdf_target_file) && move_uploaded_file($_FILES["book_image"]["tmp_name"], $img_target_file)) {
        
        // 3. Save Data (Using JSON for simulation, use MySQL for production)
        $new_book = [
            'id' => $book_id,
            'title' => $title,
            'author' => $author,
            'category' => $category,
            'id_path' => $pdf_target_file, // The file path for the PDF
            'image' => $img_target_file    // The file path for the image
        ];

        // Load existing books
        $all_books = file_exists('books_data.json') ? json_decode(file_get_contents('books_data.json'), true) : [];
        
        // Add new book to the list
        $all_books[] = $new_book;

        // Save back to JSON file
        if (file_put_contents('books_data.json', json_encode($all_books, JSON_PRETTY_PRINT))) {
            // Success
            header('Location: add-book.php?status=success');
            exit;
        } else {
            // Handle error: could not save data
            header('Location: add-book.php?error=db_save_failed');
            exit;
        }

    } else {
        // Handle error: file upload failed
        header('Location: add-book.php?error=upload_failed');
        exit;
    }
}
?>
