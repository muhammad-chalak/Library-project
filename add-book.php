<?php
// PHP SCRIPT START - This part handles the password and session management

session_start();

$required_password = "QudtI825nKesOETC9250bople8E8d1HK62M";
$is_authenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// Handle Login Form Submission
if (isset($_POST['password'])) {
    if ($_POST['password'] === $required_password) {
        $_SESSION['authenticated'] = true;
        $is_authenticated = true;
        // Redirect to clear the POST data
        header('Location: add-book.php');
        exit;
    } else {
        $login_error = "وشەی نھێنی هەڵەیە.";
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: add-book.php');
    exit;
}

// Check if a database connection or file handler is needed here
// In a real application, you'd include your DB connection logic here:
// include 'db_config.php'; 

// Function to simulate saving books to a JSON file (simple database simulation)
function get_all_books() {
    if (file_exists('books_data.json')) {
        return json_decode(file_get_contents('books_data.json'), true);
    }
    return [];
}

// In a real scenario, more complex PHP would handle:
// 1. File Uploads (moving files to photos/ and pdfs/ directories)
// 2. Database (MySQL) INSERT, UPDATE, DELETE queries.

?>

<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>زیادکردنی کتێب - بەڕێوەبردن</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="dark-theme"> 
    <div id="main-content" class="main-content">
        
        <!-- Header for Admin Page -->
        <header class="header all-books-fixed-header" style="position: relative;">
            <div class="container all-books-header-content">
                <h1 class="page-title">بەشی زیادکردنی کتێب</h1>
                <div class="back-button">
                    <a href="index.html" class="btn primary-btn btn-sm back-to-home">
                        <i class="fas fa-arrow-right"></i> گەڕانەوە
                    </a>
                </div>
            </div>
            <?php if ($is_authenticated): ?>
            <div class="container all-books-search-container" style="background: none; box-shadow: none; border: none;">
                <p style="text-align: center; color: var(--light-text); font-size: 1.1rem;">بەخێربێیت، دەتوانیت کتێب زیاد بکەیت یان بەڕێوەی بەریت. <a href="?logout=1" class="btn secondary-btn btn-sm" style="margin-right: 15px;">چوونە دەرەوە</a></p>
            </div>
            <?php endif; ?>
        </header>

        <section id="admin-section" class="categories-section" style="padding-top: 50px;">
            <div class="container">
                
                <?php if (!$is_authenticated): ?>
                <!-- Login Form -->
                <div class="admin-login-wrapper">
                    <div class="admin-login-card">
                        <h2>چوونەژوورەوەی بەڕێوەبەر</h2>
                        <?php if (isset($login_error)): ?>
                            <p class="error-message"><?php echo $login_error; ?></p>
                        <?php endif; ?>
                        <form method="POST" action="add-book.php" class="login-form">
                            <label for="admin-password">وشەی نھێنی:</label>
                            <input type="password" id="admin-password" name="password" required>
                            <button type="submit" class="btn primary-btn">چوونەژوورەوە</button>
                        </form>
                    </div>
                </div>
                
                <?php else: 
                
                // Get existing books to display for the admin
                $existing_books = get_all_books();

                ?>
                <!-- Main Admin Content (Add Form & Management Table) -->
                
                <!-- 1. Add New Book Form -->
                <div class="category-block add-book-form-block">
                    <h3 class="category-title" style="color: var(--primary-color);">زیادکردنی کتێبی نوێ</h3>
                    <form id="add-book-form" class="contact-form" action="add_book_handler.php" method="POST" enctype="multipart/form-data">
                        
                        <label for="book-title-input">ناوی کتێب:</label>
                        <input type="text" id="book-title-input" name="title" placeholder="ناوی کتێب" required>

                        <label for="book-author-input">ناوی نووسەر:</label>
                        <input type="text" id="book-author-input" name="author" placeholder="ناوی نووسەر" required>

                        <label for="book-category-select">هەڵبژاردنی بەش:</label>
                        <select id="book-category-select" name="category" required>
                            <option value="">-- بەشێک هەڵبژێرە --</option>
                            <option value="عەقیدە">کتێبی عەقیدە</option>
                            <option value="تەفسیر">کتێبی تەفسیر</option>
                            <option value="حەدیس">کتێبی حەدیس</option>
                            <option value="سیرەی موسولمانان">کتێبی سیرەی موسولمانان</option>
                            <option value="فیقه">کتێبی فقە</option>
                            <option value="هەمەجۆری ئیسلامی">کتێبی هەمەجۆری ئیسلامی</option>
                            <option value="سیاسەت">کتێبی سیاسەت</option>
                            <option value="مێژوو">کتێبی مێژوو</option>
                            <option value="هەمەجۆر">کتێبی هەمەجۆر</option>
                        </select>

                        <label for="book-file-input">فایلی کتێب (PDF):</label>
                        <input type="file" id="book-file-input" name="book_file" accept=".pdf" required>

                        <label for="book-image-input">وێنەی بەرگی کتێب:</label>
                        <input type="file" id="book-image-input" name="book_image" accept="image/*" required>

                        <button type="submit" class="btn primary-btn" style="width: 100%;">بڵاوکردنەوە</button>
                    </form>
                    <div id="upload-status-message" style="margin-top: 20px; text-align: center; color: green; display: none;">کتێبەکە بە سەرکەوتوویی زیاد کرا!</div>
                </div>

                <!-- 2. Manage Existing Books Table -->
                <div class="category-block manage-books-block" style="margin-top: 80px;">
                    <h3 class="category-title" style="color: var(--primary-color);">بەڕێوەبردنی کتێبەکان</h3>
                    
                    <div class="book-management-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ناوی کتێب</th>
                                    <th>نووسەر</th>
                                    <th>بەش</th>
                                    <th>کردارەکان</th>
                                </tr>
                            </thead>
                            <tbody id="admin-books-list">
                                <?php if (empty($existing_books)): ?>
                                    <tr><td colspan="4" style="text-align: center; color: var(--gray-text);">هیچ کتێبێک پۆست نەکراوە.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($existing_books as $book): ?>
                                    <tr data-id="<?php echo htmlspecialchars($book['id']); ?>">
                                        <td><?php echo htmlspecialchars($book['title']); ?></td>
                                        <td><?php echo htmlspecialchars($book['author']); ?></td>
                                        <td><?php echo htmlspecialchars($book['category']); ?></td>
                                        <td>
                                            <button class="btn secondary-btn btn-sm edit-book-btn">گۆڕانکاری</button>
                                            <button class="btn primary-btn btn-sm delete-book-btn" style="background-color: #dc3545;">سڕینەوە</button>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Edit Modal/Form (Hidden by default) -->
                <div id="edit-modal" class="edit-modal hidden">
                    <div class="edit-modal-content">
                        <h3>گۆڕانکاری لە کتێب</h3>
                        <form id="edit-book-form" class="contact-form" action="update_book_handler.php" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="book_id" id="edit-book-id">

                            <label for="edit-book-title">ناوی کتێب:</label>
                            <input type="text" id="edit-book-title" name="title" required>

                            <label for="edit-book-author">ناوی نووسەر:</label>
                            <input type="text" id="edit-book-author" name="author" required>

                            <label for="edit-book-category">هەڵبژاردنی بەش:</label>
                            <select id="edit-book-category" name="category" required>
                                <option value="عەقیدە">کتێبی عەقیدە</option>
                                <option value="تەفسیر">کتێبی تەفسیر</option>
                                <!-- ... add all other categories ... -->
                            </select>

                            <label for="edit-book-file">فایلی نوێ (بۆ گۆڕین):</label>
                            <input type="file" id="edit-book-file" name="book_file" accept=".pdf">

                            <label for="edit-book-image">وێنەی بەرگی نوێ (بۆ گۆڕین):</label>
                            <input type="file" id="edit-book-image" name="book_image" accept="image/*">
                            
                            <div class="edit-modal-actions">
                                <button type="submit" class="btn primary-btn">پاشەکەوتکردنی گۆڕانکاری</button>
                                <button type="button" class="btn secondary-btn close-modal-btn">داخستن</button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <?php endif; ?>
                
            </div>
        </section>

        <!-- Footer -->
        <?php include 'footer.html'; // Assuming you'd have a separate footer file ?>
        <footer class="footer">
            <div class="container">
                <p>&copy; 2023 کتێبخانەی شاھانە. ھەموو مافەکانی پارێزراون.</p>
            </div>
        </footer>
    </div>
    
    <script src="script.js"></script>
    <script>
        // JS logic for form submission and modal management can be added here or in script.js
        document.addEventListener('DOMContentLoaded', () => {
            const editModal = document.getElementById('edit-modal');
            const closeButton = document.querySelector('.close-modal-btn');
            
            // Assuming your books are loaded dynamically, attach listeners to the table
            document.querySelectorAll('.delete-book-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if(confirm('دڵنیای لە سڕینەوەی ئەم کتێبە؟')) {
                        const bookId = this.closest('tr').dataset.id;
                        // In a real app, you would send an AJAX request to delete_book_handler.php
                        console.log('Delete book with ID:', bookId);
                        // Example AJAX:
                        // fetch('delete_book_handler.php', { method: 'POST', body: JSON.stringify({ id: bookId }) })
                        // .then(response => { /* handle response and remove row */ });
                    }
                });
            });

            document.querySelectorAll('.edit-book-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const row = this.closest('tr');
                    const bookId = row.dataset.id;
                    
                    // In a real app, you would fetch book details from the server by ID
                    // For now, use the data in the row for demonstration
                    document.getElementById('edit-book-id').value = bookId;
                    document.getElementById('edit-book-title').value = row.cells[0].textContent;
                    document.getElementById('edit-book-author').value = row.cells[1].textContent;
                    document.getElementById('edit-book-category').value = row.cells[2].textContent;
                    
                    editModal.classList.remove('hidden');
                });
            });

            closeButton.addEventListener('click', () => {
                editModal.classList.add('hidden');
            });
            
            // Simple success message display after successful form submission (client-side only for this example)
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('status') === 'success') {
                document.getElementById('upload-status-message').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('upload-status-message').style.display = 'none';
                    // Clear the URL to prevent message from showing again on refresh
                    window.history.pushState({}, document.title, window.location.pathname);
                }, 5000);
            }
        });
    </script>
</body>
</html>
