document.addEventListener('DOMContentLoaded', () => {
    // --- Supabase and Admin Configuration ---
    // !!! ZOR GRINGE: AWANE BIGWRE BO ZANIARIYAKANI RASTAQINAY XOT !!!
    const SUPABASE_URL = 'https://mpvlpwzinfsoohdojxwx.supabase.co'; // Example: https://xyz123.supabase.co
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdmxwd3ppbmZzb29oZG9qeHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzEzNzMsImV4cCI6MjA3NzkwNzM3M30.xwCnieqS0Vd45WhQxyZ9x1MskvDjShTdoM-OPXraRBA'; // Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const SECRET_PASSWORD = 'OSti827jdiw92ID7IWY8246josM400';
    const BOOK_TABLE = 'books';
    const STORAGE_BUCKET = 'book-files'; // Name of your Storage Bucket in Supabase
    // ------------------------------------------

    // Initialize Supabase Client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const header = document.querySelector('.header');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNavbar = document.getElementById('main-navbar');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const headerSearchInput = document.getElementById('header-search-input');
    const heroScrollBtn = document.querySelector('.scroll-to-categories');

    // --- NEW ADMIN ELEMENTS (Will only exist on add-book.html) ---
    // Note: 'addBookToggle' is still used on index.html, but the rest are for add-book.html
    const addBookToggle = document.getElementById('add-book-toggle'); 
    const passwordGate = document.getElementById('password-gate');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const passwordErrorMessage = document.getElementById('password-error-message');
    const bookSubmissionArea = document.getElementById('book-submission-area');
    const bookSubmitForm = document.getElementById('book-submit-form');
    const bookTitleInput = document.getElementById('book-title');
    const bookAuthorInput = document.getElementById('book-author');
    const bookFileInput = document.getElementById('book-file');
    const bookImageInput = document.getElementById('book-image');
    const bookFileNameSpan = document.getElementById('book-file-name');
    const bookImageNameSpan = document.getElementById('book-image-name');
    const bookCategorySelect = document.getElementById('book-category');
    const uploadStatus = document.getElementById('upload-status');
    const adminBookListCategorySelect = document.getElementById('admin-book-list-category');
    const adminBookList = document.getElementById('admin-book-list');
    const noAdminBooksMessage = document.getElementById('no-admin-books-message');
    // -------------------------

    // --- Book Data (Hardcoded as a fallback/mock, ideally move to Supabase) ---
    const booksData = {
        'عەقیدە': [
            { id: 'pdfs/pdfs-1.pdf', title: 'ثلاثە الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-1.HEIC', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-26.pdf', title: 'تەوحید', author: 'م.احمد مەلا فایەق سعید', image: 'photos/photos-26.jpg', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-3.pdf', title: 'قواعد الأربعە', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-3.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-4.pdf', title: 'کشف الشبهات (مامۆستا کامەران)', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-4.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-5.pdf', title: 'کشف الشبهات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-5.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-6.pdf', title: 'الواجبات المتحتمات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-6.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-7.pdf', title: 'کتاب التوحید', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-7.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-8.pdf', title: 'ثلاثە الاصول وقواعد الأربعة و ستة الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-8.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-9.pdf', title: 'نواقض الإسلام', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-9.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-10.pdf', title: 'لمعة الإعتقاد', author: 'موفق الدین ابی محمد عبدالله', image: 'photos/photos-10.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-11.jpg', title: 'شرح السنة بربهاری', author: 'إمام بەربەهاری', image: 'photos/photos-11.jpg', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-12.JPG', title: 'شرح السنة بربهاری', author: 'إمام بەربەهاری', image: 'photos/photos-12.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-13.JPG', title: 'الوجیز', author: 'عبدالله بن عبدالحميد الأثري ', image: 'photos/photos-13.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-14.JPG', title: 'عەقیدة الواسطیة', author: 'د.خالد بن ناصر بن سعید', image: 'photos/photos-14.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-15.JPG', title: 'مسائل الجهلیة', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-15.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-16.JPG', title: 'مفید المستفید فی کفر تارک التوحید', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-16.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-17.JPG', title: 'الولاء والبراء', author: 'سیف اللە السني', image: 'photos/photos-17.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-18.JPG', title: '٥٠ پسیار و وەڵام لەسەر بیر و باوەڕ', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-18.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-19.JPG', title: 'قواعد الأربعة', author: 'مامۆستا مەبەست کاژاوی', image: 'photos/photos-19.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-20.jpg', title: 'لمعة الإعتقاد', author: 'موفق الدین أبي محمد عبدللە ', image: 'photos/photos-20.jpg', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-21.HEIC', title: 'مفید المستفید فی کفر تارک التوحید', author: 'م هـاوکـار کوردی', image: 'photos/photos-21.HEIC', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-22.jpg', title: 'الواجبات المتحتیمات', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-22.jpg', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-23.HEIC', title: 'کۆدەنگی ئەهلی سوننە دەربارەی بیر و باوەڕ', author: 'کتێبخانەی ئیسلام', image: 'photos/photos-23.HEIC', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-24.JPG', title: 'اعتقاد أئمة الحدیث', author: 'حارث المسلم السنی', image: 'photos/photos-24.JPG', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-25.jpg', title: 'شەرحی کتاب التوحید', author: 'هیثم بن محمد سرحان', image: 'photos/photos-25.jpg', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-2.png', title: 'ثلاثە الاصول', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-2.png', category: 'عەقیدە' },
            { id: 'pdfs/pdfs-27.HEIC', title: 'هەڵوەشێنەرەوەکانی ئیسلام', author: 'محمدی کوڕی عبدالوهاب', image: 'photos/photos-27.HEIC', category: 'عەقیدە' }
        ],
        'تەفسیر': [
            // Tafsir books with mock volume structure (should ideally be migrated to supabse as separate records for better management)
            { id: 't1', title: 'تەفسیری ڕوونی قورئان', author: 'د. عبدلکریم زێدان', image: 'https://via.placeholder.com/300x400/3498db/ffffff?text=تەفسیر+1', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-1-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-1-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-1-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-1-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-1-vol-5.pdf' }
                ]
            },
            { id: 't2', title: 'کوردی تەفسیری قورئان', author: 'موحەمەد عەلی', image: 'https://via.placeholder.com/300x400/2980b9/ffffff?text=تەفسیر+2', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-2-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-2-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-2-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-2-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-2-vol-5.pdf' }
                ]
            },
            { id: 't3', title: 'تەفسیری ئاسان', author: 'شێخ محەمەد ساڵح', image: 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=تەفسیر+3', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-3-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-3-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-3-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-3-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-3-vol-5.pdf' }
                ]
            },
            { id: 't4', title: 'وشە بە وشەی قورئان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/1abc9c/ffffff?text=تەفسیر+4', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-4-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-4-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-4-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-4-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-4-vol-5.pdf' }
                ]
            },
            { id: 't5', title: 'تەفسیری نور', author: 'د. نووری عومەر', image: 'https://via.placeholder.com/300x400/5cb85c/ffffff?text=تەفسیر+5', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-5-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-5-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-5-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-5-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-5-vol-5.pdf' }
                ]
            },
            { id: 't6', title: 'کلیلەکانی تەفسیر', author: 'د. ئەحمەد کەرکوکی', image: 'https://via.placeholder.com/300x400/4CAF50/ffffff?text=تەفسیر+6', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-6-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-6-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-6-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-6-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-6-vol-5.pdf' }
                ]
            },
            { id: 't7', title: 'تەفسیری ڕووناکی', author: 'شێخ عوسمان محەمەد', image: 'https://via.placeholder.com/300x400/66BB6A/ffffff?text=تەفسیر+7', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-7-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-7-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-7-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-7-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-7-vol-5.pdf' }
                ]
            },
            { id: 't8', title: 'ھەناوی قورئان', author: 'م. خەسرەو جاف', image: 'https://via.placeholder.com/300x400/81C784/ffffff?text=تەفسیر+8', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-8-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-8-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-8-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-8-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-8-vol-5.pdf' }
                ]
            },
            { id: 't9', title: 'تەفسیری پەیام', author: 'مامۆستا مەلا عەلی', image: 'https://via.placeholder.com/300x400/9CCC65/ffffff?text=تەفسیر+9', category: 'تەفسیر',
                volumes: [
                    { title: 'بەرگی یەک', id: 'pdfs/tafseer-9-vol-1.pdf' },
                    { title: 'بەرگی دوو', id: 'pdfs/tafseer-9-vol-2.pdf' },
                    { title: 'بەرگی سێ', id: 'pdfs/tafseer-9-vol-3.pdf' },
                    { title: 'بەرگی چوار', id: 'pdfs/tafseer-9-vol-4.pdf' },
                    { title: 'بەرگی پێنج', id: 'pdfs/tafseer-9-vol-5.pdf' }
                ]
            },
            { id: 't10', title: 'زانستەکانی تەفسیر', author: 'د. محەمەد عەبدولڕەحمان', image: 'https://via.placeholder.com/300x400/AED581/ffffff?text=تەفسیر+10', category: 'تەفسیر',
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
            { id: 'h_new1', title: 'صحیح البخاری', author: 'ئیمامی بوخاری', image: 'https://via.placeholder.com/300x400/f44336/ffffff?text=بوخاری', category: 'حەدیس' },
            { id: 'h_new2', title: 'صحیح مسلم', author: 'ئیمامی موسلیم', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=موسلیم', category: 'حەدیس' },
            { id: 'h_new3', title: 'چهل حەدیس', author: 'ئیمامی نەوەوی', image: 'https://via.placeholder.com/300x400/9c27b0/ffffff?text=چهل+حەدیس', category: 'حەدیس' },
            { id: 'h_new4', title: 'فەرموودە قودسییەکان', author: 'جامیع', image: 'https://via.placeholder.com/300x400/673ab7/ffffff?text=قودسی', category: 'حەدیس' },
            { id: 'h_new5', title: 'مونتەخەبی حەدیس', author: 'د. محەمەد حامد', image: 'https://via.placeholder.com/300x400/3f51b5/ffffff?text=مونتەخەب', category: 'حەدیس' }
        ],
        'سیرەی موسولمانان': [
            { id: 'sira1', title: 'سیرەی پێغەمبەر ﷺ', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/00bcd4/ffffff?text=سیرەی+پێغەمبەر', category: 'سیرەی موسولمانان' },
            { id: 'sira2', title: 'ژیانی هاوەڵان', author: 'د. عائض القرني', image: 'https://via.placeholder.com/300x400/009688/ffffff?text=هاوەڵان', category: 'سیرەی موسولمانان' },
            { id: 'sira3', title: 'خەلیفە ڕاشیدەکان', author: 'عەلی تەنتاوی', image: 'https://via.placeholder.com/300x400/4caf50/ffffff?text=خەلیفەکان', category: 'سیرەی موسولمانان' },
            { id: 'sira4', title: 'پاڵەوانانی ئیسلام', author: 'م. محەمەد عەلی', image: 'https://via.placeholder.com/300x400/8bc34a/ffffff?text=پاڵەوانان', category: 'سیرەی موسولمانان' },
            { id: 'sira5', title: 'مێژووی فتوحات', author: 'د. ڕاغب السرجانی', image: 'https://via.placeholder.com/300x400/cddc39/ffffff?text=فتوحات', category: 'سیرەی موسولمانان' }
        ],
        'فیقه': [ // Renamed from 'فیقه' to 'کتێبی فقە' in categories, but internal key remains 'فیقه'
            { id: 'f1', title: 'سەرەتای فیقه', author: 'ئیمامی شافیعی', image: 'https://via.placeholder.com/300x400/f1c40f/ffffff?text=فیقه+1', category: 'فیقه' },
            { id: 'f2', title: 'فیقهی ئیسلامی', author: 'وەھبە زوحەیلی', image: 'https://via.placeholder.com/300x400/f39c12/ffffff?text=فیقه+2', category: 'فیقه' },
            { id: 'f3', title: 'حوکمەکانی نوێژ و ڕۆژوو', author: 'محەمەد ناسر', image: 'https://via.placeholder.com/300x400/e67e22/ffffff?text=فیقه+3', category: 'فیقه' },
            { id: 'f4', title: 'ڕێساکانی حەج و عومرە', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/d35400/ffffff?text=فیقه+4', category: 'فیقه' },
            { id: 'f5', title: 'فیقهی مامەڵە داراییەکان', author: 'د. یوسف قەرزاوی', image: 'https://via.placeholder.com/300x400/f7b731/ffffff?text=فیقه+5', category: 'فیقه' },
            { id: 'f6', title: 'کتێبی زەکات', author: 'ئەحمەد شوکری', image: 'https://via.placeholder.com/300x400/f9a22f/ffffff?text=فیقه+6', category: 'فیقه' },
            { id: 'f7', title: 'بنەماکانی فیقه', author: 'محەمەد ئەبولجاسمی', image: 'https://via.placeholder.com/300x400/fab60c/ffffff?text=فیقه+7', category: 'فیقه' },
            { id: 'f8', title: 'فیقهی خێزان', author: 'عەبدولواحید شێرزادی', image: 'https://via.placeholder.com/300x400/fcc42e/ffffff?text=فیقه+8', category: 'فیقه' },
            { id: 'f9', title: 'ڕوونکردنەوەی فەتواکان', author: 'لێژنەی فەتوا', image: 'https://via.placeholder.com/300x400/fcd66a/ffffff?text=فیقه+9', category: 'فیقه' },
            { id: 'f10', title: 'فیقهی ژن و مێردایەتی', author: 'د. نەرمین محەمەد', image: 'https://via.placeholder.com/300x400/ffe082/ffffff?text=فیقه+10', category: 'فیقه' }
        ],
        'هەمەجۆری ئیسلامی': [
            { id: 'i_misc1', title: 'چۆنیەتی خۆپاراستن لە چاوی پیس', author: 'شێخ موحەمەد صالح المنجد', image: 'https://via.placeholder.com/300x400/ad1457/ffffff?text=چاوی+پیس', category: 'هەمەجۆری ئیسلامی' },
            { id: 'i_misc2', title: 'ئادابەکانی ژیان', author: 'شێخ عبدالقادر گەیلانی', image: 'https://via.placeholder.com/300x400/880e4f/ffffff?text=ئاداب', category: 'هەمەجۆری ئیسلامی' },
            { id: 'i_misc3', title: 'نوێژ لە قورئان و سوننەتدا', author: 'ابن باز', image: 'https://via.placeholder.com/300x400/e91e63/ffffff?text=نوێژ', category: 'هەمەجۆری ئیسلامی' },
            { id: 'i_misc4', title: 'جوانترین ناوەکانی خوا', author: 'ئیبراهیم سەعدی', image: 'https://via.placeholder.com/300x400/c2185b/ffffff?text=ناوەکانی+خوا', category: 'هەمەجۆری ئیسلامی' },
            { id: 'i_misc5', title: 'چیرۆکەکانی قورئان', author: 'ابن کثیر', image: 'https://via.placeholder.com/300x400/ec407a/ffffff?text=چیرۆکەکانی+قورئان', category: 'هەمەجۆری ئیسلامی' }
        ],
        'سیاسەت': [
            { id: 'p1', title: 'سیاسەت و ئیدارە', author: 'ئەحمەد شاڵی', image: 'https://via.placeholder.com/300x400/27ae60/ffffff?text=سیاسەت+1', category: 'سیاسەت' },
            { id: 'p2', title: 'ھونەری حوکمڕانی', author: 'نیکۆلۆ ماکیاڤێلی', image: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=سیاسەت+2', category: 'سیاسەت' },
            { id: 'p3', title: 'بیردۆزە سیاسییەکان', author: 'ڕۆبێرت دال', image: 'https://via.placeholder.com/300x400/63c784/ffffff?text=سیاسەت+3', category: 'سیاسەت' },
            { id: 'p4', title: 'گەندەڵی سیاسی', author: 'سۆران عومەر', image: 'https://via.placeholder.com/300x400/409d5c/ffffff?text=سیاسەت+4', category: 'سیاسەت' },
            { id: 'p5', title: 'دیموکراسی و حکومەت', author: 'جۆن لۆک', image: 'https://via.placeholder.com/300x400/7bd492/ffffff?text=سیاسەت+5', category: 'سیاسەت' },
            { id: 'p6', title: 'مافەکانی مرۆڤ', author: 'ئەلینۆر ڕۆزڤێڵت', image: 'https://via.placeholder.com/300x400/28a745/ffffff?text=سیاسەت+6', category: 'سیاسەت' },
            { id: 'p7', title: 'مێژووی فیکری سیاسی', author: 'ئیمانویل کانت', image: 'https://via.placeholder.com/300x400/3abf5f/ffffff?text=سیاسەت+7', category: 'سیاسەت' },
            { id: 'p8', title: 'پەیوەندییە نێودەوڵەتییەکان', author: 'جوزێف نای', image: 'https://via.placeholder.com/300x400/52d978/ffffff?text=سیاسەت+8', category: 'سیاسەت' },
            { id: 'p9', title: 'سیستمی سیاسی عێراق', author: 'سەڵاح خورشید', image: 'https://via.placeholder.com/300x400/66ec91/ffffff?text=سیاسەت+9', category: 'سیاسەت' },
            { id: 'p10', title: 'گۆڕانکارییەکانی ڕۆژھەڵاتی ناوەڕاست', author: 'بەرهەم ساڵح', image: 'https://via.placeholder.com/300x400/7ef7a9/ffffff?text=سیاسەت+10', category: 'سیاسەت' }
        ],
        'مێژوو': [
            { id: 'h1', title: 'مێژووی کورد و کوردستان', author: 'حەمید گۆمەشینی', image: 'https://via.placeholder.com/300x400/8e44ad/ffffff?text=مێژووی+کورد', category: 'مێژوو' },
            { id: 'h2', title: 'مێژووی شارستانیەتەکان', author: 'ویل دیورانت', image: 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=شارستانیەت', category: 'مێژوو' },
            { id: 'h3', title: 'ڕاپەڕینەکانی گەلانی ڕۆژھەڵات', author: 'ئیحسان نور', image: 'https://via.placeholder.com/300x400/be2edd/ffffff?text=ڕۆژھەڵات', category: 'مێژوو' },
            { id: 'h4', title: 'سەردەمی زێڕینی ئیسلام', author: 'ھاریسن فۆرد', image: 'https://via.placeholder.com/300x400/a55eea/ffffff?text=ئیسلام', category: 'مێژوو' },
            { id: 'h5', title: 'مێژووی جیھان', author: 'جین ماکسوێڵ', image: 'https://via.placeholder.com/300x400/cd84f1/ffffff?text=جیھان', category: 'مێژوو' },
            { id: 'h6', title: 'جەنگە جیھانییەکان', author: 'ئیبراهیم فەوزی', image: 'https://via.placeholder.com/300x400/6c5ce7/ffffff?text=جەنگ', category: 'مێژوو' },
            { id: 'h7', title: 'دەوڵەتە کوردییەکان', author: 'مەسعود محەمەد', image: 'https://via.placeholder.com/300x400/7d3f98/ffffff?text=دەوڵەتە+کوردییەکان', category: 'مێژوو' },
            { id: 'h8', title: 'سەڵاحەدینی ئەیوبی', author: 'عەلی قەرەداغی', image: 'https://via.placeholder.com/300x400/9d44c9/ffffff?text=سەڵاحەدین', category: 'مێژوو' },
            { id: 'h9', title: 'مێژووی ئیمپراتۆرییەکان', author: 'جۆن سمت', image: 'https://via.placeholder.com/300x400/b36dc9/ffffff?text=ئیمپراتۆرییەت', category: 'مێژوو' },
            { id: 'h10', title: 'شۆڕشی پیشەسازی', author: 'جەیمس وات', image: 'https://via.placeholder.com/300x400/c78dd3/ffffff?text=شۆڕش', category: 'مێژوو' }
        ],
        'هەمەجۆر': [
            { id: 'misc1', title: 'فەلسەفەی ژیان', author: 'ئەلبرت کامو', image: 'https://via.placeholder.com/300x400/607d8b/ffffff?text=فەلسەفە', category: 'هەمەجۆر' },
            { id: 'misc2', title: 'زانستی گەردوون', author: 'ستیڤن هۆکینگ', image: 'https://via.placeholder.com/300x400/455a64/ffffff?text=گەردوون', category: 'هەمەجۆر' },
            { id: 'misc3', title: 'پەرەپێدانی خود', author: 'برایان ترەیسی', image: 'https://via.placeholder.com/300x400/78909c/ffffff?text=پەرەپێدان', category: 'هەمەجۆر' },
            { id: 'misc4', title: 'چیرۆکی مناڵان', author: 'هانس کریستیان ئەندرسن', image: 'https://via.placeholder.com/300x400/90a4ae/ffffff?text=مناڵان', category: 'هەمەجۆر' },
            { id: 'misc5', title: 'شیعر و ئەدەب', author: 'مەولانا', image: 'https://via.placeholder.com/300x400/b0bec5/ffffff?text=شیعر', category: 'هەمەجۆر' }
        ],
        'هەموو کتێبەکان': []
    };

    // Function to get category list from booksData keys (excluding 'هەموو کتێبەکان')
    const CATEGORIES_LIST = Object.keys(booksData).filter(cat => cat !== 'هەموو کتێبەکان');

    // Populate 'هەموو کتێبەکان' with all books from other categories (initially)
    for (const category in booksData) {
        if (category !== 'هەموو کتێبەکان') {
            booksData['هەموو کتێبەکان'] = booksData['هەموو کتێبەکان'].concat(booksData[category]);
        }
    }

// Function to create a book card HTML
function createBookCard(book, category = '', isAdmin = false) { // Added isAdmin parameter
    // Use the presence of the 'volumes' array to determine if it's a multi-volume book in the Tafsir category
    const isTafsirWithVolumes = category === 'تەفسیر' && book.volumes && book.volumes.length > 0;
    
    let bookActionsHtml;

    if (isTafsirWithVolumes) {
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
                <a href="${book.id}" class="btn read-btn" target="_blank">خوێندنەوە</a>
            </div>
        `;
    }

    // NEW: Admin Delete Button
    const deleteButtonHtml = isAdmin ? `
        <button class="delete-book-btn" data-book-id="${book.supabase_id || book.id}" data-file-url="${book.pdf_url || book.id}" data-image-url="${book.image_url || book.image}">
            <i class="fas fa-trash"></i> سڕینەوە
        </button>
    ` : '';

    return `
        <div class="book-card ${isAdmin ? 'admin-book-card' : ''}" 
             data-title="${book.title.toLowerCase()}" 
             data-author="${book.author.toLowerCase()}" 
             data-category="${category}">
            <img src="${book.image}" alt="${book.title} وێنەی کتێب">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p>نووسەر: ${book.author}</p>
            </div>
            ${bookActionsHtml}
            ${deleteButtonHtml}
        </div>
    `;
}

    // --- NEW: Dynamic Book Fetching (Integrated with Supabase) ---

    // Function to fetch books from Supabase (and combine with mock data)
    async function fetchBooks() {
        // 1. Fetch Dynamic Books from Supabase
        let dynamicBooks = [];
        try {
            // Fetch only non-deleted books
            const { data, error } = await supabase
                .from(BOOK_TABLE)
                .select('id, title, author, category, pdf_url, image_url')
                .eq('is_deleted', false); 

            if (error) throw error;
            
            // Map Supabase data to the existing book structure
            dynamicBooks = data.map(book => ({
                supabase_id: book.id, // Keep Supabase ID for deletion
                id: book.pdf_url, // Use PDF URL as the 'id' for the read button
                title: book.title,
                author: book.author,
                image: book.image_url, // Use Image URL as the 'image' for the card
                category: book.category,
                pdf_url: book.pdf_url, // Store both for admin section
                image_url: book.image_url
            }));

        } catch (e) {
            console.error('Error fetching dynamic books from Supabase:', e.message);
            // Fallback: If Supabase fails, continue with hardcoded data
        }

        // 2. Combine Hardcoded Books with Dynamic Books
        const allBooks = {};
        
        // Initialize all categories with hardcoded data
        Object.assign(allBooks, JSON.parse(JSON.stringify(booksData))); 
        
        // Merge dynamic books into their respective categories
        dynamicBooks.forEach(book => {
            if (allBooks[book.category]) {
                // Ensure dynamic books appear at the beginning of the list
                allBooks[book.category].unshift(book);
            } else {
                // Handle new categories if allowed by Supabase, and add them
                allBooks[book.category] = [book];
                // Also add the new category to the list if it's not present
                if (!CATEGORIES_LIST.includes(book.category)) {
                    CATEGORIES_LIST.push(book.category);
                }
            }
        });

        // Repopulate 'هەموو کتێبەکان'
        allBooks['هەموو کتێبەکان'] = [];
        for (const cat in allBooks) {
            if (cat !== 'هەموو کتێبەکان') {
                allBooks['هەموو کتێبەکان'] = allBooks['هەموو کتێبەکان'].concat(allBooks[cat]);
            }
        }

        return allBooks;
    }

    // Function to load books into categories (for index.html)
    async function loadBooksIntoCategories() {
        const allBooks = await fetchBooks(); // Fetch all books
        
        const categoriesOnIndex = [
            'عەقیدە', 'تەفسیر', 'حەدیس', 'سیرەی موسولمانان', 'فیقه',
            'هەمەجۆری ئیسلامی', 'سیاسەت', 'مێژوو', 'هەمەجۆر', 'هەموو کتێبەکان'
        ];

        categoriesOnIndex.forEach(category => {
            const containerId = category + '-books';
            const container = document.getElementById(containerId);
            if (container) {
                const booksForCategory = allBooks[category] || [];
                const booksToDisplay = booksForCategory.slice(0, 4); // Display first 4 books
                
                // Pass category name to createBookCard
                container.innerHTML = booksToDisplay.map(book => createBookCard(book, category, false)).join('');

                // Update "زیاتر ببینە" button href (Logic remains the same)
                const moreBtn = container.nextElementSibling.querySelector('.view-more-btn');
                if (moreBtn) {
                    let filename;
                    switch(category) {
                        case 'عەقیدە': filename = 'all-books.html'; break;
                        case 'تەفسیر': filename = 'tafseer-books.html'; break;
                        case 'حەدیس': filename = 'hadis-books.html'; break;
                        case 'سیرەی موسولمانان': filename = 'sira-muslim-books.html'; break;
                        case 'فیقه': filename = 'fka-books.html'; break;
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
        
        return allBooks; // Return for use in other parts of the script
    }
    
    // --- NEW: Admin Book Management Logic (Wrapped in check for add-book.html elements) ---
    
    // Function to populate the admin category select dropdowns
    function populateAdminCategories() {
        if (!bookCategorySelect || !adminBookListCategorySelect) return; // Only run on add-book.html
        
        // Use the dynamically generated list
        const categories = CATEGORIES_LIST; 
        [bookCategorySelect, adminBookListCategorySelect].forEach(select => {
            if (select) {
                // Clear existing options (keeping 'all' for admin list and 'disabled selected' for form)
                while (select.options.length > (select.id === 'book-category' ? 1 : 1)) {
                    select.remove(select.options.length - 1);
                }
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat;
                    option.textContent = cat;
                    select.appendChild(option);
                });
            }
        });
    }
    
    // Function to load books into the admin deletion list
    async function loadAdminBooks(filterCategory) {
        if (!adminBookList) return; // Only run on add-book.html

        let booksToDisplay = [];
        
        // Fetch books from Supabase (with the same function as above)
        const allBooks = await fetchBooks();
        
        if (filterCategory === 'all') {
             // Combine all books (excluding tafsir volumes for simplicity in deletion view)
             booksToDisplay = allBooks['هەموو کتێبەکان'].filter(book => !book.volumes);
        } else if (allBooks[filterCategory]) {
            booksToDisplay = allBooks[filterCategory].filter(book => !book.volumes);
        }
        
        adminBookList.innerHTML = booksToDisplay.map(book => createBookCard({
            ...book, 
            supabase_id: book.supabase_id || book.id, // Use actual ID or fallback for hardcoded data
            pdf_url: book.pdf_url || book.id,
            image_url: book.image_url || book.image
        }, book.category, true)).join('');

        if (noAdminBooksMessage) {
            if (booksToDisplay.length === 0) {
                noAdminBooksMessage.classList.remove('hidden');
            } else {
                noAdminBooksMessage.classList.add('hidden');
            }
        }
    }


    // --- Event Listeners for Admin Section (add-book.html) ---
    
    // 1. Password Gate Logic (Runs only on add-book.html)
    if (adminLoginBtn) {
         // Check authentication immediately on load for add-book.html
        if (localStorage.getItem('isAdminAuthenticated') === 'true') {
             if (passwordGate) passwordGate.classList.add('hidden');
             if (bookSubmissionArea) bookSubmissionArea.classList.remove('hidden');
             populateAdminCategories();
             loadAdminBooks('all');
        } else {
            if (passwordGate) passwordGate.classList.remove('hidden');
            if (bookSubmissionArea) bookSubmissionArea.classList.add('hidden');
        }

        adminLoginBtn.addEventListener('click', () => {
            if (adminPasswordInput.value === SECRET_PASSWORD) {
                if (passwordGate) passwordGate.classList.add('hidden');
                if (bookSubmissionArea) bookSubmissionArea.classList.remove('hidden');
                if (passwordErrorMessage) passwordErrorMessage.classList.add('hidden');
                localStorage.setItem('isAdminAuthenticated', 'true'); // Persist login
                populateAdminCategories(); // Load categories for admin forms
                loadAdminBooks('all'); // Load all books for management
            } else {
                if (passwordErrorMessage) passwordErrorMessage.classList.remove('hidden');
            }
            if (adminPasswordInput) adminPasswordInput.value = ''; // Clear password
        });
    }
    
    // 2. File Name Display
    if (bookFileInput) {
        bookFileInput.addEventListener('change', () => {
            bookFileNameSpan.textContent = bookFileInput.files.length > 0 ? bookFileInput.files[0].name : 'فایل هەڵنەبژێردراوە';
        });
    }

    if (bookImageInput) {
        bookImageInput.addEventListener('change', () => {
            bookImageNameSpan.textContent = bookImageInput.files.length > 0 ? bookImageInput.files[0].name : 'فایل هەڵنەبژێردراوە';
        });
    }

    // 3. Book Submission Logic (Create)
    if (bookSubmitForm) {
        bookSubmitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            uploadStatus.classList.add('hidden');
            uploadStatus.classList.remove('error-message', 'success-message');
            
            const title = bookTitleInput.value.trim();
            const author = bookAuthorInput.value.trim();
            const category = bookCategorySelect.value;
            const pdfFile = bookFileInput.files[0];
            const imageFile = bookImageInput.files[0];

            if (!title || !author || !category || !pdfFile || !imageFile) {
                uploadStatus.textContent = 'تکایە هەموو خانەکان پڕ بکەرەوە و فایلەکان هەڵبژێرە.';
                uploadStatus.classList.add('error-message');
                uploadStatus.classList.remove('hidden');
                return;
            }
            
            uploadStatus.textContent = '...سەرەتا کتێبەکە باردەکرێت بۆ سێرڤەر (Supabase Storage)';
            uploadStatus.classList.remove('hidden');
            document.getElementById('submit-book-btn').disabled = true;

            try {
                // 1. Upload PDF
                const pdfPath = `pdfs/${Date.now()}-${pdfFile.name}`;
                let { error: pdfError } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(pdfPath, pdfFile);
                if (pdfError) throw pdfError;

                // 2. Upload Image
                const imagePath = `covers/${Date.now()}-${imageFile.name}`;
                let { error: imageError } = await supabase.storage
                    .from(STORAGE_BUCKET)
                    .upload(imagePath, imageFile);
                if (imageError) throw imageError;

                // Get Public URLs
                const pdfUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(pdfPath).data.publicUrl;
                const imageUrl = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(imagePath).data.publicUrl;

                // 3. Insert metadata into Database
                const { error: dbError } = await supabase
                    .from(BOOK_TABLE)
                    .insert([
                        { 
                            title: title, 
                            author: author, 
                            category: category, 
                            pdf_url: pdfUrl, 
                            image_url: imageUrl 
                        }
                    ]);
                
                if (dbError) throw dbError;

                uploadStatus.textContent = 'کتێبەکە بە سەرکەوتوویی بڵاوکرایەوە!';
                uploadStatus.classList.add('success-message');
                bookSubmitForm.reset();
                bookFileNameSpan.textContent = 'فایل هەڵنەبژێردراوە';
                bookImageNameSpan.textContent = 'فایل هەڵنەبژێردراوە';
                
                // Refresh book lists (main page is less critical, but admin must refresh)
                await loadAdminBooks(adminBookListCategorySelect.value);

            } catch (error) {
                uploadStatus.textContent = `هەڵە لە بڵاوکردنەوەی کتێبدا: ${error.message}`;
                uploadStatus.classList.add('error-message');
                console.error('Submission Error:', error);
            } finally {
                document.getElementById('submit-book-btn').disabled = false;
            }
        });
    }
    
    // 4. Admin Category Filter (Read for Admin)
    if (adminBookListCategorySelect) {
        adminBookListCategorySelect.addEventListener('change', (e) => {
            loadAdminBooks(e.target.value);
        });
    }

    // 5. Delete Book Logic (Delete) - Using Event Delegation
    if (adminBookList) {
        adminBookList.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-book-btn');
            if (deleteBtn) {
                const bookId = deleteBtn.dataset.bookId;
                // const pdfUrl = deleteBtn.dataset.fileUrl; // We are soft deleting, storage cleanup is optional
                // const imageUrl = deleteBtn.dataset.imageUrl;
                
                if (!confirm(`دڵنیای لە سڕینەوەی کتێب "${bookId}"؟`)) return;

                deleteBtn.disabled = true;
                deleteBtn.textContent = 'سڕینەوە...';
                
                try {
                    // Soft delete: Update is_deleted to true
                    const { error: dbError } = await supabase
                        .from(BOOK_TABLE)
                        .update({ is_deleted: true }) 
                        .eq('id', bookId)
                        .select(); // Add .select() to get the updated row (optional but good practice)
                        
                    if (dbError) throw dbError;

                    alert('کتێبەکە بە سەرکەوتوویی سڕایەوە!');
                    
                    // Refresh book lists
                    await loadAdminBooks(adminBookListCategorySelect.value);

                } catch (error) {
                    alert(`هەڵە لە سڕینەوەی کتێبدا: ${error.message}`);
                    console.error('Deletion Error:', error);
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = 'سڕینەوە';
                }
            }
        });
    }
    
    // --- End NEW: Admin Book Management Logic ---

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

    // *گۆڕانکاری ١: جێبەجێکردنی دۆخەکە بۆ هەموو لاپەڕەکان لەسەرەتاوە*
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    applyTheme(savedTheme); // Apply theme immediately on page load for persistence

    // Event listener for theme toggle button on index.html (and add-book.html if added)
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // *گۆڕانکاری ٢: لۆژیکی سکرین پڕکردنەوەی (Splash Screen) بۆ ڕێگەگرتن لە دووبارەبوونەوەی کاتێک گەڕانەوە دەکرێت*
    // Splash Screen Logic (only for index.html)
    if (splashScreen && mainContent.classList.contains('hidden')) { 
        const navigationType = performance.getEntriesByType("navigation")[0].type;
        
        if (navigationType === 'back_forward') {
             // Skip splash screen on history navigation (Back/Forward)
             splashScreen.classList.add('hidden');
             mainContent.classList.remove('hidden');
             
             // Load books immediately
             (async () => {
                 await loadBooksIntoCategories(); 
             })();

        } else {
            // Normal splash screen for 'navigate' or 'reload'
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                setTimeout(async () => {
                    splashScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    
                    await loadBooksIntoCategories(); // Load books after splash screen fades
                    
                }, 800); // Wait for the fade-out transition to complete (0.8s from CSS)
            }, 3000); // 3 seconds before starting fade-out
        }

    } else {
        // If not on index.html (e.g., all-books.html or add-book.html) or splash skipped, ensure content is visible
        if (mainContent) {
            mainContent.classList.remove('hidden');
            // If main content is not hidden, run book loading immediately (only for index.html)
             if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                (async () => {
                    await loadBooksIntoCategories();
                })();
            }
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
    // Only apply this to the index.html header, not the fixed one in all-books.html or add-book.html
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
            const targetId = this.getAttribute('href');
            // Check if it's the settings toggle or add book toggle, let their handlers take over
            if (targetId === '#') {
                return;
            }
            
            e.preventDefault();
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

        // Function to load books specifically for category pages
        const loadCategoryPageBooks = async (cat) => {
            const allBooks = await fetchBooks();
            if (cat && allBooks[cat]) {
                categoryNameSpan.textContent = cat;
                const booksToDisplay = allBooks[cat].filter(book => !book.volumes); // Filter out mock volume structure for simplicity on category pages
                // Pass category name to createBookCard
                allBooksContainer.innerHTML = booksToDisplay.map(book => createBookCard(book, cat, false)).join('');

                // Calculate total header height for category pages dynamically
                let totalAllBooksHeaderHeight = 0;
                const currentAllBooksSection = document.getElementById('all-books-section');
                if (allBooksHeaderContent && allBooksSearchContainer) {
                    // Need a slight delay to ensure CSS is applied before measuring
                    setTimeout(() => {
                        totalAllBooksHeaderHeight = allBooksHeaderContent.offsetHeight + allBooksSearchContainer.offsetHeight;
                        document.documentElement.style.setProperty('--all-books-header-total-height', `${totalAllBooksHeaderHeight}px`);
                        if (currentAllBooksSection) {
                            currentAllBooksSection.style.paddingTop = `${totalAllBooksHeaderHeight}px`;
                        }
                    }, 50);
                }


                // Header Visibility on Scroll for category pages
                let lastScrollY = window.scrollY;
                
                window.addEventListener('scroll', () => {
                    if (allBooksHeader) {
                        // Recalculate height on scroll in case of responsive changes
                        const currentHeaderHeight = (allBooksHeaderContent ? allBooksHeaderContent.offsetHeight : 0) + 
                                                    (allBooksSearchContainer ? allBooksSearchContainer.offsetHeight : 0);
                        document.documentElement.style.setProperty('--all-books-header-total-height', `${currentHeaderHeight}px`);


                        if (window.scrollY > currentHeaderHeight / 2) { // Start hiding after scrolling past half of the header
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

                            // Also check if the card is an admin card and skip if it is
                            if (card.classList.contains('admin-book-card')) return; 

                            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                                card.style.display = 'flex';
                                foundResults++;
                            } else {
                                card.style.display = 'none';
                            }
                        });

                        if (noResultsMessage) {
                            if (foundResults === 0) {
                                noResultsMessage.style.display = 'block';
                            } else {
                                noResultsMessage.style.display = 'none';
                            }
                        }
                    });
                }
            } else {
                // Handle case where category is not found or not specified
                categoryNameSpan.textContent = "کتێبەکان";
                allBooksContainer.innerHTML = `<p style="text-align: center; font-size: 1.5rem; color: var(--gray-text);">ببورە، ھیچ کتێبێک بۆ ئەم بەشە نەدۆزرایەوە یان بەشەکە دیارینەکراوە.</p>`;
                if (noResultsMessage) noResultsMessage.style.display = 'none'; // Hide if no books loaded
            }
        };

        loadCategoryPageBooks(category);
    }
});
