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

    // --- CMS/Admin Constants ---
    const CMS_PASSWORD = 'sarkawtn-tanha-bo-sarxarani-islama1400'; // وشەی نهێنی داواکراو
    const LOGIN_FORM = document.getElementById('cms-login-form');
    const LOGIN_MESSAGE = document.getElementById('cms-login-message');
    const CMS_LOGIN_AREA = document.getElementById('cms-login-area');
    const CMS_CONTENT = document.getElementById('cms-content');
    const ADD_BOOK_FORM = document.getElementById('add-book-form');
    const USER_BOOKS_CONTAINER = document.getElementById('user-added-books-container');
    const NO_USER_BOOKS_MESSAGE = document.getElementById('no-user-books-message');
    const BOOK_CATEGORY_SELECT = document.getElementById('book-category-select');
    const BOOK_TITLE_INPUT = document.getElementById('book-title-input');
    const BOOK_AUTHOR_INPUT = document.getElementById('book-author-input');
    const BOOK_FILE_INPUT = document.getElementById('book-file-input'); // HTML File Input
    const BOOK_IMAGE_INPUT = document.getElementById('book-image-input'); // HTML File Input
    const PUBLISH_BOOK_BTN = document.getElementById('publish-book-btn');
    const BOOK_EDIT_ID = document.getElementById('book-edit-id');
    const CANCEL_EDIT_BTN = document.getElementById('cancel-edit-btn');
    // const LOCAL_STORAGE_KEY = 'userAddedBooks'; // REMOVED: Using a simulated database for now

    // Define the list of simple categories
    const SIMPLE_CATEGORIES = ['عەقیدە', 'حەدیس', 'سیرەی موسولمانان', 'فیقه', 'هەمەجۆری ئیسلامی', 'سیاسەت', 'مێژوو', 'هەمەجۆر'];

    // --- Simulated Central Database (To be replaced with Firebase/Supabase/etc.) ---
    // This variable will hold all static books + user-added books fetched from the real database.
    let allBooksData = {};

    // Sample book data (10 books per category, extended for new categories)
    const staticBooksData = {
        'عەقیدە': [
            { id: 'pdfs/pdfs-1.pdf', title: 'ثلاثە الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-1.HEIC', isUserAdded: false },
            { id: 'pdfs/pdfs-26.pdf', title: 'تەوحید', author: 'م.احمد مەلا فایەق سعید', image: 'photos/photos-26.jpg', isUserAdded: false },
            { id: 'pdfs/pdfs-3.pdf', title: 'قواعد الأربعە', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-3.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-4.pdf', title: 'کشف الشبهات (مامۆستا کامەران)', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-4.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-5.pdf', title: 'کشف الشبهات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-5.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-6.pdf', title: 'الواجبات المتحتمات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-6.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-7.pdf', title: 'کتاب التوحید', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-7.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-8.pdf', title: 'ثلاثە الاصول وقواعد الأربعة و ستة الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-8.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-9.pdf', title: 'نواقض الإسلام', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-9.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-10.pdf', title: 'لمعة الإعتقاد', author: 'موفق الدین ابی محمد عبدالله', image: 'photos/photos-10.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-11.pdf', title: 'شرح السنة بربهاری', author: 'إمام بەربەهاری', image: 'photos/photos-11.jpg', isUserAdded: false },
            { id: 'pdfs/pdfs-12.pdf', title: 'شرح السنة بربهاری', author: 'إمام بەربەهاری', image: 'photos/photos-12.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-13.pdf', title: 'الوجیز', author: 'عبدالله بن عبدالحميد الأثري ', image: 'photos/photos-13.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-14.pdf', title: 'عەقیدة الواسطیة', author: 'د.خالد بن ناصر بن سعید', image: 'photos/photos-14.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-15.pdf', title: 'مسائل الجهلیة', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-15.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-16.pdf', title: 'مفید المستفید فی کفر تارک التوحید', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-16.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-17.pdf', title: 'الولاء والبراء', author: 'سیف اللە السني', image: 'photos/photos-17.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-18.pdf', title: '٥٠ پسیار و وەڵام لەسەر بیر و باوەڕ', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-18.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-19.pdf', title: 'قواعد الأربعة', author: 'مامۆستا مەبەست کاژاوی', image: 'photos/photos-19.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-20.pdf', title: 'لمعة الإعتقاد', author: 'موفق الدین أبي محمد عبدللە ', image: 'photos/photos-20.jpg', isUserAdded: false },
            { id: 'pdfs/pdfs-21.pdf', title: 'مفید المستفید فی کفر تارک التوحید', author: 'م هـاوکـار کوردی', image: 'photos/photos-21.HEIC', isUserAdded: false },
            { id: 'pdfs/pdfs-22.pdf', title: 'الواجبات المتحتیمات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-22.jpg', isUserAdded: false },
            { id: 'pdfs/pdfs-23.pdf', title: 'کۆدەنگی ئەهلی سوننە دەربارەی بیر و باوەڕ', author: 'کتێبخانەی ئیسلام', image: 'photos/photos-23.HEIC', isUserAdded: false },
            { id: 'pdfs/pdfs-24.pdf', title: 'اعتقاد أئمة الحدیث', author: 'حارث المسلم السنی', image: 'photos/photos-24.JPG', isUserAdded: false },
            { id: 'pdfs/pdfs-25.pdf', title: 'شەرحی کتاب التوحید', author: 'هیثم بن محمد سرحان', image: 'photos/photos-25.jpg', isUserAdded: false },
            { id: 'pdfs/pdfs-2.pdf', title: 'ثلاثە الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-2.png', isUserAdded: false },
            { id: 'pdfs/pdfs-27.pdf', title: 'هەڵوەشێنەرەوەکانی ئیسلام', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-27.HEIC', isUserAdded: false }
        ],
        'تەفسیر': [
            // Tafseer books are complex (volumes), keeping them as static for now.
            { id: 't1', title: 'تەفسیری ڕوونی قورئان', author: 'د. عبدلکریم زێدان', image: 'https://via.placeholder.com/300x400/3498db/ffffff?text=تەفسیر+1', 
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-1-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-1-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-1-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-1-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-1-vol-5.pdf' }
                ]
            },
            { id: 't2', title: 'کوردی تەفسیری قورئان', author: 'موحەمەد عەلی', image: 'https://via.placeholder.com/300x400/2980b9/ffffff?text=تەفسیر+2',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-2-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-2-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-2-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-2-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-2-vol-5.pdf' }
                ]
            },
            { id: 't3', title: 'تەفسیری ئاسان', author: 'شێخ محەمەد ساڵح', image: 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=تەفسیر+3',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-3-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-3-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-3-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-3-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-3-vol-5.pdf' }
                ]
            },
            { id: 't4', title: 'وشە بە وشەی قورئان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/1abc9c/ffffff?text=تەفسیر+4',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-4-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-4-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-4-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-4-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-4-vol-5.pdf' }
                ]
            },
            { id: 't5', title: 'تەفسیری نور', author: 'د. نووری عومەر', image: 'https://via.placeholder.com/300x400/5cb85c/ffffff?text=تەفسیر+5',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-5-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-5-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-5-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-5-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-5-vol-5.pdf' }
                ]
            },
            { id: 't6', title: 'کلیلەکانی تەفسیر', author: 'د. ئەحمەد کەرکوکی', image: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=تەفسیر+6',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-6-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-6-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-6-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-6-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-6-vol-5.pdf' }
                ]
            },
            { id: 't7', title: 'تەفسیری ڕووناکی', author: 'شێخ عوسمان محەمەد', image: 'https://via.placeholder.com/300x400/66BB6A/ffffff?text=تەفسیر+7',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-7-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-7-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-7-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-7-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-7-vol-5.pdf' }
                ]
            },
            { id: 't8', title: 'ھەناوی قورئان', author: 'م. خەسرەو جاف', image: 'https://via.placeholder.com/300x400/81C784/ffffff?text=تەفسیر+8',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-8-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-8-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-8-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-8-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-8-vol-5.pdf' }
                ]
            },
            { id: 't9', title: 'تەفسیری پەیام', author: 'مامۆستا مەلا عەلی', image: 'https://via.placeholder.com/300x400/9CCC65/ffffff?text=تەفسیر+9',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-9-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-9-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-9-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-9-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-9-vol-5.pdf' }
                ]
            },
            { id: 't10', title: 'زانستەکانی تەفسیر', author: 'د. محەمەد عەبدولڕەحمان', image: 'https://via.placeholder.com/300x400/AED581/ffffff?text=تەفسیر+10',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-10-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-10-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-10-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-10-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-10-vol-5.pdf' }
                ]
            }
        ],
        'حەدیس': [
            { id: 'h_new1', title: 'صحیح البخاری', author: 'ئیمامی بوخاری', image: 'https://via.placeholder.com/300x400/f44336/ffffff?text=بوخاری', isUserAdded: false },
            { id: 'h_new2', title: 'صحیح مسلم', author: 'ئیمامی موسلیم', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=موسلیم', isUserAdded: false },
            { id: 'h_new3', title: 'چهل حەدیس', author: 'ئیمامی نەوەوی', image: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=چهل+حەدیس', isUserAdded: false },
            { id: 'h_new4', title: 'فەرموودە قودسییەکان', author: 'جامیع', image: 'https://via.placeholder.com/300x400/673ab7/ffffff?text=قودسی', isUserAdded: false },
            { id: 'h_new5', title: 'مونتەخەبی حەدیس', author: 'د. محەمەد حامد', image: 'https://via.placeholder.com/300x400/3f51b5/ffffff?text=مونتەخەب', isUserAdded: false }
        ],
        'سیرەی موسولمانان': [
            { id: 'sira1', title: 'سیرەی پێغەمبەر ﷺ', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/00bcd4/ffffff?text=سیرەی+پێغەمبەر', isUserAdded: false },
            { id: 'sira2', title: 'ژیانی هاوەڵان', author: 'د. عائض القرني', image: 'https://via.placeholder.com/300x400/009688/ffffff?text=هاوەڵان', isUserAdded: false },
            { id: 'sira3', title: 'خەلیفە ڕاشیدەکان', author: 'عەلی تەنتاوی', image: 'https://via.placeholder.com/300x400/4caf50/ffffff?text=خەلیفەکان', isUserAdded: false },
            { id: 'sira4', title: 'پاڵەوانانی ئیسلام', author: 'م. محەمەد عەلی', image: 'https://via.placeholder.com/300x400/8bc34a/ffffff?text=پاڵەوانان', isUserAdded: false },
            { id: 'sira5', title: 'مێژووی فتوحات', author: 'د. ڕاغب السرجانی', image: 'https://via.placeholder.com/300x400/cddc39/ffffff?text=فتوحات', isUserAdded: false }
        ],
        'فیقه': [ // Renamed from 'فیقه' to 'کتێبی فقە' in categories, but internal key remains 'فیقه'
            { id: 'f1', title: 'سەرەتای فیقه', author: 'ئیمامی شافیعی', image: 'https://via.placeholder.com/300x400/f1c40f/ffffff?text=فیقه+1', isUserAdded: false },
            { id: 'f2', title: 'فیقهی ئیسلامی', author: 'وەھبە زوحەیلی', image: 'https://via.placeholder.com/300x400/f39c12/ffffff?text=فیقه+2', isUserAdded: false },
            { id: 'f3', title: 'حوکمەکانی نوێژ و ڕۆژوو', author: 'محەمەد ناسر', image: 'https://via.placeholder.com/300x400/e67e22/ffffff?text=فیقه+3', isUserAdded: false },
            { id: 'f4', title: 'ڕێساکانی حەج و عومرە', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/d35400/ffffff?text=فیقه+4', isUserAdded: false },
            { id: 'f5', title: 'فیقهی مامەڵە داراییەکان', author: 'د. یوسف قەرزاوی', image: 'https://via.placeholder.com/300x400/f7b731/ffffff?text=فیقه+5', isUserAdded: false },
            { id: 'f6', title: 'کتێبی زەکات', author: 'ئەحمەد شوکری', image: 'https://via.placeholder.com/300x400/f9a22f/ffffff?text=فیقه+6', isUserAdded: false },
            { id: 'f7', title: 'بنەماکانی فیقه', author: 'محەمەد ئەبولجاسمی', image: 'https://via.placeholder.com/300x400/fab60c/ffffff?text=فیقه+7', isUserAdded: false },
            { id: 'f8', title: 'فیقهی خێزان', author: 'عەبدولواحید شێرزادی', image: 'https://via.placeholder.com/300x400/fcc42e/ffffff?text=فیقه+8', isUserAdded: false },
            { id: 'f9', title: 'ڕوونکردنەوەی فەتواکان', author: 'لێژنەی فەتوا', image: 'https://via.placeholder.com/300x400/fcd66a/ffffff?text=فیقه+9', isUserAdded: false },
            { id: 'f10', title: 'فیقهی ژن و مێردایەتی', author: 'د. نەرمین محەمەد', image: 'https://via.placeholder.com/300x400/ffe082/ffffff?text=فیقه+10', isUserAdded: false }
        ],
        'هەمەجۆری ئیسلامی': [
            { id: 'i_misc1', title: 'چۆنیەتی خۆپاراستن لە چاوی پیس', author: 'شێخ موحەمەد صالح المنجد', image: 'https://via.placeholder.com/300x400/ad1457/ffffff?text=چاوی+پیس', isUserAdded: false },
            { id: 'i_misc2', title: 'ئادابەکانی ژیان', author: 'شێخ عبدالقادر گەیلانی', image: 'https://via.placeholder.com/300x400/880e4f/ffffff?text=ئاداب', isUserAdded: false },
            { id: 'i_misc3', title: 'نوێژ لە قورئان و سوننەتدا', author: 'ابن باز', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=نوێژ', isUserAdded: false },
            { id: 'i_misc4', title: 'جوانترین ناوەکانی خوا', author: 'ئیبراهیم سەعدی', image: 'https://via.placeholder.com/300x400/c2185b/ffffff?text=ناوەکانی+خوا', isUserAdded: false },
            { id: 'i_misc5', title: 'چیرۆکەکانی قورئان', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/ec407a/ffffff?text=چیرۆکەکانی+قورئان', isUserAdded: false }
        ],
        'سیاسەت': [
            { id: 'p1', title: 'سیاسەت و ئیدارە', author: 'ئەحمەد شاڵی', image: 'https://via.placeholder.com/300x400/27ae60/ffffff?text=سیاسەت+1', isUserAdded: false },
            { id: 'p2', title: 'ھونەری حوکمڕانی', author: 'نیکۆلۆ ماکیاڤێلی', image: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=سیاسەت+2', isUserAdded: false },
            { id: 'p3', title: 'بیردۆزە سیاسییەکان', author: 'ڕۆبێرت دال', image: 'https://via.placeholder.com/300x400/63c784/ffffff?text=سیاسەت+3', isUserAdded: false },
            { id: 'p4', title: 'گەندەڵی سیاسی', author: 'سۆران عومەر', image: 'https://via.placeholder.com/300x400/409d5c/ffffff?text=سیاسەت+4', isUserAdded: false },
            { id: 'p5', title: 'دیموکراسی و حکومەت', author: 'جۆن لۆک', image: 'https://via.placeholder.com/300x400/7bd492/ffffff?text=سیاسەت+5', isUserAdded: false },
            { id: 'p6', title: 'مافەکانی مرۆڤ', author: 'ئەلینۆر ڕۆزڤێڵت', image: 'https://via.placeholder.com/300x400/28a745/ffffff?text=سیاسەت+6', isUserAdded: false },
            { id: 'p7', title: 'مێژووی فیکری سیاسی', author: 'ئیمانویل کانت', image: 'https://via.placeholder.com/300x400/3abf5f/ffffff?text=سیاسەت+7', isUserAdded: false },
            { id: 'p8', title: 'پەیوەندییە نێودەوڵەتییەکان', author: 'جوزێف نای', image: 'https://via.placeholder.com/300x400/52d978/ffffff?text=سیاسەت+8', isUserAdded: false },
            { id: 'p9', title: 'سیستمی سیاسی عێراق', author: 'سەڵاح خورشید', image: 'https://via.placeholder.com/300x400/66ec91/ffffff?text=سیاسەت+9', isUserAdded: false },
            { id: 'p10', title: 'گۆڕانکارییەکانی ڕۆژھەڵاتی ناوەڕاست', author: 'بەرهەم ساڵح', image: 'https://via.placeholder.com/300x400/7ef7a9/ffffff?text=سیاسەت+10', isUserAdded: false }
        ],
        'مێژوو': [
            { id: 'h1', title: 'مێژووی کورد و کوردستان', author: 'حەمید گۆمەشینی', image: 'https://via.placeholder.com/300x400/8e44ad/ffffff?text=مێژووی+کورد', isUserAdded: false },
            { id: 'h2', title: 'مێژووی شارستانیەتەکان', author: 'ویل دیورانت', image: 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=شارستانیەت', isUserAdded: false },
            { id: 'h3', title: 'ڕاپەڕینەکانی گەلانی ڕۆژھەڵات', author: 'ئیحسان نور', image: 'https://via.placeholder.com/300x400/be2edd/ffffff?text=ڕۆژھەڵات', isUserAdded: false },
            { id: 'h4', title: 'سەردەمی زێڕینی ئیسلام', author: 'ھاریسن فۆرد', image: 'https://via.placeholder.com/300x400/a55eea/ffffff?text=ئیسلام', isUserAdded: false },
            { id: 'h5', title: 'مێژووی جیھان', author: 'جین ماکسوێڵ', image: 'https://via.placeholder.com/300x400/cd84f1/ffffff?text=جیھان', isUserAdded: false },
            { id: 'h6', title: 'جەنگە جیھانییەکان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/6c5ce7/ffffff?text=جەنگ', isUserAdded: false },
            { id: 'h7', title: 'دەوڵەتە کوردییەکان', author: 'مەسعود محەمەد', image: 'https://via.placeholder.com/300x400/7d3f98/ffffff?text=دەوڵەتە+کوردییەکان', isUserAdded: false },
            { id: 'h8', title: 'سەڵاحەدینی ئەیوبی', author: 'عەلی قەرەداغی', image: 'https://via.placeholder.com/300x400/9d44c9/ffffff?text=سەڵاحەدین', isUserAdded: false },
            { id: 'h9', title: 'مێژووی ئیمپراتۆرییەکان', author: 'جۆن سمت', image: 'https://via.placeholder.com/300x400/b36dc9/ffffff?text=ئیمپراتۆرییەت', isUserAdded: false },
            { id: 'h10', title: 'شۆڕشی پیشەسازی', author: 'جەیمس وات', image: 'https://via.placeholder.com/300x400/c78dd3/ffffff?text=شۆڕش', isUserAdded: false }
        ],
        'هەمەجۆر': [
            { id: 'misc1', title: 'فەلسەفەی ژیان', author: 'ئەلبرت کامو', image: 'https://via.placeholder.com/300x400/607d8b/ffffff?text=فەلسەفە', isUserAdded: false },
            { id: 'misc2', title: 'زانستی گەردوون', author: 'ستیڤن هۆکینگ', image: 'https://via.placeholder.com/300x400/455a64/ffffff?text=گەردوون', isUserAdded: false },
            { id: 'misc3', title: 'پەرەپێدانی خود', author: 'برایان ترەیسی', image: 'https://via.placeholder.com/300x400/78909c/ffffff?text=پەرەپێدان', isUserAdded: false },
            { id: 'misc4', title: 'چیرۆکی مناڵان', author: 'هانس کریستیان ئەندرسن', image: 'https://via.placeholder.com/300x400/90a4ae/ffffff?text=مناڵان', isUserAdded: false },
            { id: 'misc5', title: 'شیعر و ئەدەب', author: 'مەولانا', image: 'https://via.placeholder.com/300x400/b0bec5/ffffff?text=شیعر', isUserAdded: false }
        ],
        'هەموو کتێبەکان': [] // This category will be populated dynamically from all other books
    };
    
    // --- Mock User-Added Books Data (Used for Demonstration until real DB is connected) ---
    // This will replace the simple localStorage used before.
    let userAddedBooksMock = {};

    // Load initial data
    function loadInitialData() {
        // In a real scenario, this is where you fetch data from Firebase Firestore
        // For now, we load a mock local storage to keep the CMS functionality working
        try {
            const storedData = localStorage.getItem('mockUserAddedBooks');
            userAddedBooksMock = storedData ? JSON.parse(storedData) : {};
        } catch (e) {
            console.error("Could not load mock user books from localStorage:", e);
            userAddedBooksMock = {};
        }
        
        mergeBooksData();
    }
    
    function saveMockData(data) {
        // In a real scenario, this is where you write data to Firebase Firestore
        try {
            localStorage.setItem('mockUserAddedBooks', JSON.stringify(data));
        } catch (e) {
            console.error("Could not save mock user books to localStorage:", e);
        }
    }


    // Merge static and user-added books into allBooksData
    function mergeBooksData() {
        allBooksData = JSON.parse(JSON.stringify(staticBooksData)); // Deep copy static data
        
        // Add user books
        for (const category in userAddedBooksMock) {
            if (allBooksData[category]) {
                allBooksData[category] = allBooksData[category].concat(userAddedBooksMock[category]);
            } else {
                allBooksData[category] = userAddedBooksMock[category];
            }
        }
        
        // Populate 'هەموو کتێبەکان' dynamically from all other categories
        allBooksData['هەموو کتێبەکان'] = [];
        for (const category in allBooksData) {
            if (category !== 'هەموو کتێبەکان' && Array.isArray(allBooksData[category])) {
                allBooksData['هەموو کتێبەکان'] = allBooksData['هەموو کتێبەکان'].concat(allBooksData[category]);
            }
        }
    }

    loadInitialData(); // Run on load to include persistent data


// Function to create a book card HTML
function createBookCard(book, category = '', isManagement = false) { // Added isManagement parameter
    // Use the presence of the 'volumes' array to determine if it's a multi-volume book in the Tafsir category
    const isTafsirWithVolumes = category === 'تەفسیر' && book.volumes && book.volumes.length > 0;
    
    // Determine the PDF URL: 'pdfUrl' for user-added books, 'id' for static books (which store the path as id)
    const pdfLink = book.isUserAdded ? book.pdfUrl : book.id;
    
    let bookActionsHtml;

    if (isManagement && book.isUserAdded) {
        // Management view with Edit and Delete buttons
        bookActionsHtml = `
            <div class="book-actions" style="flex-direction: column; gap: 10px; padding-bottom: 20px; padding-top: 10px;">
                <button type="button" class="btn primary-btn btn-sm cms-edit-btn" data-book-id="${book.id}" data-category="${category}">
                    <i class="fas fa-edit"></i> گۆرانکاری
                </button>
                <button type="button" class="btn secondary-btn btn-sm cms-delete-btn" data-book-id="${book.id}" data-category="${category}" style="background-color: #dc3545; color: var(--white);">
                    <i class="fas fa-trash-alt"></i> سرینەوە
                </button>
            </div>
        `;
    } else if (isTafsirWithVolumes) {
        // Create a safe ID from the title for the dropdown element
        const dropdownId = `volumes-${book.title.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').replace(/\s+/g, '-')}`;

        const volumeOptions = book.volumes.map(volume => `
            <a href="${volume.id}" class="volume-option btn primary-btn btn-sm" target="_blank">${volume.title}</a>
        `).join('');
        
        // Structure for flow layout
        bookActionsHtml = `
            <div class="volume-dropdown-wrapper">
                <div class="book-actions">
                    <button class="btn read-btn volume-toggle-btn" data-dropdown-id="${dropdownId}">
                        خوێندنەوەی بەرگ <i class="fas fa-chevron-down volume-icon"></i>
                    </button>
                </div>
                <!-- The dropdown, placed to flow immediately after the button wrapper -->
                <div class="volume-dropdown" id="${dropdownId}">
                    ${volumeOptions}
                </div>
            </div>
        `;
    } else {
        // Simple read button for all other books
        bookActionsHtml = `
            <div class="book-actions">
                <a href="${pdfLink}" class="btn read-btn" target="_blank">خوێندنەوە</a>
            </div>
        `;
    }

    return `
        <div class="book-card" data-title="${book.title.toLowerCase()}" data-author="${book.author.toLowerCase()}" data-category="${category}" data-book-id="${book.id}">
            <img src="${book.image}" alt="${book.title} وێنەی کتێب">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>نووسەر: ${book.author}</p>
                ${book.isUserAdded ? `<p style="font-size:0.8rem; color: var(--primary-color);">(${category} - زیادکراوی بەڕێوەبەر)</p>` : ''}
            </div>
            ${bookActionsHtml}
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
                const booksForCategory = allBooksData[category] || [];
                const booksToDisplay = booksForCategory.slice(0, 4); // Display first 4 books
                // Pass category name to createBookCard
                container.innerHTML = booksToDisplay.map(book => createBookCard(book, category)).join('');

                // Update "زیاتر ببینە" button href
                const moreBtnContainer = container.closest('.category-block').querySelector('.more-btn-container');
                const moreBtn = moreBtnContainer ? moreBtnContainer.querySelector('.view-more-btn') : null;
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

    // Event Delegation for Volume Dropdown Toggle
    document.addEventListener('click', (e) => {
        // Function to find the button or the closest button
        const toggleButton = e.target.closest('.volume-toggle-btn');
        
        if (toggleButton) {
            e.preventDefault(); // Prevent default button action (if any)
            const dropdownId = toggleButton.dataset.dropdownId;
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown) {
                // Close other open dropdowns in the same grid/section
                document.querySelectorAll('.volume-dropdown.show').forEach(openDropdown => {
                    // Check if it's a different dropdown 
                    if (openDropdown !== dropdown) {
                        openDropdown.classList.remove('show');
                        // Find the corresponding button and remove active class
                        const openToggleBtn = document.querySelector(`.volume-toggle-btn[data-dropdown-id="${openDropdown.id}"]`);
                        if(openToggleBtn) openToggleBtn.classList.remove('active');
                    }
                });

                dropdown.classList.toggle('show');
                toggleButton.classList.toggle('active');
            }
        } else {
            // Close dropdowns if clicked outside a toggle button or a dropdown
            const isInsideDropdown = e.target.closest('.volume-dropdown');
            if (!isInsideDropdown) {
                document.querySelectorAll('.volume-dropdown.show').forEach(openDropdown => {
                    openDropdown.classList.remove('show');
                    const openToggleBtn = document.querySelector(`.volume-toggle-btn[data-dropdown-id="${openDropdown.id}"]`);
                    if(openToggleBtn) openToggleBtn.classList.remove('active');
                });
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
    
    // --- CMS Logic (New) ---

    // 1. Populate Category Dropdown
    if (BOOK_CATEGORY_SELECT) {
        SIMPLE_CATEGORIES.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            BOOK_CATEGORY_SELECT.appendChild(option);
        });
    }

    // 2. Login Form Submission
    if (LOGIN_FORM) {
        LOGIN_FORM.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('cms-password-input').value;

            if (password === CMS_PASSWORD) {
                sessionStorage.setItem('cmsLoggedIn', 'true');
                showCMSContent();
            } else {
                LOGIN_MESSAGE.textContent = 'وشەی نهێنی نادروستە.';
                LOGIN_MESSAGE.style.display = 'block';
            }
        });

        // Check login status on page load
        if (sessionStorage.getItem('cmsLoggedIn') === 'true') {
            showCMSContent();
        }
    }

    // 3. Show CMS Content
    function showCMSContent() {
        if (CMS_LOGIN_AREA && CMS_CONTENT) {
            CMS_LOGIN_AREA.style.display = 'none';
            CMS_CONTENT.style.display = 'block';
            loadUserAddedBooksForManagement();
        }
    }
    
    // 4. Load User Added Books for Management
    function loadUserAddedBooksForManagement() {
        if (!USER_BOOKS_CONTAINER) return;

        USER_BOOKS_CONTAINER.innerHTML = '';
        let hasBooks = false;

        SIMPLE_CATEGORIES.forEach(category => {
            if (userAddedBooksMock[category]) {
                userAddedBooksMock[category].forEach(book => {
                    if (book.isUserAdded) {
                        USER_BOOKS_CONTAINER.innerHTML += createBookCard(book, category, true); // Pass true for management view
                        hasBooks = true;
                    }
                });
            }
        });

        if (hasBooks) {
            NO_USER_BOOKS_MESSAGE.style.display = 'none';
        } else {
            NO_USER_BOOKS_MESSAGE.style.display = 'block';
        }
    }
    
    // 5. Add/Edit Book Submission (Mock Upload/Save)
    if (ADD_BOOK_FORM) {
        ADD_BOOK_FORM.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // --- FILE UPLOAD LOGIC (Mock/Setup for Firebase) ---
            const pdfFile = BOOK_FILE_INPUT.files[0];
            const imageFile = BOOK_IMAGE_INPUT.files[0];
            
            // MOCKING: Check if files are selected, even though we use mock URLs.
            if (!pdfFile || !imageFile) {
                alert("تکایە هەردوو فایلی کتێب (PDF) و وێنە (Image) هەڵبژێرە.");
                return;
            }
            // For now, we use a mock URL based on the file name. 
            // **REPLACE THIS WITH YOUR ACTUAL FIREBASE STORAGE URL AFTER UPLOAD**
            const fileUrl = `firebase-storage/books/${pdfFile.name}`; 
            const imageUrl = `firebase-storage/images/${imageFile.name}`; 
            
            // --- DATA LOGIC ---
            const id = BOOK_EDIT_ID.value || `user-${Date.now()}`;
            const isEdit = !!BOOK_EDIT_ID.value;
            let oldCategory = null;
            
            if (isEdit) {
                 SIMPLE_CATEGORIES.forEach(cat => {
                    if (userAddedBooksMock[cat]?.find(b => b.id === id)) {
                        oldCategory = cat;
                    }
                 });
            }

            const newCategory = BOOK_CATEGORY_SELECT.value;

            const newBook = {
                id: id,
                title: BOOK_TITLE_INPUT.value.trim(),
                author: BOOK_AUTHOR_INPUT.value.trim(),
                image: imageUrl, // Uses the simulated/real uploaded URL
                pdfUrl: fileUrl, // New key for PDF URL
                isUserAdded: true,
            };

            // 1. Remove book from old location if editing
            if (isEdit && oldCategory && userAddedBooksMock[oldCategory]) {
                userAddedBooksMock[oldCategory] = userAddedBooksMock[oldCategory].filter(book => book.id !== id);
            }
            
            // 2. Ensure the new category array exists
            if (!userAddedBooksMock[newCategory]) {
                userAddedBooksMock[newCategory] = [];
            }

            // 3. Add or re-add the new/edited book
            userAddedBooksMock[newCategory].push(newBook);
            
            // --- DATABASE WRITE (Mock Save) ---
            saveMockData(userAddedBooksMock); // Saves to Mock (localStorage)
            mergeBooksData(); // Update the main allBooksData
            
            if (document.getElementById('categories')) loadBooksIntoCategories(); // Refresh categories section on index.html
            loadUserAddedBooksForManagement(); // Refresh management list

            // Reset form and UI
            ADD_BOOK_FORM.reset();
            BOOK_EDIT_ID.value = '';
            PUBLISH_BOOK_BTN.innerHTML = '<i class="fas fa-upload"></i> بلاو کردنەوە';
            CANCEL_EDIT_BTN.style.display = 'none';
            alert(`کتێبی "${newBook.title}" بە سەرکەوتوویی ${isEdit ? 'دەستکاری کرا' : 'زیاد کرا'}.
**تێبینی گرنگ:**
لە کاتی جێبەجێکردنی سیستمی ڕاستەقینە، دەبێت ئەم زانیاریانە بۆ Firebase Firestore بنێریت بۆ ئەوەی لای هەمووان دەربکەوێت.`);
        });
    }

    // 6. Delete and Edit Button Handlers (Event Delegation)
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.cms-delete-btn');
        const editBtn = e.target.closest('.cms-edit-btn');
        const cancelEditBtn = e.target.closest('#cancel-edit-btn');

        if (deleteBtn) {
            const bookId = deleteBtn.dataset.bookId;
            const category = deleteBtn.dataset.category;
            
            if (confirm('دڵنیای لە سڕینەوەی ئەم کتێبە؟')) {
                // --- DATABASE DELETE (Mock Delete) ---
                if (userAddedBooksMock[category]) {
                    userAddedBooksMock[category] = userAddedBooksMock[category].filter(book => book.id !== bookId);
                    saveMockData(userAddedBooksMock);
                    mergeBooksData();
                    if (document.getElementById('categories')) loadBooksIntoCategories();
                    loadUserAddedBooksForManagement();
                    alert('کتێبەکە بە سەرکەوتوویی سڕایەوە.');
                }
            }
        }

        if (editBtn) {
            const bookId = editBtn.dataset.bookId;
            const category = editBtn.dataset.category;
            const bookToEdit = userAddedBooksMock[category]?.find(b => b.id === bookId);

            if (bookToEdit) {
                // Scroll to the form
                document.getElementById('add-book-area').scrollIntoView({ behavior: 'smooth' });

                // Populate form fields
                BOOK_EDIT_ID.value = bookToEdit.id;
                BOOK_TITLE_INPUT.value = bookToEdit.title;
                BOOK_AUTHOR_INPUT.value = bookToEdit.author;
                BOOK_CATEGORY_SELECT.value = category;
                // Note: File inputs cannot be pre-filled for security reasons. The user must re-upload.
                
                // Update button text
                PUBLISH_BOOK_BTN.innerHTML = '<i class="fas fa-save"></i> گۆڕانکاری پاشکەوت بکە';
                CANCEL_EDIT_BTN.style.display = 'block';
                
                alert('تکایە دووبارە فایلی کتێب (PDF) و وێنە (Image)ـی نوێ هەڵبژێرە، یان هەمان فایلەکانی پێشوو هەڵبژێرە ئەگەر دەتەوێت وەک خۆی بمێنێتەوە.');
            }
        }
        
        if (cancelEditBtn) {
            ADD_BOOK_FORM.reset();
            BOOK_EDIT_ID.value = '';
            PUBLISH_BOOK_BTN.innerHTML = '<i class="fas fa-upload"></i> بلاو کردنەوە';
            CANCEL_EDIT_BTN.style.display = 'none';
        }
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
        // The mergeBooksData function is already called at the start of the script
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        // Apply saved theme to category page immediately
        applyTheme(savedTheme);

        if (category && allBooksData[category]) {
            categoryNameSpan.textContent = category;
            const booksToDisplay = allBooksData[category];
            // Pass category name to createBookCard
            allBooksContainer.innerHTML = booksToDisplay.map(book => createBookCard(book, category)).join('');

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
    
    // Initial loading of books on index.html if no splash screen
    if (!splashScreen || !mainContent.classList.contains('hidden')) {
         loadBooksIntoCategories();
    }
});
