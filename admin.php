<?php
// Configuration
$PASSWORD = 'sarkawtn-tanha-bo-sarxarani-islama1400';
$BOOKS_FILE = 'books_data.json'; // File to store book metadata
$UPLOADS_DIR = 'uploads/'; // Directory for PDF files and images (Must be writable)
$CATEGORIES = [
    'عەقیدە' => 'عەقیدە',
    'تەفسیر' => 'تەفسیر',
    'حەدیس' => 'حەدیس',
    'سیرەی موسولمانان' => 'سیرەی موسولمانان',
    'فیقه' => 'فیقه',
    'هەمەجۆری ئیسلامی' => 'هەمەجۆری ئیسلامی',
    'سیاسەت' => 'سیاسەت',
    'مێژوو' => 'مێژوو',
    'هەمەجۆر' => 'هەمەجۆر'
];

// Start session for password protection
session_start();

// --- Utility Functions ---

function load_books() {
    global $BOOKS_FILE;
    if (!file_exists($BOOKS_FILE)) {
        // Create an empty file if it doesn't exist
        file_put_contents($BOOKS_FILE, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return [];
    }
    $json = file_get_contents($BOOKS_FILE);
    return json_decode($json, true) ?: [];
}

function save_books($books) {
    global $BOOKS_FILE;
    $json = json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($BOOKS_FILE, $json);
}

// --- Authentication Logic ---

$isAuthenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

if (isset($_POST['password_submit'])) {
    if ($_POST['password'] === $PASSWORD) {
        $_SESSION['authenticated'] = true;
        $isAuthenticated = true;
        header('Location: admin.php'); // Redirect to self to remove POST data
        exit;
    } else {
        $loginError = "وشەی نهێنی نادروستە.";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// --- Book Management Logic ---
$message = '';
$error = '';

if ($isAuthenticated) {
    // Ensure the uploads directory exists
    if (!is_dir($UPLOADS_DIR)) {
        if (!mkdir($UPLOADS_DIR, 0777, true)) {
            $error = "هەڵە: نەتوانرا فۆڵدەری 'uploads/' دروست بکرێت. تکایە بەدەستی خۆت دروستی بکە و ڕێگەی پێبدە (Permissions).";
        }
    }

    $books = load_books();

    // Handle ADD/EDIT Book
    if (isset($_POST['add_edit_book'])) {
        $title = trim($_POST['title']);
        $author = trim($_POST['author']);
        $category = $_POST['category'];
        $book_id = $_POST['book_id'] ?? null;
        
        $currentBook = $book_id ? ($books[$book_id] ?? null) : null;
        
        if (empty($title) || empty($author) || empty($category)) {
            $error = "تکایە هەموو کێڵگەکان پڕ بکەرەوە.";
        } elseif (!isset($CATEGORIES[$category])) {
            $error = "بەشێکی نادروست هەڵبژێردراوە.";
        } else {
            $book_file_path = $currentBook['id'] ?? '';
            $image_file_path = $currentBook['image'] ?? '';
            $is_edit = $book_id !== null;
            
            // Handle Book File Upload
            if (isset($_FILES['book_file']) && $_FILES['book_file']['error'] === UPLOAD_ERR_OK) {
                $file_tmp = $_FILES['book_file']['tmp_name'];
                $file_extension = pathinfo($_FILES['book_file']['name'], PATHINFO_EXTENSION);
                if (strtolower($file_extension) !== 'pdf') {
                    $error = "تکایە تەنیا فایلی PDF باربکە.";
                } else {
                    $file_name = uniqid('book_') . '_' . basename($_FILES['book_file']['name']);
                    $new_book_file_path = $UPLOADS_DIR . $file_name;
                    
                    if (move_uploaded_file($file_tmp, $new_book_file_path)) {
                        // Delete old file if editing and a new one was uploaded
                        if ($is_edit && $book_file_path && file_exists($book_file_path)) {
                            unlink($book_file_path);
                        }
                        $book_file_path = $new_book_file_path;
                    } else {
                        $error = "هەڵە لە بارکردنی فایلی کتێبەکەدا ڕوویدا.";
                    }
                }
            } elseif (!$is_edit) { // Required for new book
                $error = "تکایە فایلی کتێبەکە باربکە.";
            }

            // Handle Image File Upload
            if (isset($_FILES['book_image']) && $_FILES['book_image']['error'] === UPLOAD_ERR_OK) {
                $image_tmp = $_FILES['book_image']['tmp_name'];
                $image_extension = pathinfo($_FILES['book_image']['name'], PATHINFO_EXTENSION);
                $allowed_images = ['jpg', 'jpeg', 'png', 'gif', 'heic']; // Assuming HEIC is handled by the browser/server
                
                if (!in_array(strtolower($image_extension), $allowed_images)) {
                    $error = "تکایە تەنیا وێنەی جۆری (JPG, PNG, GIF) باربکە.";
                } else {
                    $image_name = uniqid('img_') . '_' . basename($_FILES['book_image']['name']);
                    $new_image_file_path = $UPLOADS_DIR . $image_name;
                    
                    if (move_uploaded_file($image_tmp, $new_image_file_path)) {
                        // Delete old image if editing and a new one was uploaded
                        if ($is_edit && $image_file_path && file_exists($image_file_path)) {
                            unlink($image_file_path);
                        }
                        $image_file_path = $new_image_file_path;
                    } else {
                        $error = "هەڵە لە بارکردنی وێنەی بەرگەکەدا ڕوویدا.";
                    }
                }
            } elseif (!$is_edit) { // Required for new book
                $error = "تکایە وێنەی بەرگەکە باربکە.";
            }

            if (empty($error) && !empty($book_file_path) && !empty($image_file_path)) {
                $new_book = [
                    'id' => $book_file_path, // PDF path is used as ID (for simplicity)
                    'title' => $title,
                    'author' => $author,
                    'image' => $image_file_path,
                    'category' => $category,
                    'is_custom' => true 
                ];
                
                if ($book_id && isset($books[$book_id])) {
                    $books[$book_id] = $new_book;
                    $message = "کتێبەکە بە سەرکەوتوویی نوێ کرایەوە.";
                } else {
                    // Use a unique ID based on timestamp and a small random number
                    $new_id = time() . mt_rand(100, 999);
                    $books[$new_id] = $new_book;
                    $message = "کتێبی نوێ بە سەرکەوتوویی بڵاوکرایەوە.";
                }
                
                save_books($books);
                // Redirect to self to clear post data and show the list
                header('Location: admin.php?message=' . urlencode($message));
                exit;
            }
        }
    }
    
    // Handle DELETE Book
    if (isset($_POST['delete_book'])) {
        $delete_id = $_POST['delete_id'];
        if (isset($books[$delete_id])) {
            $book_to_delete = $books[$delete_id];
            
            // Delete associated files
            if (file_exists($book_to_delete['id'])) {
                unlink($book_to_delete['id']);
            }
            if (file_exists($book_to_delete['image'])) {
                unlink($book_to_delete['image']);
            }
            
            unset($books[$delete_id]);
            save_books($books);
            $message = "کتێبەکە بە سەرکەوتوویی سڕایەوە.";
            // Redirect to self to clear post data
            header('Location: admin.php?message=' . urlencode($message));
            exit;
        } else {
            $error = "کتێبەکە نەدۆزرایەوە بۆ سڕینەوە.";
        }
    }
    
    // Check for a redirect message
    if (isset($_GET['message'])) {
        $message = htmlspecialchars($_GET['message']);
    }
}
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>زیادکردنی کتێب - بەشی بەڕێوەبردن</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="<?php echo isset($_SESSION['theme']) && $_SESSION['theme'] === 'light' ? 'light-theme' : 'dark-theme'; ?>">

    <!-- Header / Navigation Bar (Minimal version, using index.html's structure) -->
    <header class="header">
        <div class="container">
            <div class="logo">
                <a href="index.html">کتێبخانەی شاھانە</a>
            </div>
            <nav class="navbar">
                <ul>
                    <li><a href="index.html">سەرەتا</a></li>
                    <?php if ($isAuthenticated): ?>
                    <li><a href="?logout=1" class="btn secondary-btn btn-sm" style="margin-right: 20px;">دەرچوون <i class="fas fa-sign-out-alt"></i></a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>

    <div class="admin-page-container">
        <div class="container">
            <h2 class="section-title">بەشی بەڕێوەبردن: زیادکردنی کتێب</h2>

            <?php if (!empty($message)): ?>
                <div style="text-align: center; color: var(--primary-color); font-size: 1.2rem; margin-bottom: 20px; padding: 10px; background-color: var(--card-bg); border-radius: 5px;"><?= $message ?></div>
            <?php endif; ?>
            <?php if (!empty($error)): ?>
                <div style="text-align: center; color: #e74c3c; font-size: 1.2rem; margin-bottom: 20px; padding: 10px; background-color: var(--card-bg); border-radius: 5px;">هەڵە: <?= $error ?></div>
            <?php endif; ?>

            <?php if (!$isAuthenticated): ?>
                <!-- Login Form -->
                <div class="auth-form-container">
                    <h3>داخڵبوون بۆ بەشی بەڕێوەبردن</h3>
                    <?php if (isset($loginError)): ?>
                        <p style="color: #e74c3c;"><?= $loginError ?></p>
                    <?php endif; ?>
                    <form method="POST" action="admin.php">
                        <input type="password" name="password" placeholder="وشەی نهێنی" required>
                        <button type="submit" name="password_submit" class="btn primary-btn">داخڵبوون</button>
                    </form>
                </div>
            <?php else: 
                $edit_book = null;
                if (isset($_GET['edit_id'])) {
                    $edit_id = $_GET['edit_id'];
                    $edit_book = $books[$edit_id] ?? null;
                }
            ?>
                <!-- Add/Edit Book Form -->
                <form class="add-book-form" method="POST" action="admin.php" enctype="multipart/form-data">
                    <h3><?= $edit_book ? 'دەستکاریکردنی کتێب: ' . htmlspecialchars($edit_book['title']) : 'زیادکردنی کتێبی نوێ' ?></h3>
                    
                    <?php if ($edit_book): ?>
                        <input type="hidden" name="book_id" value="<?= htmlspecialchars($edit_id) ?>">
                    <?php endif; ?>
                    
                    <input type="text" name="title" placeholder="ناوی کتێب" value="<?= htmlspecialchars($_POST['title'] ?? $edit_book['title'] ?? '') ?>" required>
                    <input type="text" name="author" placeholder="ناوی نووسەر" value="<?= htmlspecialchars($_POST['author'] ?? $edit_book['author'] ?? '') ?>" required>
                    
                    <!-- Book File Input -->
                    <div class="file-input-group">
                        <!-- Custom styled label for file input -->
                        <label for="book_file_upload" class="file-upload-label secondary-btn">
                            <i class="fas fa-file-pdf"></i>
                            <?= $edit_book ? 'گۆڕینی فایلی کتێب (PDF)' : 'ئیمپۆرت کردنی فایلی کتێب (PDF)' ?>
                            <?php if ($edit_book): ?><span style="font-weight: normal; font-size: 0.9em; margin-right: 10px; color: var(--primary-color);"> (پێشوو: <?= htmlspecialchars(basename($edit_book['id'])) ?>)</span><?php endif; ?>
                        </label>
                        <input type="file" id="book_file_upload" name="book_file" accept=".pdf" <?= $edit_book ? '' : 'required' ?>>
                    </div>

                    <!-- Image File Input -->
                    <div class="file-input-group">
                        <!-- Custom styled label for image input -->
                        <label for="book_image_upload" class="file-upload-label secondary-btn">
                            <i class="fas fa-image"></i>
                            <?= $edit_book ? 'گۆڕینی وێنەی بەرگ' : 'ئیمپۆرت کردنی وێنەی بەرگ' ?>
                            <?php if ($edit_book): ?><span style="font-weight: normal; font-size: 0.9em; margin-right: 10px; color: var(--primary-color);"> (پێشوو: <?= htmlspecialchars(basename($edit_book['image'])) ?>)</span><?php endif; ?>
                        </label>
                        <input type="file" id="book_image_upload" name="book_image" accept="image/*" <?= $edit_book ? '' : 'required' ?>>
                    </div>
                    
                    <select name="category" required>
                        <option value="">هەڵبژاردنی بەش</option>
                        <?php foreach ($CATEGORIES as $key => $name): ?>
                            <option value="<?= htmlspecialchars($key) ?>" 
                                <?= ($edit_book && $edit_book['category'] === $key) || (isset($_POST['category']) && $_POST['category'] === $key) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($name) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>

                    <button type="submit" name="add_edit_book" class="btn primary-btn btn-lg">
                        <i class="fas fa-upload"></i>
                        <?= $edit_book ? 'پاشەکەوتکردنی گۆڕانکارییەکان' : 'بڵاوکردنەوەی کتێب' ?>
                    </button>
                    
                    <?php if ($edit_book): ?>
                    <a href="admin.php" class="btn secondary-btn btn-lg" style="text-align: center;">پاشگەزبوونەوە</a>
                    <?php endif; ?>
                </form>

                <!-- Book Management List -->
                <div class="book-management-list">
                    <h2>کتێبە بڵاوکراوەکان (کۆی گشتی: <?= count($books) ?>)</h2>
                    <?php if (empty($books)): ?>
                        <p style="text-align: center; color: var(--gray-text);">هیچ کتێبێکی بڵاوکراوە نییە.</p>
                    <?php else: ?>
                        <?php 
                        // Reverse array to show newest books first
                        $reversed_books = array_reverse($books, true); 
                        foreach ($reversed_books as $key => $book): 
                        ?>
                            <div class="book-list-item">
                                <img src="<?= htmlspecialchars($book['image']) ?>" alt="<?= htmlspecialchars($book['title']) ?> Cover">
                                <div class="book-details">
                                    <h4><?= htmlspecialchars($book['title']) ?></h4>
                                    <p>نووسەر: <?= htmlspecialchars($book['author']) ?></p>
                                    <p>بەش: <?= htmlspecialchars($book['category']) ?></p>
                                </div>
                                <div class="book-actions-admin">
                                    <a href="?edit_id=<?= htmlspecialchars($key) ?>" class="btn edit-btn">گۆڕانکاری</a>
                                    <form method="POST" action="admin.php" onsubmit="return confirm('دڵنیای لە سڕینەوەی ئەم کتێبە؟ ئەم کردارە ناتوانرێت هەڵبگیرێتەوە!');">
                                        <input type="hidden" name="delete_id" value="<?= htmlspecialchars($key) ?>">
                                        <button type="submit" name="delete_book" class="btn delete-btn">سڕینەوە</button>
                                    </form>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>

            <?php endif; ?>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer" style="border-top: none;">
        <div class="container">
            <p>&copy; 2023 کتێبخانەی شاھانە. بەشی بەڕێوەبردن.</p>
        </div>
    </footer>

    <!-- Keep script.js for theme functionality -->
    <script src="script.js"></script> 
</body>
</html>
