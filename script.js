document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const header = document.querySelector('.header');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNavbar = document.getElementById('main-navbar');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const themeToggleBtn = document.getElementById('theme-toggle-btn'); // For index.html
    const headerSearchInput = document.getElementById('header-search-input'); // For index.html's header search
    const heroScrollBtn = document.querySelector('.scroll-to-categories');

    // NEW: Global variable to hold fetched books
    let fetchedBooksData = {};
    const ALL_CATEGORIES = [
        'عەقیدە', 'تەفسیر', 'حەدیس', 'سیرەی موسولمانان', 'فیقه',
        'هەمەجۆری ئیسلامی', 'سیاسەت', 'مێژوو', 'هەمەجۆر', 'هەموو کتێبەکان'
    ];

    // Function to fetch all books from the server and structure them by category
    async function fetchAndStructureBooks() {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) {
                throw new Error('Failed to fetch books from API');
            }
            const books = await response.json();
            
            // Structure data by category
            const structuredData = { 'هەموو کتێبەکان': [] };
            
            // Initialize all possible categories to ensure they are available in the dropdown/list
            ALL_CATEGORIES.filter(cat => cat !== 'هەموو کتێبەکان').forEach(cat => {
                structuredData[cat] = [];
            });

            books.forEach(book => {
                // Check if the book's category is one of the predefined ones or new
                if (structuredData[book.category] !== undefined) {
                    structuredData[book.category].push(book);
                } else {
                    // Handle new/unexpected categories dynamically if needed, or ignore
                    if (!structuredData[book.category]) structuredData[book.category] = [];
                    structuredData[book.category].push(book);
                }
                structuredData['هەموو کتێبەکان'].push(book);
            });

            fetchedBooksData = structuredData;
            return true; 

        } catch (error) {
            console.error('Error loading books:', error);
            return false;
        }
    }

    // Function to create a book card HTML (Simplified since multi-volume logic is now dynamic/gone)
    function createBookCard(book, category = '') { 
        // NOTE: If you need multi-volume support, you must add 'volumes' data to the MongoDB object 
        // and adjust this function accordingly. For now, it's a single PDF URL.
        
        let bookActionsHtml = `
            <div class="book-actions">
                <a href="${book.pdfUrl}" class="btn read-btn" target="_blank">خوێندنەوە</a>
            </div>
        `;

        return `
            <div class="book-card" data-id="${book._id}" data-title="${book.title.toLowerCase()}" data-author="${book.author.toLowerCase()}" data-category="${category}">
                <img src="${book.image}" alt="${book.title} وێنەی کتێب">
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p>نووسەر: ${book.author}</p>
                </div>
                ${bookActionsHtml}
            </div>
        `;
    }

    // Function to load books into categories (for index.html)
    function loadBooksIntoCategories() {
        const categoriesOnIndex = ALL_CATEGORIES;

        categoriesOnIndex.forEach(category => {
            const containerId = category + '-books';
            const container = document.getElementById(containerId);
            if (container) {
                const booksForCategory = fetchedBooksData[category] || [];
                const booksToDisplay = booksForCategory.slice(0, 4); // Display first 4 books

                container.innerHTML = booksToDisplay.map(book => createBookCard(book, category)).join('');

                // Update "زیاتر ببینە" button href
                const moreBtn = container.nextElementSibling && container.nextElementSibling.querySelector('.view-more-btn');
                if (moreBtn) {
                    moreBtn.href = `all-books.html?category=${category}`;
                }
            }
        });
    }

    // Theme Management (Light/Dark Mode) - (No change in this logic)
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');
        localStorage.setItem('theme', theme); 
        if (themeToggleBtn) { 
            if (theme === 'dark') {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> دۆخی ڕۆشناک';
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> دۆخی تاریک';
            }
        }
    }

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme') || 'dark'; 
    applyTheme(savedTheme);

    // Event listener for theme toggle button on index.html
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    // FETCH DATA and Load Books on Index Page
    if (isIndexPage) { 
        fetchAndStructureBooks().then(() => {
            loadBooksIntoCategories();
        });
    }


    // --- Other UI/UX Logics (Scroll, Header, Hamburger, Settings, Contact Form) - UNCHANGED ---
    // Scroll to Top Button Logic
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { 
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header Visibility on Scroll (only for index.html)
    if (header && !header.classList.contains('all-books-fixed-header')) { 
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) { 
                if (window.scrollY < lastScrollY) {
                    header.classList.remove('hidden-header');
                    if (window.innerWidth <= 1024 && mainNavbar) mainNavbar.classList.remove('active'); 
                } else {
                    header.classList.add('hidden-header');
                    if (mainNavbar) mainNavbar.classList.remove('active'); 
                    if (settingsDropdown) settingsDropdown.classList.remove('show'); 
                }
            } else {
                header.classList.remove('hidden-header');
            }
            lastScrollY = window.scrollY;
        });
    }

    // Hamburger Menu Toggle (only for index.html)
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mainNavbar.classList.toggle('active');
            settingsDropdown.classList.remove('show'); 
        });
    }

    // Settings Dropdown Toggle (only for index.html)
    if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            settingsDropdown.classList.toggle('show');
        });
    }

    // Close dropdowns if clicked outside
    document.addEventListener('click', (e) => {
        if (settingsDropdown && !settingsDropdown.contains(e.target) && settingsToggle && !settingsToggle.contains(e.target)) {
            settingsDropdown.classList.remove('show');
        }
        if (mainNavbar && !mainNavbar.contains(e.target) && hamburgerMenu && !hamburgerMenu.contains(e.target)) {
             if (window.innerWidth <= 1024) { 
                 mainNavbar.classList.remove('active');
            }
        }
    });

    // Event Delegation for Volume Dropdown Toggle - REMOVED AS WE USE SINGLE PDF URL NOW
    // document.addEventListener('click', (e) => { ... });

    // Search Functionality (for index.html header search)
    if (headerSearchInput && isIndexPage) {
        headerSearchInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            const allBookCards = document.querySelectorAll('.book-card');

            allBookCards.forEach(card => {
                const title = card.dataset.title;
                const author = card.dataset.author;

                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'flex'; 
                } else {
                    card.style.display = 'none'; 
                }
            });
        });
    }

    // Smooth scroll for "دەستپێکردنی گەشت" button
    if (heroScrollBtn) {
        heroScrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Handle form submission using Formspree
    const contactForm = document.querySelector('.contact-form');
    // ... (Your existing Formspree logic remains here) ...
    if (contactForm && isIndexPage) {
        const formspreeEndpoint = "https://formspree.io/f/xldpzqbp"; 
        contactForm.setAttribute("action", formspreeEndpoint);
        contactForm.setAttribute("method", "POST");

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('پەیامەکەت بە سەرکەوتوویی نێردرا! سوپاس بۆ پەیوەندیکردنت.');
                    form.reset(); 
                } else {
                    let errorMessage = 'هەڵەیەک ڕوویدا لە کاتی ناردنی پەیامەکە.';
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch (jsonError) {
                        // pass
                    }

                    alert(errorMessage + ' تکایە دووبارە هەوڵبدەوە.');
                    console.error('Formspree submission failed:', response.status, errorMessage);
                }
            } catch (error) {
                console.error('Network error during Formspree submission:', error);
                alert('هەڵەیەک ڕوویدا لە کاتی ناردنی پەیامەکە. تکایە دڵنیابە لە پەیوەندیی ئینتەرنێتەکەت.');
            }
        });
    }


    // Simple smooth scrolling for navigation links (only for index.html)
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                return;
            }
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            if (window.innerWidth <= 1024) {
                 if (mainNavbar) mainNavbar.classList.remove('active');
            }
        });
    });

    // --- Logic for all-books.html and other category pages ---
    const allBooksContainer = document.getElementById('all-books-container');
    const allBooksSearchInput = document.getElementById('all-books-search-input');
    const categoryNameSpan = document.getElementById('category-name');
    const noResultsMessage = document.getElementById('no-results-message');
    const allBooksHeader = document.querySelector('.header.all-books-fixed-header');
    const allBooksHeaderContent = document.querySelector('.all-books-header-content'); 
    const allBooksSearchContainer = document.querySelector('.all-books-search-container'); 

    if (allBooksContainer) { 
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        applyTheme(savedTheme);

        // Fetch data and display on category page
        if (category) {
            categoryNameSpan.textContent = category;
            
            fetchAndStructureBooks().then(() => {
                const booksToDisplay = fetchedBooksData[category] || [];

                if (booksToDisplay.length === 0) {
                     allBooksContainer.innerHTML = `<p style="text-align: center; font-size: 1.5rem; color: var(--gray-text);">ببورە، هیچ کتێبێک بۆ ئەم بەشە نەدۆزرایەوە.</p>`;
                     if (noResultsMessage) noResultsMessage.style.display = 'none';
                     return;
                }
                
                allBooksContainer.innerHTML = booksToDisplay.map(book => createBookCard(book, category)).join('');

                // Header Height and Scroll Logic (Unchanged from existing logic)
                let totalAllBooksHeaderHeight = 0;
                if (allBooksHeaderContent && allBooksSearchContainer) {
                    totalAllBooksHeaderHeight = allBooksHeaderContent.offsetHeight + allBooksSearchContainer.offsetHeight;
                    document.documentElement.style.setProperty('--all-books-header-total-height', `${totalAllBooksHeaderHeight}px`);
                }
                const currentAllBooksSection = document.getElementById('all-books-section');
                if (currentAllBooksSection && totalAllBooksHeaderHeight > 0) {
                     currentAllBooksSection.style.paddingTop = `${totalAllBooksHeaderHeight}px`;
                }

                let lastScrollY = window.scrollY;
                window.addEventListener('scroll', () => {
                    if (allBooksHeader) {
                        totalAllBooksHeaderHeight = (allBooksHeaderContent ? allBooksHeaderContent.offsetHeight : 0) + 
                                                    (allBooksSearchContainer ? allBooksSearchContainer.offsetHeight : 0);
                        document.documentElement.style.setProperty('--all-books-header-total-height', `${totalAllBooksHeaderHeight}px`);

                        if (window.scrollY > totalAllBooksHeaderHeight / 2) { 
                            if (window.scrollY < lastScrollY) {
                                allBooksHeader.classList.remove('hidden-header');
                            } else {
                                allBooksHeader.classList.add('hidden-header');
                            }
                        } else {
                            allBooksHeader.classList.remove('hidden-header');
                        }
                        lastScrollY = window.scrollY;
                    }
                });

                // Search functionality for category pages
                if (allBooksSearchInput) {
                    allBooksSearchInput.addEventListener('keyup', (event) => {
                        const searchTerm = event.target.value.toLowerCase().trim();
                        const cards = allBooksContainer.querySelectorAll('.book-card');
                        let foundResults = 0;

                        cards.forEach(card => {
                            const title = card.dataset.title;
                            const author = card.dataset.author;

                            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                                card.style.display = 'flex';
                                foundResults++;
                            } else {
                                card.style.display = 'none';
                            }
                        });

                        if (foundResults === 0) {
                            noResultsMessage.style.display = 'block';
                        } else {
                            noResultsMessage.style.display = 'none';
                        }
                    });
                }
            });
        } else {
            categoryNameSpan.textContent = "کتێبەکان";
            allBooksContainer.innerHTML = `<p style="text-align: center; font-size: 1.5rem; color: var(--gray-text);">ببورە، ھیچ کتێبێک بۆ ئەم بەشە نەدۆزرایەوە یان بەشەکە دیارینەکراوە.</p>`;
            if (noResultsMessage) noResultsMessage.style.display = 'none'; 
        }
    }


    // --- NEW: Logic for add-book.html (Admin Panel) ---

    // Admin Panel Elements
    const adminPanelSection = document.getElementById('admin-panel-section');
    const adminLoginSection = document.getElementById('admin-login-section');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginErrorMessage = document.getElementById('login-error-message');
    const addBookForm = document.getElementById('add-book-form');
    const bookCategorySelect = document.getElementById('book-category-select');
    const adminBooksList = document.getElementById('admin-books-list');
    const adminCurrentCategorySpan = document.getElementById('admin-current-category'); 
    
    // Hardcoded Admin Password (MUST MATCH .env)
    const ADMIN_PASSWORD = "QudtI825nKesOETC9250bople8E8d1HK62M";
    
    // Check if we are on the admin page
    if (window.location.pathname.endsWith('add-book.html')) {
        // We will populate the category select after fetching books
    }

    // Function to populate the category selector
    function populateCategorySelect() {
        if (bookCategorySelect) {
            bookCategorySelect.innerHTML = ''; 
            // Get unique categories from the fetched data
            const categories = Object.keys(fetchedBooksData).filter(cat => cat !== 'هەموو کتێبەکان');

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                bookCategorySelect.appendChild(option);
            });
        }
    }

    // Function to display the list of books in the admin panel
    async function displayAdminBooks(category) {
        if (adminBooksList) {
            if(adminCurrentCategorySpan) {
                adminCurrentCategorySpan.textContent = category;
            }
            adminBooksList.innerHTML = '<p style="text-align: center; color: var(--gray-text);">لۆدکردنی کتێبەکان...</p>';

            try {
                // Fetch books directly for the selected category
                const response = await fetch(`/api/books?category=${category}`);
                const books = await response.json();
                
                adminBooksList.innerHTML = ''; 

                if (books.length === 0) {
                     adminBooksList.innerHTML = '<p style="text-align: center; color: var(--gray-text);">هیچ کتێبێک لەم بەشەدا نییە.</p>';
                     return;
                }

                books.forEach(book => {
                    const bookCard = document.createElement('div');
                    bookCard.className = 'book-card';
                    // Use book._id which is the MongoDB ID
                    bookCard.dataset.id = book._id; 
                    bookCard.style.cssText = 'padding-bottom: 10px; flex-direction: column; align-items: center; text-align: center;';
                    bookCard.innerHTML = `
                        <img src="${book.image}" alt="${book.title} وێنەی کتێب" style="width: 100%; height: 300px; object-fit: cover;">
                        <div class="book-info" style="padding: 15px; width: 100%;">
                            <h4>${book.title}</h4>
                            <p>نووسەر: ${book.author}</p>
                            <p style="font-size: 0.9rem; color: var(--primary-color);">ناونیشان: <a href="${book.pdfUrl}" target="_blank">فایلی PDF</a></p>
                            <div class="book-actions" style="justify-content: space-around; margin-top: 15px;">
                                <button class="btn primary-btn btn-sm edit-btn" data-id="${book._id}" data-category="${category}">گۆڕانکاری</button>
                                <button class="btn secondary-btn btn-sm delete-btn" data-id="${book._id}" data-category="${category}" style="background-color: #dc3545; color: var(--white);">سڕینەوە</button>
                            </div>
                        </div>
                    `;
                    adminBooksList.appendChild(bookCard);
                });
            } catch (error) {
                console.error('Error displaying admin books:', error);
                adminBooksList.innerHTML = '<p style="text-align: center; color: red;">هەڵەیەک ڕوویدا لە وەرگرتنی کتێبەکان.</p>';
            }
        }
    }

    // Admin Login Logic
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const enteredPassword = adminPasswordInput.value.trim();
            if (enteredPassword === ADMIN_PASSWORD) {
                adminLoginSection.style.display = 'none';
                adminPanelSection.style.display = 'block';
                loginErrorMessage.style.display = 'none';
                
                fetchAndStructureBooks().then(() => {
                    populateCategorySelect();
                    if (bookCategorySelect && bookCategorySelect.value) {
                        displayAdminBooks(bookCategorySelect.value);
                    } else {
                        // Default to the first hardcoded category if select is empty
                        displayAdminBooks(ALL_CATEGORIES[0]);
                    }
                });
            } else {
                loginErrorMessage.style.display = 'block';
            }
        });

        // Event listener for category change in admin panel
        if (bookCategorySelect) {
            bookCategorySelect.addEventListener('change', (e) => {
                displayAdminBooks(e.target.value);
            });
        }
    }

    // Form Submission for Adding Book (HAMESHAYY KHAZN KRDN)
    if (addBookForm) {
        addBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bookTitle = document.getElementById('book-title-input').value.trim();
            const bookAuthor = document.getElementById('book-author-input').value.trim();
            const bookFile = document.getElementById('book-file-input').files[0];
            const bookImage = document.getElementById('book-image-input').files[0];
            const selectedCategory = bookCategorySelect.value;
            const adminPassword = adminPasswordInput.value.trim(); 

            if (!bookTitle || !bookAuthor || !bookFile || !bookImage || !selectedCategory || !adminPassword) {
                 alert("تکایە هەموو خانەکان پڕبکەرەوە، لەوانەش وشەی نهێنی چوونەژوورەوە.");
                 return;
            }

            const formData = new FormData();
            formData.append('title', bookTitle);
            formData.append('author', bookAuthor);
            formData.append('category', selectedCategory);
            formData.append('bookFile', bookFile); 
            formData.append('bookImage', bookImage); 
            formData.append('adminPassword', adminPassword); 

            try {
                const response = await fetch('/api/books', {
                    method: 'POST',
                    body: formData, 
                });

                if (response.status === 401) {
                    alert('وشەی نھێنی ئیدارە ھەڵەیە یان مافی بەکارهێنانت نییە.');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'هەڵەیەک ڕوویدا لە کاتی زیادکردنی کتێب.');
                }
                
                const newBook = await response.json();
                
                alert(`کتێبەکە (${newBook.title}) بە سەرکەوتوویی زیاد کرا و لە Cloudinary خەزن کرا.`);
                
                addBookForm.reset();
                
                await fetchAndStructureBooks(); 
                displayAdminBooks(selectedCategory); 

            } catch (error) {
                console.error('Submission Error:', error);
                alert('نەتوانرا کتێبەکە زیاد بکرێت. هەڵە: ' + error.message);
            }
        });
    }

    // Delete/Edit Buttons (HAMESHAYY SRINWA)
    if (adminBooksList) {
        adminBooksList.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            const editBtn = e.target.closest('.edit-btn');

            if (deleteBtn) {
                const bookId = deleteBtn.dataset.id;
                const category = deleteBtn.dataset.category;
                const adminPassword = adminPasswordInput.value.trim(); 

                if (!adminPassword) {
                     alert("تکایە وشەی نهێنی چوونەژوورەوە داخڵ بکە بۆ سڕینەوە.");
                     return;
                }

                if (confirm(`دڵنیای لە سڕینەوەی هەمیشەیی کتێبی ${bookId} لە بەشی ${category}؟ ئەم کارە هەم کتێبەکە لە داتابەیس و هەم فایلەکان لە Cloudinary دەسڕێتەوە.`)) {
                    
                    try {
                        const response = await fetch(`/api/books/${bookId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-admin-password': adminPassword
                            }
                        });

                        if (response.status === 401) {
                            alert('وشەی نھێنی ئیدارە ھەڵەیە یان مافی بەکارهێنانت نییە.');
                            return;
                        }

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'هەڵەیەک ڕوویدا لە کاتی سڕینەوەی کتێبەکە.');
                        }

                        await fetchAndStructureBooks(); 
                        displayAdminBooks(category); 
                        
                        alert(`کتێبەکە (${bookId}) بە سەرکەوتوویی بە شێوەیەکی هەمیشەیی سڕدرایەوە.`);

                    } catch (error) {
                        console.error('Deletion Error:', error);
                        alert('نەتوانرا کتێبەکە بسڕدرێتەوە. هەڵە: ' + error.message);
                    }
                }

            } else if (editBtn) {
                 const bookId = editBtn.dataset.id;
                 const category = editBtn.dataset.category;
                alert(`ئاگاداری: گۆڕانکاری لە کتێبی ${bookId} لە بەشی ${category}. ئەمە پێویستی بە پاشخان و ڕووکارێکی دەستکاریکردن هەیە.`);
            }
        });
    }

});
