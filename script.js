document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
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

    // Sample book data (10 books per category, extended for new categories)
    const booksData = {
        'عەقیدە': [
            { id: '/pdfs/pdfs-1.pdf', title: 'سەرمایەی ژیان', author: 'محەمەد ڕەشید قەبانی', image: '/photos/photos-10.JPG' },
            { id: 'aq2', title: 'عەقیدەی موسوڵمان', author: 'سەعید نوردەسی', image: 'https://cdn.islamicbook.ws/10/71/10719.jpg' },
            { id: 'aq3', title: 'پرشنگێک لە جوانییەکانی ئیسلام', author: 'موستەفا عەبدولڕەزاق', image: 'https://cdn.islamicbook.ws/13/50/21503.jpg' },
            { id: 'aq4', title: 'شەش خاڵ دەربارەی عەقیدە', author: 'عەبدولعەزیز ابن باز', image: 'https://cdn.islamicbook.ws/10/72/10729.jpg' },
            { id: 'aq5', title: 'فەرموودە جوانەکان', author: 'موستەفا قاسم', image: 'https://cdn.islamicbook.ws/13/19/21422.jpg' },
            { id: 'aq6', title: 'کتێبی عەقیدە', author: 'د.محەمەد وەتەر', image: 'https://cdn.islamicbook.ws/28/73/28731.jpg' },
            { id: 'aq7', title: 'ئەساسی عەقیدە', author: 'شێخ موحەمەد ساڵح', image: 'https://cdn.islamicbook.ws/10/74/10740.jpg' },
            { id: 'aq8', title: 'گەشتێک بەناو دونیای عەقیدەدا', author: 'د. عومەر عەبدولکافی', image: 'https://cdn.islamicbook.ws/27/29/27290.jpg' },
            { id: 'aq9', title: 'بنەماکانی عەقیدە', author: 'عەبدولکەریم حەسەن', image: 'https://cdn.islamicbook.ws/10/76/10761.jpg' },
            { id: 'aq10', title: 'عەقیدەی ئیسلامی', author: 'ئیمامی ئەشعەری', image: 'https://cdn.islamicbook.ws/10/78/10780.jpg' },
            { id: 'aq11', title: 'پوختەی عەقیدەی سوننە', author: 'احمد ابن تیمیة', image: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=پوختەی+عەقیدە' },
            { id: 'aq12', title: 'سیرەی نەبەوی', author: 'ابن هشام', image: 'https://via.placeholder.com/300x400/7b1fa2/ffffff?text=سیرە' },
            { id: 'aq13', title: 'چوار بنەمای ئیسلام', author: 'محمد بن عبدالوهاب', image: 'https://via.placeholder.com/300x400/5e35b1/ffffff?text=چوار+بنەما' },
            { id: 'aq14', title: 'نامیلکەی عەقیدە', author: 'محمد بن صالح العثيمين', image: 'https://via.placeholder.com/300x400/4527a0/ffffff?text=نامیلکە' },
            { id: 'aq15', title: 'تەوحیدی ئولوهیەت', author: 'ابن قیم الجوزية', image: 'https://via.placeholder.com/300x400/311b92/ffffff?text=تەوحید' }
        ],
        'تەفسیر': [
            { id: 't1', title: 'تەفسیری ڕوونی قورئان', author: 'د. عبدلکریم زێدان', image: 'https://via.placeholder.com/300x400/3498db/ffffff?text=تەفسیر+1' },
            { id: 't2', title: 'کوردی تەفسیری قورئان', author: 'موحەمەد عەلی', image: 'https://via.placeholder.com/300x400/2980b9/ffffff?text=تەفسیر+2' },
            { id: 't3', title: 'تەفسیری ئاسان', author: 'شێخ محەمەد ساڵح', image: 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=تەفسیر+3' },
            { id: 't4', title: 'وشە بە وشەی قورئان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/1abc9c/ffffff?text=تەفسیر+4' },
            { id: 't5', title: 'تەفسیری نور', author: 'د. نووری عومەر', image: 'https://via.placeholder.com/300x400/5cb85c/ffffff?text=تەفسیر+5' },
            { id: 't6', title: 'کلیلەکانی تەفسیر', author: 'د. ئەحمەد کەرکوکی', image: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=تەفسیر+6' },
            { id: 't7', title: 'تەفسیری ڕووناکی', author: 'شێخ عوسمان محەمەد', image: 'https://via.placeholder.com/300x400/66BB6A/ffffff?text=تەفسیر+7' },
            { id: 't8', title: 'ھەناوی قورئان', author: 'م. خەسرەو جاف', image: 'https://via.placeholder.com/300x400/81C784/ffffff?text=تەفسیر+8' },
            { id: 't9', title: 'تەفسیری پەیام', author: 'مامۆستا مەلا عەلی', image: 'https://via.placeholder.com/300x400/9CCC65/ffffff?text=تەفسیر+9' },
            { id: 't10', title: 'زانستەکانی تەفسیر', author: 'د. محەمەد عەبدولڕەحمان', image: 'https://via.placeholder.com/300x400/AED581/ffffff?text=تەفسیر+10' }
        ],
        'حەدیس': [
            { id: 'h_new1', title: 'صحیح البخاری', author: 'ئیمامی بوخاری', image: 'https://via.placeholder.com/300x400/f44336/ffffff?text=بوخاری' },
            { id: 'h_new2', title: 'صحیح مسلم', author: 'ئیمامی موسلیم', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=موسلیم' },
            { id: 'h_new3', title: 'چهل حەدیس', author: 'ئیمامی نەوەوی', image: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=چهل+حەدیس' },
            { id: 'h_new4', title: 'فەرموودە قودسییەکان', author: 'جامیع', image: 'https://via.placeholder.com/300x400/673ab7/ffffff?text=قودسی' },
            { id: 'h_new5', title: 'مونتەخەبی حەدیس', author: 'د. محەمەد حامد', image: 'https://via.placeholder.com/300x400/3f51b5/ffffff?text=مونتەخەب' }
        ],
        'سیرەی موسولمانان': [
            { id: 'sira1', title: 'سیرەی پێغەمبەر ﷺ', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/00bcd4/ffffff?text=سیرەی+پێغەمبەر' },
            { id: 'sira2', title: 'ژیانی هاوەڵان', author: 'د. عائض القرني', image: 'https://via.placeholder.com/300x400/009688/ffffff?text=هاوەڵان' },
            { id: 'sira3', title: 'خەلیفە ڕاشیدەکان', author: 'عەلی تەنتاوی', image: 'https://via.placeholder.com/300x400/4caf50/ffffff?text=خەلیفەکان' },
            { id: 'sira4', title: 'پاڵەوانانی ئیسلام', author: 'م. محەمەد عەلی', image: 'https://via.placeholder.com/300x400/8bc34a/ffffff?text=پاڵەوانان' },
            { id: 'sira5', title: 'مێژووی فتوحات', author: 'د. ڕاغب السرجانی', image: 'https://via.placeholder.com/300x400/cddc39/ffffff?text=فتوحات' }
        ],
        'فیقه': [ // Renamed from 'فیقه' to 'کتێبی فقە' in categories, but internal key remains 'فیقه'
            { id: 'f1', title: 'سەرەتای فیقه', author: 'ئیمامی شافیعی', image: 'https://via.placeholder.com/300x400/f1c40f/ffffff?text=فیقه+1' },
            { id: 'f2', title: 'فیقهی ئیسلامی', author: 'وەھبە زوحەیلی', image: 'https://via.placeholder.com/300x400/f39c12/ffffff?text=فیقه+2' },
            { id: 'f3', title: 'حوکمەکانی نوێژ و ڕۆژوو', author: 'محەمەد ناسر', image: 'https://via.placeholder.com/300x400/e67e22/ffffff?text=فیقه+3' },
            { id: 'f4', title: 'ڕێساکانی حەج و عومرە', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/d35400/ffffff?text=فیقه+4' },
            { id: 'f5', title: 'فیقهی مامەڵە داراییەکان', author: 'د. یوسف قەرزاوی', image: 'https://via.placeholder.com/300x400/f7b731/ffffff?text=فیقه+5' },
            { id: 'f6', title: 'کتێبی زەکات', author: 'ئەحمەد شوکری', image: 'https://via.placeholder.com/300x400/f9a22f/ffffff?text=فیقه+6' },
            { id: 'f7', title: 'بنەماکانی فیقه', author: 'محەمەد ئەبولجاسمی', image: 'https://via.placeholder.com/300x400/fab60c/ffffff?text=فیقه+7' },
            { id: 'f8', title: 'فیقهی خێزان', author: 'عەبدولواحید شێرزادی', image: 'https://via.placeholder.com/300x400/fcc42e/ffffff?text=فیقه+8' },
            { id: 'f9', title: 'ڕوونکردنەوەی فەتواکان', author: 'لێژنەی فەتوا', image: 'https://via.placeholder.com/300x400/fcd66a/ffffff?text=فیقه+9' },
            { id: 'f10', title: 'فیقهی ژن و مێردایەتی', author: 'د. نەرمین محەمەد', image: 'https://via.placeholder.com/300x400/ffe082/ffffff?text=فیقه+10' }
        ],
        'هەمەجۆری ئیسلامی': [
            { id: 'i_misc1', title: 'چۆنیەتی خۆپاراستن لە چاوی پیس', author: 'شێخ موحەمەد صالح المنجد', image: 'https://via.placeholder.com/300x400/ad1457/ffffff?text=چاوی+پیس' },
            { id: 'i_misc2', title: 'ئادابەکانی ژیان', author: 'شێخ عبدالقادر گەیلانی', image: 'https://via.placeholder.com/300x400/880e4f/ffffff?text=ئاداب' },
            { id: 'i_misc3', title: 'نوێژ لە قورئان و سوننەتدا', author: 'ابن باز', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=نوێژ' },
            { id: 'i_misc4', title: 'جوانترین ناوەکانی خوا', author: 'ئیبراهیم سەعدی', image: 'https://via.placeholder.com/300x400/c2185b/ffffff?text=ناوەکانی+خوا' },
            { id: 'i_misc5', title: 'چیرۆکەکانی قورئان', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/ec407a/ffffff?text=چیرۆکەکانی+قورئان' }
        ],
        'سیاسەت': [
            { id: 'p1', title: 'سیاسەت و ئیدارە', author: 'ئەحمەد شاڵی', image: 'https://via.placeholder.com/300x400/27ae60/ffffff?text=سیاسەت+1' },
            { id: 'p2', title: 'ھونەری حوکمڕانی', author: 'نیکۆلۆ ماکیاڤێلی', image: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=سیاسەت+2' },
            { id: 'p3', title: 'بیردۆزە سیاسییەکان', author: 'ڕۆبێرت دال', image: 'https://via.placeholder.com/300x400/63c784/ffffff?text=سیاسەت+3' },
            { id: 'p4', title: 'گەندەڵی سیاسی', author: 'سۆران عومەر', image: 'https://via.placeholder.com/300x400/409d5c/ffffff?text=سیاسەت+4' },
            { id: 'p5', title: 'دیموکراسی و حکومەت', author: 'جۆن لۆک', image: 'https://via.placeholder.com/300x400/7bd492/ffffff?text=سیاسەت+5' },
            { id: 'p6', title: 'مافەکانی مرۆڤ', author: 'ئەلینۆر ڕۆزڤێڵت', image: 'https://via.placeholder.com/300x400/28a745/ffffff?text=سیاسەت+6' },
            { id: 'p7', title: 'مێژووی فیکری سیاسی', author: 'ئیمانویل کانت', image: 'https://via.placeholder.com/300x400/3abf5f/ffffff?text=سیاسەت+7' },
            { id: 'p8', title: 'پەیوەندییە نێودەوڵەتییەکان', author: 'جوزێف نای', image: 'https://via.placeholder.com/300x400/52d978/ffffff?text=سیاسەت+8' },
            { id: 'p9', title: 'سیستمی سیاسی عێراق', author: 'سەڵاح خورشید', image: 'https://via.placeholder.com/300x400/66ec91/ffffff?text=سیاسەت+9' },
            { id: 'p10', title: 'گۆڕانکارییەکانی ڕۆژھەڵاتی ناوەڕاست', author: 'بەرهەم ساڵح', image: 'https://via.placeholder.com/300x400/7ef7a9/ffffff?text=سیاسەت+10' }
        ],
        'مێژوو': [
            { id: 'h1', title: 'مێژووی کورد و کوردستان', author: 'حەمید گۆمەشینی', image: 'https://via.placeholder.com/300x400/8e44ad/ffffff?text=مێژووی+کورد' },
            { id: 'h2', title: 'مێژووی شارستانیەتەکان', author: 'ویل دیورانت', image: 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=شارستانیەت' },
            { id: 'h3', title: 'ڕاپەڕینەکانی گەلانی ڕۆژھەڵات', author: 'ئیحسان نور', image: 'https://via.placeholder.com/300x400/be2edd/ffffff?text=ڕۆژھەڵات' },
            { id: 'h4', title: 'سەردەمی زێڕینی ئیسلام', author: 'ھاریسن فۆرد', image: 'https://via.placeholder.com/300x400/a55eea/ffffff?text=ئیسلام' },
            { id: 'h5', title: 'مێژووی جیھان', author: 'جین ماکسوێڵ', image: 'https://via.placeholder.com/300x400/cd84f1/ffffff?text=جیھان' },
            { id: 'h6', title: 'جەنگە جیھانییەکان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/6c5ce7/ffffff?text=جەنگ' },
            { id: 'h7', title: 'دەوڵەتە کوردییەکان', author: 'مەسعود محەمەد', image: 'https://via.placeholder.com/300x400/7d3f98/ffffff?text=دەوڵەتە+کوردییەکان' },
            { id: 'h8', title: 'سەڵاحەدینی ئەیوبی', author: 'عەلی قەرەداغی', image: 'https://via.placeholder.com/300x400/9d44c9/ffffff?text=سەڵاحەدین' },
            { id: 'h9', title: 'مێژووی ئیمپراتۆرییەکان', author: 'جۆن سمت', image: 'https://via.placeholder.com/300x400/b36dc9/ffffff?text=ئیمپراتۆرییەت' },
            { id: 'h10', title: 'شۆڕشی پیشەسازی', author: 'جەیمس وات', image: 'https://via.placeholder.com/300x400/c78dd3/ffffff?text=شۆڕش' }
        ],
        'هەمەجۆر': [
            { id: 'misc1', title: 'فەلسەفەی ژیان', author: 'ئەلبرت کامو', image: 'https://via.placeholder.com/300x400/607d8b/ffffff?text=فەلسەفە' },
            { id: 'misc2', title: 'زانستی گەردوون', author: 'ستیڤن هۆکینگ', image: 'https://via.placeholder.com/300x400/455a64/ffffff?text=گەردوون' },
            { id: 'misc3', title: 'پەرەپێدانی خود', author: 'برایان ترەیسی', image: 'https://via.placeholder.com/300x400/78909c/ffffff?text=پەرەپێدان' },
            { id: 'misc4', title: 'چیرۆکی مناڵان', author: 'هانس کریستیان ئەندرسن', image: 'https://via.placeholder.com/300x400/90a4ae/ffffff?text=مناڵان' },
            { id: 'misc5', title: 'شیعر و ئەدەب', author: 'مەولانا', image: 'https://via.placeholder.com/300x400/b0bec5/ffffff?text=شیعر' }
        ],
        'هەموو کتێبەکان': [] // This category will be populated dynamically from all other books
    };

    // Populate 'هەموو کتێبەکان' with all books from other categories
    for (const category in booksData) {
        if (category !== 'هەموو کتێبەکان') {
            booksData['هەموو کتێبەکان'] = booksData['هەموو کتێبەکان'].concat(booksData[category]);
        }
    }


    // Function to create a book card HTML
    function createBookCard(book) {
        return `
            <div class="book-card" data-title="${book.title.toLowerCase()}" data-author="${book.author.toLowerCase()}">
                <img src="${book.image}" alt="${book.title} وێنەی کتێب">
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p>نووسەر: ${book.author}</p>
                    <div class="book-actions">
                        <button class="btn read-btn">خوێندنەوە</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to load books into categories (for index.html)
    function loadBooksIntoCategories() {
        const categoriesOnIndex = [
            'عەقیدە', 'تەفسیر', 'حەدیس', 'سیرەی موسولمانان', 'فیقه',
            'هەمەجۆری ئیسلامی', 'سیاسەت', 'مێژوو', 'هەمەجۆر', 'هەموو کتێبەکان'
        ];

        categoriesOnIndex.forEach(category => {
            const containerId = category + '-books';
            const container = document.getElementById(containerId);
            if (container) {
                const booksForCategory = booksData[category] || [];
                const booksToDisplay = booksForCategory.slice(0, 4); // Display first 4 books
                container.innerHTML = booksToDisplay.map(createBookCard).join('');

                // Update "زیاتر ببینە" button href
                const moreBtn = container.nextElementSibling.querySelector('.view-more-btn');
                if (moreBtn) {
                    let filename;
                    switch(category) {
                        case 'عەقیدە': filename = 'all-books.html'; break; // Original all-books is for Aqeeda
                        case 'تەفسیر': filename = 'tafseer-books.html'; break;
                        case 'حەدیس': filename = 'hadis-books.html'; break;
                        case 'سیرەی موسولمانان': filename = 'sira-muslim-books.html'; break;
                        case 'فیقه': filename = 'fka-books.html'; break; // Corrected to fka-books.html
                        case 'هەمەجۆری ئیسلامی': filename = 'hamajor-muslim-books.html'; break;
                        case 'سیاسەت': filename = 'syasat-books.html'; break;
                        case 'مێژوو': filename = 'mezhu-books.html'; break;
                        case 'هەمەجۆر': filename = 'hamajor-books.html'; break;
                        case 'هەموو کتێبەکان': filename = 'hamu-books.html'; break;
                        default: filename = 'all-books.html';
                    }
                    moreBtn.href = `${filename}?category=${category}`;
                }
            }
        });
    }

    // Theme Management (Light/Dark Mode)
    function applyTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');
        localStorage.setItem('theme', theme); // Save theme preference
        // Update theme toggle button icon for index.html
        if (themeToggleBtn) { // Check if element exists (for index.html)
            if (theme === 'dark') {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> دۆخی ڕۆشناک';
            } else {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> دۆخی تاریک';
            }
        }
    }

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    applyTheme(savedTheme);

    // Event listener for theme toggle button on index.html
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Splash Screen Logic (only for index.html)
    if (splashScreen && mainContent.classList.contains('hidden')) { // Ensure splash screen logic only runs on index.html and if content is hidden
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                loadBooksIntoCategories(); // Load books after splash screen fades
            }, 800); // Wait for the fade-out transition to complete (0.8s from CSS)
        }, 3000); // 3 seconds before starting fade-out
    } else {
        // If not on index.html (e.g., all-books.html), ensure main content is visible immediately
        if (mainContent) {
            mainContent.classList.remove('hidden');
        }
    }


    // Scroll to Top Button Logic
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
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
    // Only apply this to the index.html header, not the fixed one in all-books.html
    if (header && !header.classList.contains('all-books-fixed-header')) { // Check if it's the index.html header
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) { // Only hide if scrolled past hero section
                if (window.scrollY < lastScrollY) {
                    // Scrolling Up
                    header.classList.remove('hidden-header');
                } else {
                    // Scrolling Down
                    header.classList.add('hidden-header');
                    if (mainNavbar) mainNavbar.classList.remove('active'); // Close menu if scrolling down
                    if (settingsDropdown) settingsDropdown.classList.remove('show'); // Close settings if scrolling down
                }
            } else {
                // At the top or within hero section
                header.classList.remove('hidden-header');
            }
            lastScrollY = window.scrollY;
        });
    }


    // Hamburger Menu Toggle (only for index.html)
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            mainNavbar.classList.toggle('active');
            settingsDropdown.classList.remove('show'); // Ensure settings dropdown closes when menu toggles
        });
    }

    // Settings Dropdown Toggle (only for index.html)
    if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation(); // Stop event from bubbling up to document click
            settingsDropdown.classList.toggle('show');
        });
    }

    // Close dropdowns if clicked outside
    document.addEventListener('click', (e) => {
        if (settingsDropdown && !settingsDropdown.contains(e.target) && settingsToggle && !settingsToggle.contains(e.target)) {
            settingsDropdown.classList.remove('show');
        }
        if (mainNavbar && !mainNavbar.contains(e.target) && hamburgerMenu && !hamburgerMenu.contains(e.target)) {
             if (window.innerWidth <= 1024) { // Only close if it's the mobile menu
                 mainNavbar.classList.remove('active');
            }
        }
    });


    // Search Functionality (for index.html header search)
    if (headerSearchInput) {
        headerSearchInput.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();
            const allBookCards = document.querySelectorAll('.book-card');

            allBookCards.forEach(card => {
                const title = card.dataset.title;
                const author = card.dataset.author;

                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'flex'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    }

    // "زیاتر ببینە" Button Logic (for index.html)
    document.querySelectorAll('.view-more-btn').forEach(button => {
        // Event listener is now implicit via the anchor tag, but keeping this
        // for any potential future button elements or specific behaviors.
        // The HTML now uses <a> tags with hrefs directly.
    });

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
    if (contactForm) {
        // Formspree endpoint (replace with your actual one if it's different)
        const formspreeEndpoint = "https://formspree.io/f/xldpzqbp"; // Example, replace with your ID
        contactForm.setAttribute("action", formspreeEndpoint);
        contactForm.setAttribute("method", "POST");

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent actual form submission

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
                    form.reset(); // Clear the form
                } else {
                    let errorMessage = 'هەڵەیەک ڕوویدا لە کاتی ناردنی پەیامەکە.';
                    try {
                        const errorData = await response.json();
                        if (errorData && errorData.errors && errorData.errors.length > 0) {
                            errorMessage = errorData.errors.map(err => err.message).join('\n');
                        } else if (errorData && errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch (jsonError) {
                        console.warn('Could not parse Formspree error JSON:', jsonError);
                        errorMessage += ' (نەتوانرا زانیاری هەڵەکە وەربگیرێت).';
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
            // Check if it's the settings toggle, don't scroll if it is
            if (targetId === '#') {
                return;
            }
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
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
    const allBooksHeaderContent = document.querySelector('.all-books-header-content'); // New
    const allBooksSearchContainer = document.querySelector('.all-books-search-container'); // New


    if (allBooksContainer) { // Check if we are on one of the category pages
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        // Apply saved theme to category page immediately
        applyTheme(savedTheme);

        if (category && booksData[category]) {
            categoryNameSpan.textContent = category;
            const booksToDisplay = booksData[category];
            allBooksContainer.innerHTML = booksToDisplay.map(createBookCard).join('');

            // Calculate total header height for category pages dynamically
            let totalAllBooksHeaderHeight = 0;
            if (allBooksHeaderContent && allBooksSearchContainer) {
                totalAllBooksHeaderHeight = allBooksHeaderContent.offsetHeight + allBooksSearchContainer.offsetHeight;
                // Set a CSS variable for dynamic use in style.css
                document.documentElement.style.setProperty('--all-books-header-total-height', `${totalAllBooksHeaderHeight}px`);
            }

            // Header Visibility on Scroll for category pages
            let lastScrollY = window.scrollY;
            
            // Initial adjustment for content padding-top
            const currentAllBooksSection = document.getElementById('all-books-section');
            if (currentAllBooksSection && totalAllBooksHeaderHeight > 0) {
                 currentAllBooksSection.style.paddingTop = `${totalAllBooksHeaderHeight}px`;
            }

            window.addEventListener('scroll', () => {
                if (allBooksHeader) {
                    // Recalculate height on scroll in case of responsive changes
                    totalAllBooksHeaderHeight = (allBooksHeaderContent ? allBooksHeaderContent.offsetHeight : 0) + 
                                                (allBooksSearchContainer ? allBooksSearchContainer.offsetHeight : 0);
                    document.documentElement.style.setProperty('--all-books-header-total-height', `${totalAllBooksHeaderHeight}px`);


                    if (window.scrollY > totalAllBooksHeaderHeight / 2) { // Start hiding after scrolling past half of the header
                        if (window.scrollY < lastScrollY) {
                            // Scrolling Up
                            allBooksHeader.classList.remove('hidden-header');
                        } else {
                            // Scrolling Down
                            allBooksHeader.classList.add('hidden-header');
                        }
                    } else {
                        // At the top or within the first half of the header
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
        } else {
            // Handle case where category is not found or not specified
            categoryNameSpan.textContent = "کتێبەکان";
            allBooksContainer.innerHTML = `<p style="text-align: center; font-size: 1.5rem; color: var(--gray-text);">ببورە، ھیچ کتێبێک بۆ ئەم بەشە نەدۆزرایەوە یان بەشەکە دیارینەکراوە.</p>`;
            if (noResultsMessage) noResultsMessage.style.display = 'none'; // Hide if no books loaded
        }
    }
});
