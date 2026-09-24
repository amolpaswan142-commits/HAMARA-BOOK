// HAMARA BOOK - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentUser = JSON.parse(localStorage.getItem('hamara_book_user')) || null;
  let currentCategory = 'school'; // Default selected matching user image
  let searchQuery = '';
  let sortBy = 'featured';
  let bookmarks = JSON.parse(localStorage.getItem('hamara_book_bookmarks')) || ['pop-1', 'it-1', 'pop-3'];
  
  // Reader state
  let activeBook = null;
  let currentChapterIndex = 0;
  let currentPageIndex = 0;
  let readerFontSize = 17;

  function createAdditionalBook(book, topics) {
    return {
      ...book,
      cover: book.cover,
      chapters: topics.map((title, index) => ({
        chapterNumber: index + 1,
        title: `Chapter ${index + 1}: ${title}`,
        pages: [
          `Welcome to Chapter ${index + 1}: ${title} (Page 1 of 3)\n\nThis chapter introduces the key ideas behind ${title}. Read the concepts step by step and connect each idea with practical examples from everyday learning and real-world problem solving.\n\nThe explanations in this section are designed to build a strong foundation before moving to the next chapter.`,
          `Deep-Dive Discussion (Page 2 of 3)\n\nIn this section of ${book.title}, we examine ${title} through clear definitions, useful examples, and structured reasoning. Pay attention to the relationships between the concepts because they will help you understand the complete subject.\n\nUse the ideas here as a guide for revision, practice, and independent study.`,
          `Chapter Summary and Practice (Page 3 of 3)\n\nTo complete this chapter on ${title}, review the main terms, compare the important ideas, and write down questions that need further exploration.\n\nThe next chapter continues this learning journey with a connected topic from ${book.title}.`
        ]
      }))
    };
  }

  const additionalBooks = [
    createAdditionalBook({ id: 'sch-5', title: 'Complete Biology for School Students', author: 'Dr. Meera Kapoor', category: 'school', categoryName: 'School Education', pages: 340, year: 2025, badge: 'Biology Basics', cover: 'assets/covers/complete-biology.jpg', description: 'A clear introduction to cells, life processes, ecology, genetics, and human biology for school learners.' }, ['Cell Structure and Organization', 'Biomolecules and Enzymes', 'Plant Nutrition and Photosynthesis', 'Human Digestion and Respiration', 'Circulation and Excretion', 'Nervous System and Coordination', 'Reproduction and Development', 'Heredity and Evolution', 'Ecology and Food Chains', 'Health, Disease and Environment']),
    createAdditionalBook({ id: 'sch-6', title: 'Essential Physics: Motion, Energy & Waves', author: 'R. K. Iyer', category: 'school', categoryName: 'School Education', pages: 320, year: 2025, badge: 'Physics Foundation', cover: 'assets/covers/essential-physics.jpg', description: 'Build confidence in school physics with intuitive explanations of motion, force, energy, electricity, and waves.' }, ['Units, Measurements and Vectors', 'Motion in One and Two Dimensions', 'Force, Laws of Motion and Friction', 'Work, Energy and Power', 'Gravitation and Satellites', 'Properties of Matter and Fluids', 'Heat, Temperature and Thermodynamics', 'Sound and Mechanical Waves', 'Light, Reflection and Refraction', 'Electricity and Magnetism']),
    createAdditionalBook({ id: 'sch-7', title: 'Geography and Environmental Studies', author: 'Sonal Malhotra', category: 'school', categoryName: 'School Education', pages: 300, year: 2024, badge: 'Earth & Society', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', description: 'Explore maps, climate, natural resources, populations, and sustainable development through accessible lessons.' }, ['Maps, Globes and Geographic Skills', 'Earth Movements and Landforms', 'Atmosphere, Weather and Climate', 'Rivers, Oceans and Water Cycles', 'Soils, Forests and Biodiversity', 'Minerals, Energy and Resources', 'Agriculture and Food Systems', 'Industries, Transport and Trade', 'Population, Settlements and Migration', 'Sustainability and Climate Action']),
    createAdditionalBook({ id: 'hi-5', title: 'Research Methods for University Students', author: 'Dr. Kavita Nair', category: 'higher', categoryName: 'Higher Education', pages: 430, year: 2025, badge: 'Academic Research', cover: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&auto=format&fit=crop&q=80', description: 'Learn how to frame research questions, evaluate evidence, collect data, and present rigorous academic work.' }, ['Choosing a Research Problem', 'Literature Reviews and Scholarly Sources', 'Research Questions and Hypotheses', 'Qualitative Research Designs', 'Quantitative Research Designs', 'Sampling and Participant Selection', 'Surveys, Interviews and Experiments', 'Data Analysis and Interpretation', 'Academic Writing and Citations', 'Ethics, Presentations and Publication']),
    createAdditionalBook({ id: 'hi-6', title: 'Principles of Organic Chemistry', author: 'Prof. Arvind Menon', category: 'higher', categoryName: 'Higher Education', pages: 590, year: 2024, badge: 'Chemistry Core', cover: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80', description: 'A structured university-level guide to bonding, reactions, stereochemistry, synthesis, and spectroscopy.' }, ['Atomic Bonding and Molecular Structure', 'Functional Groups and Nomenclature', 'Stereochemistry and Isomerism', 'Reaction Mechanisms and Energy', 'Alkanes, Alkenes and Alkynes', 'Aromatic Compounds and Substitution', 'Carbonyl Chemistry and Carboxylic Acids', 'Amines, Amino Acids and Polymers', 'Spectroscopy and Structure Determination', 'Retrosynthesis and Modern Synthesis']),
    createAdditionalBook({ id: 'hi-7', title: 'Introduction to Psychology and Human Behavior', author: 'Dr. Neha Joshi', category: 'higher', categoryName: 'Higher Education', pages: 470, year: 2025, badge: 'Behavioral Science', cover: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&auto=format&fit=crop&q=80', description: 'Understand cognition, emotion, development, personality, social behavior, and mental health through modern psychology.' }, ['History and Scientific Foundations', 'Brain, Neurons and Consciousness', 'Sensation, Perception and Attention', 'Learning, Memory and Thinking', 'Language, Intelligence and Creativity', 'Development Across the Lifespan', 'Emotion, Motivation and Stress', 'Personality and Individual Differences', 'Social Psychology and Relationships', 'Mental Health and Therapeutic Approaches']),
    createAdditionalBook({ id: 'pop-5', title: 'Atomic Habits', author: 'James Clear', category: 'popular', categoryName: 'Popular Book', pages: 320, year: 2018, badge: 'Personal Growth Bestseller', cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80', description: 'Practical ideas for building better habits, breaking unhelpful routines, and improving a little every day.' }, ['The Surprising Power of Tiny Changes', 'How Habits Shape Identity', 'The Four Laws of Behavior Change', 'Make It Obvious', 'Make It Attractive', 'Make It Easy', 'Make It Satisfying', 'Advanced Habit Strategies', 'How to Stay Motivated', 'The Truth About Lasting Change']),
    createAdditionalBook({ id: 'pop-6', title: 'The Alchemist', author: 'Paulo Coelho', category: 'popular', categoryName: 'Popular Book', pages: 208, year: 1988, badge: 'Global Fiction Classic', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80', description: 'A timeless journey about dreams, courage, self-discovery, and listening to the call of one’s heart.' }, ['The Shepherd and the Dream', 'The Gypsy and the Great Pyramids', 'Meeting the King of Salem', 'The Journey Across the Desert', 'The Crystal Merchant', 'Learning the Language of the World', 'The Englishman and the Search', 'The Alchemist’s Lessons', 'The Soul of the World', 'Finding the Treasure Within']),
    createAdditionalBook({ id: 'pop-7', title: 'Ikigai: The Japanese Secret to a Long and Happy Life', author: 'Héctor García and Francesc Miralles', category: 'popular', categoryName: 'Popular Book', pages: 208, year: 2016, badge: 'Wellness Bestseller', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80', description: 'Discover thoughtful principles for purpose, wellbeing, community, and a more balanced daily life.' }, ['The Meaning of Ikigai', 'The Secrets of the Centenarians', 'Flow and Everyday Purpose', 'Food, Movement and Longevity', 'Gentle Exercise for Life', 'Resilience and Emotional Balance', 'Finding Purpose in Work', 'Community and Connection', 'Simple Rituals for Daily Life', 'Building Your Personal Ikigai']),
    createAdditionalBook({ id: 'it-5', title: 'Cybersecurity Fundamentals and Ethical Hacking', author: 'Vikram Sethi', category: 'it', categoryName: 'IT Book', pages: 520, year: 2025, badge: 'Security Essential', cover: 'assets/covers/cybersecurity-fundamentals.jpg', description: 'Understand networks, vulnerabilities, secure coding, threat modeling, and responsible security testing.' }, ['Security Mindset and Threat Models', 'Networking and Internet Protocols', 'Linux, Shells and System Hardening', 'Cryptography and Key Management', 'Web Application Security', 'Identity, Access and Authentication', 'Vulnerability Assessment and Testing', 'Security Monitoring and Incident Response', 'Cloud and Container Security', 'Ethics, Governance and Risk']),
    createAdditionalBook({ id: 'it-6', title: 'Data Structures and Algorithms in Practice', author: 'Arjun Rao', category: 'it', categoryName: 'IT Book', pages: 560, year: 2025, badge: 'Interview Preparation', cover: 'assets/covers/data-structures-algorithms.jpg', description: 'Master the core data structures, algorithms, complexity analysis, and problem-solving patterns used in software engineering.' }, ['Complexity Analysis and Problem Solving', 'Arrays, Strings and Hash Tables', 'Linked Lists, Stacks and Queues', 'Trees, Heaps and Priority Queues', 'Graphs and Traversal Algorithms', 'Sorting and Searching Techniques', 'Recursion and Backtracking', 'Greedy Algorithms and Dynamic Programming', 'Advanced Graph and String Problems', 'Designing Solutions for Interviews'])
  ];

  function createDetailedBook(category, categoryName, id, title, author, badge, cover, description) {
    return createAdditionalBook({
      id,
      title,
      author,
      category,
      categoryName,
      pages: 320,
      year: 2025,
      badge,
      cover,
      description
    }, [
      'Core Concepts and Foundations',
      'Key Terms and Important Ideas',
      'Methods, Models and Examples',
      'Practical Applications and Skills',
      'Analysis, Practice and Problem Solving',
      'Tools, Techniques and Case Studies',
      'Advanced Topics and New Perspectives',
      'Common Questions and Mistakes',
      'Revision Guide and Learning Activities',
      'Summary, Assessment and Further Reading'
    ]);
  }

  const categoryExpansion = [
    // School Books - Real Matching Covers including 8 user covers
    createDetailedBook('school', 'School Education', 'school-8', 'हिंदी भाषा और साहित्य (Hindi Literature)', 'Asha Tiwari', 'हिंदी साहित्य', 'assets/covers/hindi-literature.jpg', 'हिंदी भाषा, व्याकरण और आधुनिक एवं प्राचीन गद्य-पद्य साहित्य का संपूर्ण अध्ययन।'),
    createDetailedBook('school', 'School Education', 'school-9', 'Computer Basics for Students', 'Nitin Bansal', 'Computer Science', 'assets/covers/computer-basics.jpg', 'A complete guide to Computer Basics for Students, with clear lessons, examples, and practice.'),
    createDetailedBook('school', 'School Education', 'school-10', 'Social Science and Indian Heritage', 'Ritu Sharma', 'Indian Heritage', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80', 'Explore Indian civilizations, cultural history, geographical diversity, and democratic values.'),
    createDetailedBook('school', 'School Education', 'school-11', 'Practical Mathematics Workbook', 'Manoj Verma', 'Math Practice', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80', 'Step-by-step problem sets, algebra drills, geometry constructions, and practical calculations.'),
    createDetailedBook('school', 'School Education', 'school-12', 'English Communication Skills', 'Meena Joseph', 'Language Mastery', 'assets/covers/english-communication.jpg', 'A complete guide to improve your English communication skills, vocabulary, and active speaking.'),
    createDetailedBook('school', 'School Education', 'school-13', 'Basic Economics for Young Learners', 'S. K. Gupta', 'Young Economics', 'assets/covers/basic-economics.jpg', 'A complete guide to Basic Economics for Young Learners covering markets, money, savings, and trade.'),
    createDetailedBook('school', 'School Education', 'school-14', 'Art, Design and Creative Expression', 'Kavya Rao', 'Creative Arts', 'assets/covers/art-design-creative-expression.jpg', 'A complete guide to Art, Design and Creative Expression exploring color, perspective, drawing, and aesthetics.'),
    createDetailedBook('school', 'School Education', 'school-15', 'Health, Yoga and Physical Education', 'Pooja Nair', 'Yoga & Wellness', 'assets/covers/health-yoga.jpg', 'A guide to a healthy lifestyle through yoga, fitness, pranayama, and physical education.'),

    // Higher Education Books - Real Matching Covers
    createDetailedBook('higher', 'Higher Education', 'hi-8', 'Database Systems and Information Management', 'Prof. Sameer Kulkarni', 'Database Core', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80', 'Relational models, SQL query optimization, transaction management, indexing, and NoSQL architecture.'),
    createDetailedBook('higher', 'Higher Education', 'hi-9', 'Microbiology and Immunology', 'Dr. Isha Bhat', 'Medical Science', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80', 'Study of microorganisms, immune response pathways, pathogens, antibodies, and biotechnology.'),
    createDetailedBook('higher', 'Higher Education', 'hi-10', 'Linear Algebra and Discrete Mathematics', 'Dr. Rahul Sen', 'Higher Math', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80', 'Vector spaces, matrix decompositions, eigenvalues, graph theory, and combinatorics.'),
    createDetailedBook('higher', 'Higher Education', 'hi-11', 'Business Management and Strategy', 'Anita Desai', 'MBA Core', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80', 'Strategic planning, corporate governance, organizational psychology, and market leadership.'),
    createDetailedBook('higher', 'Higher Education', 'hi-12', 'Advanced Statistical Methods', 'Prof. Vikram Shah', 'Statistics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', 'Hypothesis testing, Bayesian inference, regression analysis, and multivariate data modeling.'),
    createDetailedBook('higher', 'Higher Education', 'hi-13', 'Environmental Engineering and Sustainability', 'Dr. Leena Roy', 'Green Tech', 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80', 'Water treatment, renewable energy systems, carbon footprint reduction, and environmental policies.'),
    createDetailedBook('higher', 'Higher Education', 'hi-14', 'Communication Theory and Media Studies', 'Prof. Nikhil Das', 'Media Theory', 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=600&auto=format&fit=crop&q=80', 'Media ethics, journalism, mass communications, digital storytelling, and audience analysis.'),
    createDetailedBook('higher', 'Higher Education', 'hi-15', 'Introduction to Legal Studies', 'Dr. Farah Khan', 'Law & Justice', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80', 'Constitutional jurisprudence, contracts, torts, human rights, and the legal dispute system.'),

    // Popular Books - Real Matching Covers
    createDetailedBook('popular', 'Popular Book', 'pop-8', 'The 7 Habits of Highly Effective People', 'Stephen R. Covey', 'Productivity Classic', 'assets/covers/the-7-habits.png', 'A holistic, integrated approach for solving personal and professional problems and achieving effectiveness.'),
    createDetailedBook('popular', 'Popular Book', 'pop-9', 'Rich Dad Poor Dad', 'Robert T. Kiyosaki', 'Personal Finance', 'assets/covers/rich-dad-poor-dad.png', 'What the rich teach their kids about money that the poor and middle class do not.'),
    createDetailedBook('popular', 'Popular Book', 'pop-10', 'Think and Grow Rich', 'Napoleon Hill', 'Wealth Mindset', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80', 'Landmark principles on self-confidence, goal-setting, subconscious desire, and personal achievement.'),
    createDetailedBook('popular', 'Popular Book', 'pop-11', 'The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'Self-Help Modern', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80', 'A counterintuitive approach to living a good life by embracing life’s struggles and choosing what matters.'),
    createDetailedBook('popular', 'Popular Book', 'pop-12', 'Pride and Prejudice', 'Jane Austen', 'Classic Literature', 'assets/covers/pride-and-prejudice.jpg', 'The iconic romantic masterwork following Elizabeth Bennet and Mr. Darcy through wit, class, and love.'),
    createDetailedBook('popular', 'Popular Book', 'pop-13', 'The Kite Runner', 'Khaled Hosseini', 'Bestselling Fiction', 'assets/covers/the-kite-runner.png', 'An unforgettable story of friendship, betrayal, redemption, and the power of love in Afghanistan.'),
    createDetailedBook('popular', 'Popular Book', 'pop-14', 'The Midnight Library', 'Matt Haig', 'Award-Winning Novel', 'https://images.unsplash.com/photo-1507842229452-7b99c750b3f5?w=600&auto=format&fit=crop&q=80', 'Between life and death there is a library where every book gives you a chance to try another life you could have lived.'),
    createDetailedBook('popular', 'Popular Book', 'pop-15', 'The Silent Patient', 'Alex Michaelides', 'Psychological Thriller', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80', 'A shocking psychological thriller of a woman’s act of violence against her husband—and of the therapist obsessed with uncovering her motive.'),

    // IT Books - Real Matching Covers
    createDetailedBook('it', 'IT Book', 'it-7', 'DevOps and Continuous Delivery', 'Rohan Mallick', 'DevOps & CI/CD', 'assets/covers/devops-continuous-delivery.jpg', 'Automated pipelines, Infrastructure as Code, Terraform, Docker packaging, and modern deployment strategies.'),
    createDetailedBook('it', 'IT Book', 'it-8', 'Mobile App Development with Flutter', 'Neel Joshi', 'Mobile Apps', 'assets/covers/mobile-app-flutter.jpg', 'Cross-platform mobile apps for iOS and Android using Flutter widgets, Dart language, and state management.'),
    createDetailedBook('it', 'IT Book', 'it-9', 'Computer Networks and Internet Protocols', 'Sanjay Pillai', 'Networking Core', 'assets/covers/computer-networks.jpg', 'TCP/IP stack, DNS, HTTP/3, routing algorithms, socket programming, and secure communication.'),
    createDetailedBook('it', 'IT Book', 'it-10', 'Machine Learning Engineering', 'Dr. Tara Bose', 'Applied ML', 'assets/covers/machine-learning-engineering.jpg', 'MLOps pipelines, feature stores, distributed model training, inference latency optimization, and monitoring.'),
    createDetailedBook('it', 'IT Book', 'it-11', 'UX Design and Human Computer Interaction', 'Ananya Kapoor', 'UI/UX Design', 'assets/covers/ux-design-hci.jpg', 'User research, wireframing, Figma design systems, usability testing, and emotional design psychology.'),
    createDetailedBook('it', 'IT Book', 'it-12', 'Software Architecture Patterns', 'Vivek Reddy', 'System Design', 'assets/covers/software-architecture-patterns.jpg', 'Clean architecture, event-driven systems, domain-driven design (DDD), CQRS, and high-scale backends.'),
    createDetailedBook('it', 'IT Book', 'it-13', 'Blockchain and Distributed Applications', 'Aditya Mehra', 'Web3 & Crypto', 'assets/covers/blockchain-distributed.jpg', 'Consensus mechanisms, smart contracts in Solidity, decentralized storage, and Web3 security protocols.'),
    createDetailedBook('it', 'IT Book', 'it-14', 'Natural Language Processing', 'Dr. Mira Thomas', 'NLP & LLMs', 'assets/covers/natural-language-processing.jpg', 'Tokenization, word embeddings, transformer models, semantic search, sentiment analysis, and conversational AI.'),
    createDetailedBook('it', 'IT Book', 'it-15', 'Site Reliability Engineering', 'Kunal Chatterjee', 'Cloud Reliability', 'assets/covers/site-reliability-engineering.jpg', 'SLIs, SLOs, error budgets, incident postmortems, canary releases, and distributed chaos testing.')
  ];

  const allBooks = [...BOOKS_DATA, ...additionalBooks, ...categoryExpansion];

  // DOM Elements
  const authScreen = document.getElementById('auth-screen');
  const mainApp = document.getElementById('main-app');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const quickDemoStudentBtn = document.getElementById('quick-demo-student-btn');
  const quickDemoItBtn = document.getElementById('quick-demo-it-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userDisplayName = document.getElementById('user-display-name');
  const userRoleLabel = document.getElementById('user-role-label');
  const userAvatarInitials = document.getElementById('user-avatar-initials');

  const prefCards = document.querySelectorAll('.pref-card');
  const btnShowAllBooks = document.getElementById('btn-show-all-books');
  const sectionHeading = document.getElementById('section-heading');
  const sectionSubheading = document.getElementById('section-subheading');
  const activeCategoryPill = document.getElementById('active-category-pill');
  const sortSelect = document.getElementById('sort-select');

  const globalSearchInput = document.getElementById('global-search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const booksGrid = document.getElementById('books-grid');
  const emptyState = document.getElementById('empty-state');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const openBookmarksBtn = document.getElementById('open-bookmarks-btn');
  const bookmarksBadge = document.getElementById('bookmarks-badge');
  const bookmarksModal = document.getElementById('bookmarks-modal');
  const closeBookmarksBtn = document.getElementById('close-bookmarks-btn');
  const bookmarksList = document.getElementById('bookmarks-list');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // --- THEME STATE & TOGGLE ---
  let currentTheme = localStorage.getItem('hamara_book_theme') || 'dark';

  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('hamara_book_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeToggleBtn) return;
    if (currentTheme === 'light') {
      themeToggleBtn.innerHTML = '<i data-lucide="moon" class="w-5 h-5 text-indigo-600"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeToggleBtn.innerHTML = '<i data-lucide="sun" class="w-5 h-5 text-amber-400"></i>';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
    refreshIcons();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // Reader Modal Elements
  const readerModal = document.getElementById('reader-modal');
  const closeReaderBtn = document.getElementById('close-reader-btn');
  const readerModalTitle = document.getElementById('reader-modal-title');
  const readerModalAuthor = document.getElementById('reader-modal-author');
  const readerChapterSelect = document.getElementById('reader-chapter-select');
  const readerChapterBadge = document.getElementById('reader-chapter-badge');
  const readerContentBody = document.getElementById('reader-content-body');
  const readerPageIndicator = document.getElementById('reader-page-indicator');
  const readerMetaIndicator = document.getElementById('reader-meta-indicator');
  const readerPrevChapter = document.getElementById('reader-prev-chapter');
  const readerNextChapter = document.getElementById('reader-next-chapter');
  const readerPrevPage = document.getElementById('reader-prev-page');
  const readerNextPage = document.getElementById('reader-next-page');
  const readerDownloadBtn = document.getElementById('reader-download-btn');
  const btnFontDec = document.getElementById('btn-font-dec');
  const btnFontInc = document.getElementById('btn-font-inc');

  // Subtitle descriptions for categories
  const categorySubtitles = {
    'school': 'Showing foundational textbooks, science, mathematics and core learning',
    'higher': 'Showing university engineering, research and advanced degree curricula',
    'popular': 'Showing global top-rated bestsellers, thriller, romance, finance & mindset',
    'it': 'Showing full-stack coding, AI & machine learning, cloud and DevOps masteries',
    'all': 'Showing all available titles across the HAMARA BOOK digital library'
  };

  const categoryTitles = {
    'school': 'School Education',
    'higher': 'Higher Education',
    'popular': 'Popular Book',
    'it': 'IT Book',
    'all': 'All Books'
  };

  // --- 1. AUTHENTICATION & LOGIN FLOW ---
  function checkAuthState() {
    if (currentUser) {
      authScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
      updateUserUI();
      renderBooks();
    } else {
      authScreen.classList.remove('hidden');
      mainApp.classList.add('hidden');
    }
    updateBookmarksBadge();
    refreshIcons();
  }

  function updateUserUI() {
    if (!currentUser) return;
    userDisplayName.textContent = currentUser.name;
    userRoleLabel.textContent = currentUser.role || 'Member';
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    userAvatarInitials.textContent = initials || 'HB';
  }

  function loginUser(name, email, role, defaultCategory) {
    currentUser = { name, email, role };
    localStorage.setItem('hamara_book_user', JSON.stringify(currentUser));
    if (defaultCategory) {
      setPreference(defaultCategory);
    }
    checkAuthState();
  }

  // Quick Demo Buttons
  quickDemoStudentBtn.addEventListener('click', () => {
    loginUser('Aarav Sharma', 'aarav.student@hamarabook.com', 'High School Scholar', 'school');
  });

  quickDemoItBtn.addEventListener('click', () => {
    loginUser('Rohan Verma', 'rohan.tech@hamarabook.com', 'Full-Stack Developer', 'it');
  });

  // Standard Login Form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const name = email.split('@')[0].replace('.', ' ').toUpperCase();
    loginUser(name || 'Library Reader', email, 'Library Member', 'school');
  });

  // Register Form
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value || 'New Scholar';
    const email = document.getElementById('reg-email').value || 'scholar@hamarabook.com';
    loginUser(name, email, 'Student Member', 'school');
  });

  // Switch between Login and Register tabs
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('text-emerald-400', 'border-b-2', 'border-emerald-400');
    tabLogin.classList.remove('text-slate-400');
    tabRegister.classList.remove('text-emerald-400', 'border-b-2', 'border-emerald-400');
    tabRegister.classList.add('text-slate-400');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('text-emerald-400', 'border-b-2', 'border-emerald-400');
    tabRegister.classList.remove('text-slate-400');
    tabLogin.classList.remove('text-emerald-400', 'border-b-2', 'border-emerald-400');
    tabLogin.classList.add('text-slate-400');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('hamara_book_user');
    currentUser = null;
    checkAuthState();
  });

  // --- 2. CATEGORY PREFERENCE HANDLING ---
  function setPreference(catId) {
    currentCategory = catId;
    
    // Update active highlight classes on preference cards
    prefCards.forEach(card => {
      if (card.dataset.categoryId === catId) {
        card.classList.add('active-preference');
      } else {
        card.classList.remove('active-preference');
      }
    });

    // Update section titles & pills
    activeCategoryPill.textContent = categoryTitles[catId] || 'All Books';
    sectionSubheading.textContent = categorySubtitles[catId] || 'Exploring titles';

    renderBooks();
    refreshIcons();
  }

  // Click on preference cards
  prefCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.categoryId;
      setPreference(cat);
    });
  });

  // "Show All Books" button
  btnShowAllBooks.addEventListener('click', () => {
    prefCards.forEach(card => card.classList.remove('active-preference'));
    currentCategory = 'all';
    activeCategoryPill.textContent = 'All Categories';
    sectionSubheading.textContent = categorySubtitles['all'];
    renderBooks();
    refreshIcons();
  });

  // Reset filters button in empty state
  resetFilterBtn.addEventListener('click', () => {
    searchQuery = '';
    globalSearchInput.value = '';
    mobileSearchInput.value = '';
    setPreference('school');
  });

  // --- 3. SEARCH & SORT ---
  function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    if (e.target === globalSearchInput) {
      mobileSearchInput.value = e.target.value;
    } else {
      globalSearchInput.value = e.target.value;
    }
    if (activeMainView === 'videos') {
      filterAndRenderVideos();
    } else {
      renderBooks();
    }
  }

  globalSearchInput.addEventListener('input', handleSearch);
  mobileSearchInput.addEventListener('input', handleSearch);

  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderBooks();
  });

  // --- 4. RENDER BOOKS CATALOG ---
  function renderBooks() {
    let filtered = allBooks.filter(book => {
      const matchesCategory = currentCategory === 'all' || book.category === currentCategory;
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery) ||
        book.author.toLowerCase().includes(searchQuery) ||
        book.categoryName.toLowerCase().includes(searchQuery) ||
        book.description.toLowerCase().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    // Sort books
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // featured: show the newest titles first when no explicit sort is selected
      filtered.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    }

    if (filtered.length === 0) {
      booksGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    booksGrid.innerHTML = filtered.map(book => {
      const isBookmarked = bookmarks.includes(book.id);
      return `
        <div class="book-card group relative flex flex-col rounded-2xl bg-[#0e1628] border border-slate-800/80 overflow-hidden hover:border-emerald-500/50">
          
          <!-- Book Cover Image with Badge -->
          <div class="relative aspect-[3/4] w-full overflow-hidden bg-slate-900 rounded-t-2xl">
            <img src="${book.cover}" alt="${book.title}" class="h-full w-full object-cover object-center group-hover:scale-105 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
            
            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-sm">
                ${book.badge || book.categoryName}
              </span>
            </div>

            <!-- Bookmark Button -->
            <button onclick="toggleBookmark('${book.id}')" class="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 border border-slate-700/60 backdrop-blur-md transition" title="Save book">
              <i data-lucide="${isBookmarked ? 'bookmark-check' : 'bookmark'}" class="w-4 h-4 ${isBookmarked ? 'text-emerald-400 fill-emerald-400/20' : ''}"></i>
            </button>
          </div>

          <!-- Card Content -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <!-- Title -->
              <h4 class="book-title text-base font-bold text-white leading-snug group-hover:text-emerald-400 transition line-clamp-2 mt-2">
                ${book.title}
              </h4>

              <!-- Author -->
              <p class="text-xs text-emerald-400/90 font-medium mt-1">
                By ${book.author}
              </p>

              <!-- Description -->
              <p class="book-desc text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                ${book.description}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="book-card-footer pt-3 border-t border-slate-800/80 flex items-center gap-2">
              <button onclick="openBookReader('${book.id}')" class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition flex items-center justify-center gap-1.5 active:scale-95">
                <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Read Online
              </button>
              
              <button onclick="downloadBookPDF('${book.id}')" class="book-card-download-btn p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 transition" title="Download Full Book PDF (10 Chapters)">
                <i data-lucide="download" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');

    refreshIcons();
  }

  // --- 5. BOOK READER MODAL (10 Chapters with 3-4 Pages each) ---
  window.openBookReader = function(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;
    activeBook = book;
    currentChapterIndex = 0;
    currentPageIndex = 0;

    readerModalTitle.textContent = book.title;
    readerModalAuthor.textContent = `By ${book.author} • Category: ${book.categoryName}`;
    
    // Populate the 10 chapters dropdown
    readerChapterSelect.innerHTML = book.chapters.map((ch, idx) => `
      <option value="${idx}">Chapter ${idx + 1}: ${ch.title.replace(/^Chapter \d+:\s*/, '')}</option>
    `).join('');

    updateReaderPage();
    readerModal.classList.remove('hidden');
    refreshIcons();
  };

  // Chapter dropdown change listener
  readerChapterSelect.addEventListener('change', (e) => {
    currentChapterIndex = parseInt(e.target.value, 10);
    currentPageIndex = 0;
    updateReaderPage();
  });

  // Direct download button in reader header
  readerDownloadBtn.addEventListener('click', () => {
    if (activeBook) {
      downloadBookPDF(activeBook.id);
    }
  });

  function updateReaderPage() {
    const chapter = activeBook.chapters[currentChapterIndex];
    const totalPages = chapter.pages.length;
    const isFirstPageOverall = currentChapterIndex === 0 && currentPageIndex === 0;
    const isLastPageOverall = currentChapterIndex === activeBook.chapters.length - 1 && currentPageIndex === totalPages - 1;

    if (currentPageIndex >= totalPages) currentPageIndex = totalPages - 1;
    if (currentPageIndex < 0) currentPageIndex = 0;

    const pageContent = chapter.pages[currentPageIndex];

    // Update UI Indicators
    readerChapterBadge.textContent = chapter.title;
    readerChapterSelect.value = currentChapterIndex;
    readerPageIndicator.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;
    readerMetaIndicator.textContent = `Chapter ${currentChapterIndex + 1} of ${activeBook.chapters.length}`;
    readerContentBody.style.fontSize = `${readerFontSize}px`;

    // Render Page Content
    const paragraphs = pageContent.split('\n\n').filter(p => p.trim());
    readerContentBody.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div class="border-b border-slate-800 pb-4">
          <div class="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <span>HAMARA BOOK • Official Reader</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Page ${currentPageIndex + 1} of ${totalPages}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">${chapter.title}</h2>
          <p class="text-xs text-slate-400 mt-1">Book: ${activeBook.title} — By ${activeBook.author}</p>
        </div>

        <div class="space-y-4 text-slate-200 leading-relaxed text-justify">
          ${paragraphs.map(para => `<p class="indent-6 leading-relaxed">${para}</p>`).join('')}
        </div>

        <div class="mt-8 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 shrink-0 text-emerald-400"></i>
            <span>Chapter ${currentChapterIndex + 1} (Page ${currentPageIndex + 1} of ${totalPages}) • Click Next to read further.</span>
          </div>
          ${!isLastPageOverall ? `
            <button onclick="goToNextPage()" class="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition hover:scale-[1.02] active:scale-95">
              <span>Next</span>
              <i data-lucide="arrow-right" class="w-4 h-4 stroke-[2.5]"></i>
            </button>
          ` : `
            <span class="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> Book Completed
            </span>
          `}
        </div>
      </div>
    `;

    // Button states
    readerPrevPage.disabled = isFirstPageOverall;
    readerPrevPage.classList.toggle('opacity-40', isFirstPageOverall);
    readerPrevPage.classList.toggle('cursor-not-allowed', isFirstPageOverall);

    readerNextPage.disabled = isLastPageOverall;
    readerNextPage.classList.toggle('opacity-40', isLastPageOverall);
    readerNextPage.classList.toggle('cursor-not-allowed', isLastPageOverall);

    readerPrevChapter.disabled = currentChapterIndex === 0;
    readerPrevChapter.classList.toggle('opacity-40', currentChapterIndex === 0);

    readerNextChapter.disabled = currentChapterIndex === activeBook.chapters.length - 1;
    readerNextChapter.classList.toggle('opacity-40', currentChapterIndex === activeBook.chapters.length - 1);

    refreshIcons();
  }

  // Global Page Navigation Helpers
  window.goToNextPage = function() {
    if (!activeBook) return;
    const chapter = activeBook.chapters[currentChapterIndex];
    if (currentPageIndex < chapter.pages.length - 1) {
      currentPageIndex++;
      updateReaderPage();
      readerContentBody.scrollTop = 0;
    } else if (currentChapterIndex < activeBook.chapters.length - 1) {
      // Advance to next chapter's first page
      currentChapterIndex++;
      currentPageIndex = 0;
      updateReaderPage();
      readerContentBody.scrollTop = 0;
    }
  };

  window.goToPrevPage = function() {
    if (!activeBook) return;
    if (currentPageIndex > 0) {
      currentPageIndex--;
      updateReaderPage();
      readerContentBody.scrollTop = 0;
    } else if (currentChapterIndex > 0) {
      currentChapterIndex--;
      const prevCh = activeBook.chapters[currentChapterIndex];
      currentPageIndex = prevCh.pages.length - 1;
      updateReaderPage();
      readerContentBody.scrollTop = 0;
    }
  };

  // Page flipping listeners
  readerPrevPage.addEventListener('click', window.goToPrevPage);
  readerNextPage.addEventListener('click', window.goToNextPage);

  // Chapter jump logic
  readerPrevChapter.addEventListener('click', () => {
    if (currentChapterIndex > 0) {
      currentChapterIndex--;
      currentPageIndex = 0;
      updateReaderPage();
    }
  });

  readerNextChapter.addEventListener('click', () => {
    if (activeBook && currentChapterIndex < activeBook.chapters.length - 1) {
      currentChapterIndex++;
      currentPageIndex = 0;
      updateReaderPage();
    }
  });

  // Font size adjustments
  btnFontInc.addEventListener('click', () => {
    if (readerFontSize < 24) {
      readerFontSize += 2;
      readerContentBody.style.fontSize = `${readerFontSize}px`;
    }
  });

  btnFontDec.addEventListener('click', () => {
    if (readerFontSize > 14) {
      readerFontSize -= 2;
      readerContentBody.style.fontSize = `${readerFontSize}px`;
    }
  });

  closeReaderBtn.addEventListener('click', () => {
    readerModal.classList.add('hidden');
  });

  // --- 6. REAL PDF BOOK DOWNLOAD IMPLEMENTATION ---
  window.downloadBookPDF = function(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    // Show download toast notification
    showDownloadToast(`Compiling full 10-chapter PDF for "${book.title}"...`);

    try {
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);

        // --- PAGE 1: COVER & TITLE PAGE ---
        // Header Banner Background
        doc.setFillColor(16, 185, 129); // Emerald Green
        doc.rect(0, 0, pageWidth, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('HAMARA BOOK', pageWidth / 2, 22, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Aapki Apni Digital Library - Official Edition', pageWidth / 2, 32, { align: 'center' });

        // Book Title & Metadata
        doc.setTextColor(15, 23, 42); // Dark slate
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        const titleLines = doc.splitTextToSize(book.title, maxWidth);
        doc.text(titleLines, pageWidth / 2, 75, { align: 'center' });

        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(5, 150, 105); // Green
        doc.text(`By ${book.author}`, pageWidth / 2, 95, { align: 'center' });

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.text(`Category: ${book.categoryName}  |  Year: ${book.year}`, pageWidth / 2, 110, { align: 'center' });

        // Overview Box
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, 125, maxWidth, 50, 4, 4, 'F');
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('SYNOPSIS & CURRICULUM OVERVIEW', margin + 8, 137);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(book.description, maxWidth - 16);
        doc.text(descLines, margin + 8, 146);

        // Verification Badge
        doc.setTextColor(16, 185, 129);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('✓ Complete 10 Chapters Edition with Full Pages Included', pageWidth / 2, 195, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'italic');
        doc.text('Downloaded via HAMARA BOOK Digital Library Platform', pageWidth / 2, 280, { align: 'center' });

        // --- PAGE 2: TABLE OF CONTENTS ---
        doc.addPage();
        doc.setFillColor(16, 185, 129);
        doc.rect(margin, 20, maxWidth, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('TABLE OF CONTENTS (ALL 10 CHAPTERS)', margin + 5, 27);

        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        let tocY = 42;
        book.chapters.forEach((ch, idx) => {
          doc.setFont('helvetica', 'bold');
          doc.text(`Chapter ${idx + 1}:`, margin, tocY);
          doc.setFont('helvetica', 'normal');
          const cleanTitle = ch.title.replace(/^Chapter \d+:\s*/, '');
          doc.text(cleanTitle, margin + 25, tocY);
          doc.text(`(${ch.pages.length} Pages)`, pageWidth - margin - 20, tocY);
          tocY += 14;
        });

        // --- PAGES 3+: CHAPTERS & PAGES ---
        book.chapters.forEach((ch, chIdx) => {
          doc.addPage();
          let currentY = margin + 10;

          // Chapter Header
          doc.setFillColor(240, 253, 244);
          doc.roundedRect(margin, currentY - 6, maxWidth, 18, 3, 3, 'F');
          doc.setTextColor(4, 120, 87);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(ch.title, margin + 5, currentY + 5);
          currentY += 26;

          // Pages content
          ch.pages.forEach((pageText, pIdx) => {
            if (currentY > pageHeight - 45) {
              doc.addPage();
              currentY = margin + 10;
            }

            doc.setTextColor(16, 185, 129);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`[Section Page ${pIdx + 1} of ${ch.pages.length}]`, margin, currentY);
            currentY += 7;

            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            const wrapped = doc.splitTextToSize(pageText, maxWidth);
            doc.text(wrapped, margin, currentY);
            currentY += (wrapped.length * 5) + 10;
          });

          // Page footer
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(`HAMARA BOOK • Chapter ${chIdx + 1} of 10 • ${book.title}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        });

        // Save PDF file to user browser
        const cleanName = book.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
        doc.save(`${cleanName}_HAMARA_BOOK.pdf`);
        showDownloadToast(`✓ "${book.title}" downloaded successfully!`);
      } else {
        // Fallback text download if jsPDF is not available
        fallbackDownloadText(book);
      }
    } catch (err) {
      console.error('PDF generation error, falling back to text file:', err);
      fallbackDownloadText(book);
    }
  };

  function fallbackDownloadText(book) {
    let content = `====================================================\n`;
    content += `HAMARA BOOK - DIGITAL LIBRARY OFFICIAL EDITION\n`;
    content += `Title: ${book.title}\n`;
    content += `Author: ${book.author}\n`;
    content += `Category: ${book.categoryName}\n`;
    content += `Total Chapters: ${book.chapters.length}\n`;
    content += `====================================================\n\n`;

    book.chapters.forEach((ch, idx) => {
      content += `\n----------------------------------------------------\n`;
      content += `${ch.title} (${ch.pages.length} Pages)\n`;
      content += `----------------------------------------------------\n\n`;
      ch.pages.forEach((page, pIdx) => {
        content += `[Page ${pIdx + 1} of ${ch.pages.length}]\n`;
        content += page + `\n\n`;
      });
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = book.title.replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `${cleanName}_HAMARA_BOOK.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showDownloadToast(`✓ "${book.title}" downloaded successfully!`);
  }

  function showDownloadToast(msg) {
    const existing = document.getElementById('hamara-download-toast');
    if (existing) existing.remove();

    const notice = document.createElement('div');
    notice.id = 'hamara-download-toast';
    notice.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-fade-in border border-emerald-400/30';
    notice.innerHTML = `<i data-lucide="file-check" class="w-4 h-4"></i> <span>${msg}</span>`;
    document.body.appendChild(notice);
    refreshIcons();
    setTimeout(() => {
      notice.remove();
    }, 4000);
  }

  // --- 7. BOOKMARK HANDLING ---
  window.toggleBookmark = function(bookId) {
    if (bookmarks.includes(bookId)) {
      bookmarks = bookmarks.filter(id => id !== bookId);
    } else {
      bookmarks.push(bookId);
    }
    localStorage.setItem('hamara_book_bookmarks', JSON.stringify(bookmarks));
    updateBookmarksBadge();
    renderBooks();
    renderBookmarksList();
  };

  function updateBookmarksBadge() {
    bookmarksBadge.textContent = bookmarks.length;
  }

  function renderBookmarksList() {
    const saved = allBooks.filter(b => bookmarks.includes(b.id));
    if (saved.length === 0) {
      bookmarksList.innerHTML = '<p class="text-xs text-slate-400 text-center py-6">No saved books yet. Click the bookmark icon on any book to add it here!</p>';
      return;
    }
    bookmarksList.innerHTML = saved.map(b => `
      <div class="bookmark-item flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 gap-3">
        <img src="${b.cover}" class="w-12 h-16 rounded-lg object-cover">
        <div class="flex-1 min-w-0">
          <p class="book-item-title text-sm font-bold text-white truncate">${b.title}</p>
          <p class="text-xs text-emerald-400 truncate">${b.author} • 10 Chapters</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openBookReader('${b.id}'); bookmarksModal.classList.add('hidden');" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
            Read
          </button>
          <button onclick="downloadBookPDF('${b.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Download PDF">
            <i data-lucide="download" class="w-4 h-4"></i>
          </button>
          <button onclick="toggleBookmark('${b.id}')" class="p-1.5 text-slate-400 hover:text-rose-400" title="Remove">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');
    refreshIcons();
  }

  openBookmarksBtn.addEventListener('click', () => {
    renderBookmarksList();
    bookmarksModal.classList.remove('hidden');
    refreshIcons();
  });

  closeBookmarksBtn.addEventListener('click', () => {
    bookmarksModal.classList.add('hidden');
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      readerModal.classList.add('hidden');
      bookmarksModal.classList.add('hidden');
      closeVideoPlayer();
    }
  });

  // ========================================================
  // 6. LEARN FROM VIDEO (VIDEO ACADEMY) MODULE
  // ========================================================

  let activeMainView = 'books'; // 'books' | 'videos'
  let currentVideoCategory = 'all';
  let videoSortBy = 'featured';

  // Navigation View Switcher Elements
  const navTabBooks = document.getElementById('nav-tab-books');
  const navTabVideos = document.getElementById('nav-tab-videos');
  const navTabBooksMobile = document.getElementById('nav-tab-books-mobile');
  const navTabVideosMobile = document.getElementById('nav-tab-videos-mobile');
  const booksLibraryView = document.getElementById('books-library-view');
  const videoLearningView = document.getElementById('video-learning-view');

  // Video Portal Elements
  const videosGrid = document.getElementById('videos-grid');
  const videoEmptyState = document.getElementById('video-empty-state');
  const videoCategoryFilterBtns = document.querySelectorAll('.video-filter-pill');
  const videoSortSelect = document.getElementById('video-sort-select');
  const videoCountBadge = document.getElementById('video-count-badge');
  const resetVideoFiltersBtn = document.getElementById('reset-video-filters-btn');
  const featuredVideoPlayBtn = document.getElementById('featured-video-play-btn');
  const switchBackToBooksBtn = document.getElementById('switch-back-to-books-btn');

  // Video Player Modal Elements
  const videoPlayerModal = document.getElementById('video-player-modal');
  const closeVideoModalBtn = document.getElementById('close-video-modal-btn');
  const videoModalIframe = document.getElementById('video-modal-iframe');
  const videoModalTitle = document.getElementById('video-modal-title');
  const videoModalBadge = document.getElementById('video-modal-badge');
  const videoModalDuration = document.getElementById('video-modal-duration');
  const videoModalChannel = document.getElementById('video-modal-channel');
  const videoModalCategoryText = document.getElementById('video-modal-category-text');
  const videoModalDescription = document.getElementById('video-modal-description');
  const videoModalTags = document.getElementById('video-modal-tags');
  const videoModalChaptersList = document.getElementById('video-modal-chapters-list');
  const videoCompanionBookCard = document.getElementById('video-companion-book-card');
  const videoCompanionBookCover = document.getElementById('video-companion-book-cover');
  const videoCompanionBookTitle = document.getElementById('video-companion-book-title');
  const videoCompanionBookAuthor = document.getElementById('video-companion-book-author');
  const videoOpenCompanionBookBtn = document.getElementById('video-open-companion-book-btn');
  const videoIframeFallback = document.getElementById('video-iframe-fallback');
  const videoModalDirectLink = document.getElementById('video-modal-direct-link');

  const VIDEOS_DATA = [
    {
      id: 'vid-1',
      title: 'Full Stack Web Development with MERN & Next.js: Zero to Hero',
      channel: 'FreeCodeCamp & Tech Academy',
      duration: '8h 24m',
      durationMinutes: 504,
      category: 'coding',
      categoryLabel: 'Coding & Full-Stack',
      badge: 'Featured Masterclass',
      youtubeId: 'nu_pCVPKzTk',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      description: 'A complete, industry-standard masterclass covering modern HTML5/CSS3, JavaScript ES6+, TypeScript, React 19, Next.js 14 App Router, Node.js, Express, and MongoDB with production deployment.',
      tags: ['React 19', 'Next.js', 'Node.js', 'MongoDB', 'Full-Stack', 'TypeScript'],
      companionBookId: 'it-1',
      chapters: [
        { time: '00:00:00', title: 'Course Overview & Roadmap' },
        { time: '00:25:30', title: 'Modern JavaScript & TypeScript Syntax' },
        { time: '01:45:10', title: 'React 19 Hooks, Props & State' },
        { time: '03:15:00', title: 'Next.js Server Components & Routing' },
        { time: '05:00:20', title: 'Node.js & Express REST API Architecture' },
        { time: '06:40:00', title: 'MongoDB Schemas, Aggregations & Auth' },
        { time: '07:50:15', title: 'Production CI/CD & Cloud Deployment' }
      ]
    },
    {
      id: 'vid-2',
      title: 'Artificial Intelligence & Generative Models: Complete Deep Dive',
      channel: '3Blue1Brown & Deep Learning Lab',
      duration: '3h 40m',
      durationMinutes: 220,
      category: 'ai',
      categoryLabel: 'AI & Python',
      badge: 'Trending in AI',
      youtubeId: 'aircAruvnKk',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
      description: 'Visually understand neural networks, backpropagation, transformer self-attention mechanisms, LLM autoregressive token decoding, fine-tuning with LoRA, and agentic workflows.',
      tags: ['Transformers', 'Neural Networks', 'LLMs', 'LoRA', 'Generative AI', 'Agents'],
      companionBookId: 'it-2',
      chapters: [
        { time: '00:00:00', title: 'What is a Neural Network?' },
        { time: '00:21:05', title: 'Gradient Descent & Backpropagation' },
        { time: '00:48:30', title: 'Attention Mechanism & Transformers' },
        { time: '01:30:15', title: 'How Large Language Models Work' },
        { time: '02:15:40', title: 'Fine-Tuning, LoRA & RLHF' },
        { time: '03:00:00', title: 'Building Autonomous Agentic Workflows' }
      ]
    },
    {
      id: 'vid-3',
      title: 'Cloud Native Architecture & Kubernetes in Production',
      channel: 'TechWorld with Nana',
      duration: '3h 35m',
      durationMinutes: 215,
      category: 'coding',
      categoryLabel: 'Coding & Full-Stack',
      badge: 'DevOps Standard',
      youtubeId: 'X48VuDVv0do',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      description: 'Hands-on practical guide to Docker containers, Kubernetes Pods, Deployments, Services, Ingress controllers, StatefulSets, Helm package management, and microservice resiliency.',
      tags: ['Kubernetes', 'Docker', 'DevOps', 'Microservices', 'Cloud', 'Helm'],
      companionBookId: 'it-3',
      chapters: [
        { time: '00:00:00', title: 'Container Basics & Docker Architecture' },
        { time: '00:35:10', title: 'Kubernetes Architecture & Components' },
        { time: '01:10:45', title: 'Pods, Deployments & ReplicaSets' },
        { time: '01:55:00', title: 'Services, Networking & Ingress Controllers' },
        { time: '02:40:20', title: 'ConfigMaps, Secrets & Storage Volumes' },
        { time: '03:10:00', title: 'Deploying Production Microservices' }
      ]
    },
    {
      id: 'vid-4',
      title: 'Python for Beginners to Advanced Data Science & Machine Learning',
      channel: 'Programming with Mosh & FreeCodeCamp',
      duration: '6h 15m',
      durationMinutes: 375,
      category: 'ai',
      categoryLabel: 'AI & Python',
      badge: 'Highly Recommended',
      youtubeId: 'rfscVS0vtbw',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
      description: 'Master Python programming from syntax fundamentals, object-oriented design, data wrangling with Pandas and NumPy, data visualization, and training Scikit-Learn models.',
      tags: ['Python 3', 'Data Science', 'Pandas', 'NumPy', 'Scikit-Learn', 'OOP'],
      companionBookId: 'it-4',
      chapters: [
        { time: '00:00:00', title: 'Python Setup & Core Syntax' },
        { time: '00:50:20', title: 'Data Structures: Lists, Dicts, Sets' },
        { time: '01:45:00', title: 'Object-Oriented Programming (OOP)' },
        { time: '02:40:15', title: 'NumPy Arrays & Vectorized Calculations' },
        { time: '03:55:00', title: 'Pandas DataFrames & Data Cleaning' },
        { time: '05:10:30', title: 'Machine Learning with Scikit-Learn' }
      ]
    },
    {
      id: 'vid-5',
      title: 'Data Structures and Algorithms (DSA) Masterclass with LeetCode',
      channel: 'Abdul Bari & CS Dojo',
      duration: '5h 18m',
      durationMinutes: 318,
      category: 'coding',
      categoryLabel: 'Coding & Full-Stack',
      badge: 'Interview Prep Essential',
      youtubeId: '8hly31xKli0',
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc119ffc059?w=800&auto=format&fit=crop&q=80',
      description: 'Master time & space complexity Big-O, arrays, linked lists, stacks, binary search trees, graph BFS/DFS traversals, and dynamic programming for technical software engineering interviews.',
      tags: ['Algorithms', 'Data Structures', 'LeetCode', 'Big-O', 'Trees', 'Graphs'],
      companionBookId: 'it-6',
      chapters: [
        { time: '00:00:00', title: 'Time & Space Complexity (Big-O)' },
        { time: '00:40:15', title: 'Arrays, Strings & Two-Pointer Patterns' },
        { time: '01:35:00', title: 'Linked Lists, Stacks & Queues' },
        { time: '02:30:20', title: 'Binary Trees & Binary Search Trees' },
        { time: '03:40:00', title: 'Graph Traversals (BFS & DFS)' },
        { time: '04:35:10', title: 'Dynamic Programming & Memoization' }
      ]
    },
    {
      id: 'vid-6',
      title: 'Cybersecurity Fundamentals & Ethical Hacking Bootcamp',
      channel: 'NetworkChuck & HackerSploit',
      duration: '4h 15m',
      durationMinutes: 255,
      category: 'coding',
      categoryLabel: 'Coding & Full-Stack',
      badge: 'Security Essential',
      youtubeId: '3Kq1MIfTWCE',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      description: 'Discover computer network protocols, Linux command line security, threat modeling, web vulnerabilities (SQL injection, XSS, CSRF), Wireshark analysis, and defensive cybersecurity hygiene.',
      tags: ['Cybersecurity', 'Ethical Hacking', 'Linux', 'Networking', 'Wireshark', 'Web Security'],
      companionBookId: 'it-5',
      chapters: [
        { time: '00:00:00', title: 'Introduction to Security & Threat Landscapes' },
        { time: '00:38:00', title: 'Networking Fundamentals & IP/Port Scanning' },
        { time: '01:25:10', title: 'Linux Terminal & Kali Tools Overview' },
        { time: '02:15:30', title: 'Web App Security: SQL Injection & XSS' },
        { time: '03:10:00', title: 'Cryptography, Hashes & Public Keys' },
        { time: '03:50:00', title: 'Incident Response & Defensive Hardening' }
      ]
    },
    {
      id: 'vid-7',
      title: 'Essential Physics: Motion, Energy, Gravity & Waves',
      channel: 'Professor Dave Explains & Khan Academy',
      duration: '2h 50m',
      durationMinutes: 170,
      category: 'school',
      categoryLabel: 'School & Science',
      badge: 'School Foundation',
      youtubeId: 'bHIhgxav9LY',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
      description: 'Clear, intuitive video animations breaking down Newton’s three laws of motion, kinetic & potential energy conservation, momentum, gravitation, wave mechanics, and electricity fundamentals.',
      tags: ['Physics', 'Mechanics', 'Newton Laws', 'Energy', 'Waves', 'School Science'],
      companionBookId: 'sch-6',
      chapters: [
        { time: '00:00:00', title: 'Vectors, Units & Dimensional Analysis' },
        { time: '00:25:15', title: 'Kinematics: Velocity & Acceleration' },
        { time: '00:55:00', title: 'Newton’s 3 Laws of Motion & Friction' },
        { time: '01:30:20', title: 'Work, Kinetic Energy & Power' },
        { time: '02:05:00', title: 'Universal Gravitation & Orbital Motion' },
        { time: '02:30:10', title: 'Wave Properties & Sound Acoustics' }
      ]
    },
    {
      id: 'vid-8',
      title: 'Complete Biology: Cells, DNA, Photosynthesis & Human Systems',
      channel: 'CrashCourse Biology & Amoeba Sisters',
      duration: '2h 15m',
      durationMinutes: 135,
      category: 'school',
      categoryLabel: 'School & Science',
      badge: 'Core Curriculum',
      youtubeId: '8IlzKri08kk',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
      description: 'Engaging, beautifully illustrated lessons spanning prokaryotic vs eukaryotic cells, cell respiration, mitosis & meiosis, DNA replication, Mendelian genetics, and human physiology.',
      tags: ['Biology', 'Cellular Biology', 'DNA', 'Genetics', 'Evolution', 'Life Sciences'],
      companionBookId: 'sch-4',
      chapters: [
        { time: '00:00:00', title: 'Cell Structure, Organelles & Membranes' },
        { time: '00:22:45', title: 'Cellular Respiration & ATP Energy' },
        { time: '00:46:10', title: 'Photosynthesis & Light Reactions' },
        { time: '01:10:00', title: 'Mitosis vs Meiosis & Cell Division' },
        { time: '01:35:20', title: 'DNA Replication & Protein Synthesis' },
        { time: '01:55:40', title: 'Genetics, Punnett Squares & Heredity' }
      ]
    },
    {
      id: 'vid-9',
      title: 'The Psychology of Money: Timeless Wealth & Greed Lessons',
      channel: 'The Swedish Investor & Ali Abdaal',
      duration: '1h 12m',
      durationMinutes: 72,
      category: 'finance',
      categoryLabel: 'Mindset & Wealth',
      badge: 'Global Bestseller Lesson',
      youtubeId: 'T2aXQoU9g4g',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
      description: 'Animated breakdown of Morgan Housel’s masterwork. Discover why wealth is what you don’t see, how compounding really works, the value of financial freedom, and keeping ego in check.',
      tags: ['Personal Finance', 'Investing', 'Compounding', 'Psychology of Money', 'Wealth', 'Mindset'],
      companionBookId: 'pop-3',
      chapters: [
        { time: '00:00:00', title: 'No One is Crazy: Behavioral Economics' },
        { time: '00:12:30', title: 'Luck and Risk in Financial Success' },
        { time: '00:24:15', title: 'Never Enough: Preventing Lifestyle Creep' },
        { time: '00:36:00', title: 'The Power of Uninterrupted Compounding' },
        { time: '00:48:20', title: 'Freedom: True Wealth vs Material Status' },
        { time: '01:02:10', title: 'Reasonable vs Rational Money Management' }
      ]
    },
    {
      id: 'vid-10',
      title: 'Rich Dad Poor Dad: Core Financial Principles & Cash Flow',
      channel: 'Wisdom for Life & Robert Kiyosaki',
      duration: '58m',
      durationMinutes: 58,
      category: 'finance',
      categoryLabel: 'Mindset & Wealth',
      badge: 'Classic Finance',
      youtubeId: 'p4j4wPqB4oY',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      description: 'Clear video explanation of assets vs liabilities, the Cashflow Quadrant, financial literacy, tax strategies, and why financial education is the single most valuable investment for life.',
      tags: ['Rich Dad Poor Dad', 'Cash Flow', 'Assets vs Liabilities', 'Financial Freedom', 'Investing'],
      companionBookId: 'pop-9',
      chapters: [
        { time: '00:00:00', title: 'Lesson 1: The Rich Don’t Work for Money' },
        { time: '00:11:20', title: 'Lesson 2: Why Teach Financial Literacy?' },
        { time: '00:23:45', title: 'Lesson 3: Mind Your Own Business & Assets' },
        { time: '00:35:10', title: 'Lesson 4: Taxes and the Power of Corporations' },
        { time: '00:46:00', title: 'Lesson 5: The Rich Invent Money' }
      ]
    },
    {
      id: 'vid-11',
      title: 'Mobile App Development with Flutter & Dart: Complete Crash Course',
      channel: 'FreeCodeCamp & Flutter Community',
      duration: '7h 10m',
      durationMinutes: 430,
      category: 'coding',
      categoryLabel: 'Coding & Full-Stack',
      badge: 'Cross-Platform Pro',
      youtubeId: 'VPvVD8t02U8',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      description: 'Build native iOS and Android apps with a single codebase using Flutter 3 and Dart. Covers widget trees, responsive layouts, Riverpod/Bloc state management, REST APIs, and Firebase.',
      tags: ['Flutter 3', 'Dart', 'Mobile Apps', 'iOS', 'Android', 'Riverpod'],
      companionBookId: 'it-8',
      chapters: [
        { time: '00:00:00', title: 'Dart Language Essentials' },
        { time: '01:15:30', title: 'Flutter Widget Tree & Layouts' },
        { time: '02:40:00', title: 'Stateful vs Stateless Widgets' },
        { time: '04:10:15', title: 'Navigation & Routing Patterns' },
        { time: '05:25:00', title: 'REST API Integration & JSON Serialization' },
        { time: '06:30:00', title: 'Publishing to App Store & Google Play' }
      ]
    },
    {
      id: 'vid-12',
      title: 'The 7 Habits of Highly Effective People: Masterclass & Practice',
      channel: 'FightMediocrity & Productivity Hub',
      duration: '48m',
      durationMinutes: 48,
      category: 'finance',
      categoryLabel: 'Mindset & Wealth',
      badge: 'Productivity Classic',
      youtubeId: 'ktlTxC4QG8g',
      thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80',
      description: 'In-depth animated study of Stephen Covey’s timeless effectiveness principles: proactivity, beginning with the end in mind, prioritizing first things, thinking win-win, and sharpening the saw.',
      tags: ['7 Habits', 'Productivity', 'Leadership', 'Stephen Covey', 'Effectiveness', 'Mindset'],
      companionBookId: 'pop-8',
      chapters: [
        { time: '00:00:00', title: 'Paradigms & Principles of Effectiveness' },
        { time: '00:07:30', title: 'Habit 1: Be Proactive' },
        { time: '00:15:10', title: 'Habit 2: Begin with the End in Mind' },
        { time: '00:22:45', title: 'Habit 3: Put First Things First' },
        { time: '00:30:20', title: 'Habits 4, 5, 6: Public Victory & Synergy' },
        { time: '00:40:00', title: 'Habit 7: Sharpen the Saw & Daily Renewal' }
      ]
    }
  ];

  function switchMainView(targetView) {
    activeMainView = targetView;
    if (targetView === 'videos') {
      if (booksLibraryView) booksLibraryView.classList.add('hidden');
      if (videoLearningView) videoLearningView.classList.remove('hidden');

      if (navTabBooks) navTabBooks.classList.remove('active');
      if (navTabVideos) navTabVideos.classList.add('active', 'video-active');
      if (navTabBooksMobile) navTabBooksMobile.classList.remove('active');
      if (navTabVideosMobile) navTabVideosMobile.classList.add('active', 'video-active');

      if (globalSearchInput) {
        globalSearchInput.placeholder = 'Search video courses, topics, instructors...';
      }
      if (mobileSearchInput) {
        mobileSearchInput.placeholder = 'Search video courses, topics...';
      }

      filterAndRenderVideos();
    } else {
      if (videoLearningView) videoLearningView.classList.add('hidden');
      if (booksLibraryView) booksLibraryView.classList.remove('hidden');

      if (navTabVideos) navTabVideos.classList.remove('active', 'video-active');
      if (navTabBooks) navTabBooks.classList.add('active');
      if (navTabVideosMobile) navTabVideosMobile.classList.remove('active', 'video-active');
      if (navTabBooksMobile) navTabBooksMobile.classList.add('active');

      if (globalSearchInput) {
        globalSearchInput.placeholder = 'Search by book title, author, topic (e.g. Python, Math, Habits)...';
      }
      if (mobileSearchInput) {
        mobileSearchInput.placeholder = 'Search books, authors...';
      }

      renderBooks();
    }
    refreshIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function filterAndRenderVideos() {
    if (!videosGrid) return;

    let filtered = VIDEOS_DATA.filter(video => {
      const matchesCategory = currentVideoCategory === 'all' || video.category === currentVideoCategory;
      const matchesSearch = !searchQuery ||
        video.title.toLowerCase().includes(searchQuery) ||
        video.channel.toLowerCase().includes(searchQuery) ||
        video.description.toLowerCase().includes(searchQuery) ||
        video.tags.some(t => t.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (videoSortBy === 'duration-desc') {
      filtered.sort((a, b) => b.durationMinutes - a.durationMinutes);
    } else if (videoSortBy === 'duration-asc') {
      filtered.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (videoSortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (videoCountBadge) {
      videoCountBadge.textContent = `${filtered.length} Video${filtered.length === 1 ? '' : 's'} Available`;
    }

    if (filtered.length === 0) {
      videosGrid.innerHTML = '';
      if (videoEmptyState) videoEmptyState.classList.remove('hidden');
    } else {
      if (videoEmptyState) videoEmptyState.classList.add('hidden');
      renderVideos(filtered);
    }
  }

  function renderVideos(videosToRender) {
    videosGrid.innerHTML = videosToRender.map(video => {
      const companionBook = allBooks.find(b => b.id === video.companionBookId);
      const categoryColor = video.category === 'coding' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
        : video.category === 'ai' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10'
        : video.category === 'school' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
        : 'text-amber-400 border-amber-500/30 bg-amber-500/10';

      return `
        <div class="video-card group rounded-2xl bg-[#0e1628] border border-slate-800 shadow-xl overflow-hidden flex flex-col cursor-pointer" onclick="openVideoPlayer('${video.id}')">
          <!-- Thumbnail Container -->
          <div class="relative w-full aspect-video overflow-hidden bg-slate-900">
            <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Duration Badge -->
            <div class="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center gap-1 shadow">
              <i data-lucide="clock" class="w-3 h-3 text-rose-400"></i>
              <span>${video.duration}</span>
            </div>

            <!-- Category Badge -->
            <div class="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${categoryColor}">
              ${video.categoryLabel}
            </div>

            <!-- Play Overlay Button -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="play-btn-overlay w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-950/80 backdrop-blur-sm">
                <i data-lucide="play" class="w-5 h-5 fill-white ml-0.5"></i>
              </div>
            </div>
          </div>

          <!-- Video Info Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <i data-lucide="youtube" class="w-3.5 h-3.5"></i>
                  ${video.channel}
                </span>
                <span class="text-slate-600">•</span>
                <span class="text-[11px] text-slate-400">${video.badge}</span>
              </div>
              <h4 class="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-rose-300 transition-colors">
                ${video.title}
              </h4>
              <p class="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                ${video.description}
              </p>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${video.tags.slice(0, 3).map(tag => `
                <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">${tag}</span>
              `).join('')}
              ${video.tags.length > 3 ? `<span class="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400">+${video.tags.length - 3}</span>` : ''}
            </div>

            <!-- Footer: Companion Book link & Watch CTA -->
            <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 video-meta-bar">
              ${companionBook ? `
                <div class="flex items-center gap-1.5 min-w-0" title="Companion Book: ${companionBook.title}">
                  <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
                  <span class="text-[11px] text-slate-300 truncate">${companionBook.title}</span>
                </div>
              ` : `<span></span>`}

              <button class="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-xs border border-rose-500/30 transition flex items-center gap-1 shrink-0">
                <span>Watch</span>
                <i data-lucide="arrow-right" class="w-3 h-3"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    refreshIcons();
  }

  function openVideoPlayer(videoId) {
    const video = VIDEOS_DATA.find(v => v.id === videoId);
    if (!video || !videoPlayerModal) return;

    videoModalTitle.textContent = video.title;
    videoModalBadge.textContent = video.badge;
    videoModalDuration.textContent = video.duration;
    videoModalChannel.textContent = video.channel;
    videoModalCategoryText.textContent = video.categoryLabel;
    videoModalDescription.textContent = video.description;

    // Tags
    videoModalTags.innerHTML = video.tags.map(tag => `
      <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-rose-300 border border-rose-500/20">${tag}</span>
    `).join('');

    // Chapters
    videoModalChaptersList.innerHTML = video.chapters.map(ch => `
      <div class="video-chapter-pill flex items-center justify-between p-2.5 rounded-xl bg-[#0c1324] border border-slate-800/80 text-xs transition cursor-pointer hover:border-rose-500/40">
        <span class="text-slate-200 font-medium truncate mr-2">${ch.title}</span>
        <span class="text-rose-400 font-mono font-semibold shrink-0">${ch.time}</span>
      </div>
    `).join('');

    // Companion Book
    const companionBook = allBooks.find(b => b.id === video.companionBookId);
    if (companionBook && videoCompanionBookCard) {
      videoCompanionBookCard.classList.remove('hidden');
      videoCompanionBookCover.src = companionBook.cover;
      videoCompanionBookCover.alt = companionBook.title;
      videoCompanionBookTitle.textContent = companionBook.title;
      videoCompanionBookAuthor.textContent = `${companionBook.author} • ${companionBook.categoryName}`;

      videoOpenCompanionBookBtn.onclick = () => {
        closeVideoPlayer();
        openBookReader(companionBook.id);
      };
    } else if (videoCompanionBookCard) {
      videoCompanionBookCard.classList.add('hidden');
    }

    // Set YouTube iframe src with autoplay
    videoModalIframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    videoModalDirectLink.href = `https://www.youtube.com/watch?v=${video.youtubeId}`;

    videoPlayerModal.classList.remove('hidden');
    refreshIcons();
  }

  function closeVideoPlayer() {
    if (!videoPlayerModal) return;
    videoPlayerModal.classList.add('hidden');
    if (videoModalIframe) {
      videoModalIframe.src = ''; // Stop video playback
    }
  }

  window.openVideoPlayer = openVideoPlayer;
  window.closeVideoPlayer = closeVideoPlayer;
  window.switchMainView = switchMainView;

  // View Switcher Button Listeners
  if (navTabBooks) navTabBooks.addEventListener('click', () => switchMainView('books'));
  if (navTabVideos) navTabVideos.addEventListener('click', () => switchMainView('videos'));
  if (navTabBooksMobile) navTabBooksMobile.addEventListener('click', () => switchMainView('books'));
  if (navTabVideosMobile) navTabVideosMobile.addEventListener('click', () => switchMainView('videos'));

  if (featuredVideoPlayBtn) {
    featuredVideoPlayBtn.addEventListener('click', () => {
      openVideoPlayer('vid-1');
    });
  }

  if (switchBackToBooksBtn) {
    switchBackToBooksBtn.addEventListener('click', () => {
      switchMainView('books');
    });
  }

  // Video Category Filter Pills
  videoCategoryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      videoCategoryFilterBtns.forEach(b => b.classList.remove('active-video-pill'));
      btn.classList.add('active-video-pill');
      currentVideoCategory = btn.dataset.videoCategory;
      filterAndRenderVideos();
    });
  });

  // Video Sort Select
  if (videoSortSelect) {
    videoSortSelect.addEventListener('change', (e) => {
      videoSortBy = e.target.value;
      filterAndRenderVideos();
    });
  }

  // Reset Video Filters
  if (resetVideoFiltersBtn) {
    resetVideoFiltersBtn.addEventListener('click', () => {
      currentVideoCategory = 'all';
      searchQuery = '';
      if (globalSearchInput) globalSearchInput.value = '';
      if (mobileSearchInput) mobileSearchInput.value = '';
      videoCategoryFilterBtns.forEach(b => {
        if (b.dataset.videoCategory === 'all') b.classList.add('active-video-pill');
        else b.classList.remove('active-video-pill');
      });
      filterAndRenderVideos();
    });
  }

  // Video Modal Close button & Outside click
  if (closeVideoModalBtn) {
    closeVideoModalBtn.addEventListener('click', closeVideoPlayer);
  }

  if (videoPlayerModal) {
    videoPlayerModal.addEventListener('click', (e) => {
      if (e.target === videoPlayerModal) {
        closeVideoPlayer();
      }
    });
  }

  // Icon re-initialization helper
  function refreshIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Initial boot
  applyTheme(currentTheme);
  checkAuthState();
});
