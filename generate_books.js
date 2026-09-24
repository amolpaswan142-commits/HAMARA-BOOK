// Script to generate complete books-data.js with 10 chapters and 3-4 pages per chapter
const fs = require('fs');

const bookMeta = [
  // --- POPULAR BOOKS (User requested exact 4 books & local covers) ---
  {
    id: 'pop-1',
    title: 'I Fell in Love with Hope',
    author: 'Lancali',
    category: 'popular',
    categoryName: 'Popular Book',
    pages: 380,
    year: 2022,
    badge: '#1 TikTok & Global Sensation',
    cover: 'assets/covers/i-fell-in-love-with-hope.png',
    description: 'A breathtaking story of a group of terminally ill patients in a hospital who choose to live fiercely, embracing hope, rebellion, and deep unconditional love.',
    chapterTitles: [
      'The Sterile Sanctuary',
      'Whispers in Room 402',
      'The Pact of Rebellion',
      'Stealing Sunlight from the Courtyard',
      'Vows Written on Paper Cranes',
      'The Uncharted Night Escapes',
      'When Silence Speaks Louder',
      'Echoes of Shattered Porcelain',
      'The Weight of a Final Breath',
      'Immortal Horizons of Hope'
    ]
  },
  {
    id: 'pop-2',
    title: 'Good Girl, Bad Blood',
    author: 'Holly Jackson',
    category: 'popular',
    categoryName: 'Popular Book',
    pages: 416,
    year: 2020,
    badge: 'NYT Bestselling Mystery',
    cover: 'assets/covers/good-girl-bad-blood.png',
    description: 'Pip Fitz-Amobi is determined to leave detective work behind after her true-crime podcast goes viral, until an urgent disappearance forces her back into the dark underbelly of Little Kilton.',
    chapterTitles: [
      'The Memorial and the Microphone',
      'When Jamie Disappeared',
      'The 72-Hour Police Refusal',
      'Digital Footprints on Brunswick',
      'The Catfish Persona Layla',
      'Interrogating the Old Mill',
      'Unmasked Audio Waveforms',
      'Shadows in Blackwood Forest',
      'The Ticking Countdown',
      'Bloodlines and Retribution'
    ]
  },
  {
    id: 'pop-3',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'popular',
    categoryName: 'Popular Book',
    pages: 256,
    year: 2020,
    badge: 'International Bestseller',
    cover: 'assets/covers/the-psychology-of-money.png',
    description: 'Timeless lessons on wealth, greed, and happiness exploring how people make financial choices driven by emotions, ego, and personal history rather than pure mathematics.',
    chapterTitles: [
      'No One is Crazy',
      'Luck and Risk: Twin Arbiters',
      'Never Enough: When Wealth Crosses Ego',
      'Confounding Compounding Over Decades',
      'Getting Wealthy vs. Staying Wealthy',
      'Tails You Win: Asymmetric Returns',
      'Freedom: The True Dividend of Money',
      'Man in the Car Paradox',
      'Wealth is What You Do Not See',
      'The Seduction of Pessimism'
    ]
  },
  {
    id: 'pop-4',
    title: 'The Love Hypothesis',
    author: 'Ali Hazelwood',
    category: 'popular',
    categoryName: 'Popular Book',
    pages: 384,
    year: 2021,
    badge: 'New York Times Bestseller',
    cover: 'assets/covers/the-love-hypothesis.png',
    description: "A STEMinist rom-com about Ph.D. candidate Olive Smith who panics and kisses the first man she sees—who turns out to be Dr. Adam Carlsen, the department's most dreaded professor.",
    chapterTitles: [
      'The Hallway Emergency Protocol',
      'Terms of the Fake Hypothesis',
      'Wednesday Coffee at Starbucks',
      'Biochem Benchtop Friction',
      'The Biology Department Mixer',
      'Conference Flight to Boston',
      'Controlled Variables and Heat Exchangers',
      'The Presentation and the Saboteur',
      'Peer Review of the Heart',
      'The Accepted Manuscript'
    ]
  },

  // --- IT BOOKS ---
  {
    id: 'it-1',
    title: 'Full-Stack Web Development with MERN & Next.js',
    author: 'Alex Rivers',
    category: 'it',
    categoryName: 'IT Book',
    pages: 480,
    year: 2024,
    badge: 'Trending in Tech',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'Master modern full-stack web applications from front-end React & Next.js to Node.js backend architectures and cloud deployment.',
    chapterTitles: [
      'Modern JavaScript & TypeScript Rigor',
      'React Architecture & Virtual DOM Internals',
      'Next.js App Router & Server Components',
      'RESTful & GraphQL API Design with Node',
      'Database Modeling: PostgreSQL vs MongoDB',
      'Authentication, JWT, OAuth & Session Security',
      'State Management: Redux Toolkit & Zustand',
      'Automated Testing with Jest, Cypress & Playwright',
      'Containerization with Docker & Multi-Stage Builds',
      'Production Deployment, CI/CD & Vercel Scaling'
    ]
  },
  {
    id: 'it-2',
    title: 'Artificial Intelligence & Generative Models Handbook',
    author: 'Dr. Elena Rostova',
    category: 'it',
    categoryName: 'IT Book',
    pages: 560,
    year: 2025,
    badge: 'AI Bestseller',
    cover: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive guide to transformers, neural attention mechanisms, LLM architectures, fine-tuning, and practical agentic workflows.',
    chapterTitles: [
      'Linear Algebra & Calculus for Neural Networks',
      'From Perceptrons to Deep Convolutional Networks',
      'The Transformer: Self-Attention & Multi-Head Encoders',
      'Decoder-Only Architectures & Autoregressive Pretraining',
      'RLHF, DPO & Preference Optimization Protocols',
      'Parameter-Efficient Fine-Tuning (LoRA & QLoRA)',
      'Vector Databases, Embeddings & RAG Architectures',
      'Agentic Systems, Tool Calling & Multi-Step Reasoning',
      'Model Evaluation, Benchmarking & Safety Guardrails',
      'Serving LLMs at Scale with vLLM & Quantization'
    ]
  },
  {
    id: 'it-3',
    title: 'Cloud Native Architecture & Kubernetes in Production',
    author: 'Karan Mehta',
    category: 'it',
    categoryName: 'IT Book',
    pages: 420,
    year: 2024,
    badge: 'DevOps Essential',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Design resilient microservices, configure container orchestration, and establish automated CI/CD pipelines across AWS, Azure, and GCP.',
    chapterTitles: [
      'Microservice Decomposition & Twelve-Factor Methodology',
      'Container Anatomy: Namespaces, cgroups & Runtimes',
      'Kubernetes Core: Pods, ReplicaSets & Deployments',
      'Networking: Services, Ingress & Service Mesh (Istio)',
      'Stateful Workloads, PVCs & Storage Classes',
      'Configuration Management: ConfigMaps, Secrets & Vault',
      'GitOps Workflows with ArgoCD & Flux',
      'Observability: Prometheus, Grafana & OpenTelemetry',
      'Cloud Security, IAM & Zero-Trust Infrastructure',
      'Disaster Recovery, Chaos Engineering & High Availability'
    ]
  },
  {
    id: 'it-4',
    title: 'Python for Data Science, Algorithms & Machine Learning',
    author: 'Priya Sundaram',
    category: 'it',
    categoryName: 'IT Book',
    pages: 510,
    year: 2024,
    badge: 'Most Popular Tech',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'The complete guide to Python data analysis with NumPy, Pandas, Scikit-Learn, data structures, and algorithmic interview preparation.',
    chapterTitles: [
      'Advanced Python Idioms, Generators & Memory Models',
      'Asymptotic Complexity (Big-O) & Master Theorem',
      'Arrays, Linked Lists, Stacks & Queue Optimizations',
      'Binary Trees, AVL Trees & Graph Traversals (DFS/BFS)',
      'Dynamic Programming & Greedy Algorithm Paradigms',
      'High-Performance Vectorization with NumPy C-Arrays',
      'Data Cleansing & Transformation Pipelines in Pandas',
      'Exploratory Data Analysis with Seaborn & Matplotlib',
      'Supervised Learning: Regressors, Classifiers & Ensembles',
      'Clustering, Dimensionality Reduction & PCA'
    ]
  },

  // --- SCHOOL EDUCATION ---
  {
    id: 'sch-1',
    title: 'Foundations of Mathematics & Geometry (Grades 9-12)',
    author: 'NCERT Editorial Board & Prof. R. Sharma',
    category: 'school',
    categoryName: 'School Education',
    pages: 360,
    year: 2024,
    badge: 'Curriculum Standard',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    description: 'Comprehensive fundamentals covering algebra, trigonometry, coordinate geometry, quadratic formulas, and step-by-step problem sets.',
    chapterTitles: [
      'Real Numbers, Euclid Algorithm & Divisibility',
      'Polynomials: Roots, Remainder & Factor Theorems',
      'Linear Equations in Two Variables & Graphical Systems',
      'Quadratic Equations & Discriminant Properties',
      'Arithmetic Progressions & Geometric Sequences',
      'Triangles, Congruence & Similarity Criteria',
      'Coordinate Geometry: Distance, Section & Area Formulas',
      'Trigonometric Ratios & Fundamental Identities',
      'Circles, Tangents & Secant Properties',
      'Surface Areas, Volumes & Statistics Foundations'
    ]
  },
  {
    id: 'sch-2',
    title: 'General Science: Physics, Chemistry & Biology Basics',
    author: 'Dr. Ananya Verma',
    category: 'school',
    categoryName: 'School Education',
    pages: 410,
    year: 2024,
    badge: 'Core Science',
    cover: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    description: 'Clear diagrams and intuitive explanations of mechanics, electricity, chemical reactions, periodic tables, cell biology, and genetics.',
    chapterTitles: [
      'Chemical Reactions, Types & Balancing Equations',
      'Acids, Bases, Salts & Universal pH Indicators',
      'Metals, Non-Metals & Electrolytic Refining',
      'Carbon Compounds, Covalent Bonds & Functional Groups',
      'Periodic Classification of Elements & Modern Trends',
      'Life Processes: Nutrition, Respiration & Transport',
      'Control and Coordination: Nervous & Endocrine Systems',
      'Reproduction in Organisms & Hereditary Principles',
      'Optics: Reflection, Refraction & Spherical Lenses',
      'Electricity, Ohm\'s Law & Magnetic Field Effects'
    ]
  },
  {
    id: 'sch-3',
    title: 'Modern World History & Civics Foundations',
    author: 'K. S. Narayanan',
    category: 'school',
    categoryName: 'School Education',
    pages: 290,
    year: 2023,
    badge: 'Social Studies',
    cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    description: 'The democratic journey, freedom movements, world wars, constitutional rights, and fundamental duties for secondary students.',
    chapterTitles: [
      'The French Revolution & Democratic Awakening',
      'Industrial Revolution & Global Economic Shifts',
      'Nationalism in Europe & The Unification Movements',
      'Anti-Colonial Struggles & The Indian Independence Era',
      'World War I: Causes, Treaties & League of Nations',
      'The Interwar Crisis, Rise of Fascism & Depression',
      'World War II: Axis vs Allies and The Nuclear Dawn',
      'Birth of the United Nations & Human Rights Charter',
      'The Indian Constitution: Preamble, Rights & Directive Principles',
      'Democratic Institutions, Federalism & Civic Duties'
    ]
  },
  {
    id: 'sch-4',
    title: 'Mastering English Grammar, Writing & Comprehension',
    author: 'Patricia Vance & S. Das',
    category: 'school',
    categoryName: 'School Education',
    pages: 270,
    year: 2024,
    badge: 'Language Skills',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    description: 'Essential grammar rules, sentence structure, essay writing, comprehension skills, and vocabulary builder for high school students.',
    chapterTitles: [
      'Parts of Speech & Grammatical Syntax Framework',
      'Tenses: Present, Past, Future & Aspectual Nuances',
      'Active and Passive Voice Transformation Protocols',
      'Direct and Indirect Reported Speech Rules',
      'Clauses: Independent, Subordinate & Relative Structures',
      'Punctuation, Capitalization & Stylistic Rhythm',
      'Vocabulary Expansion: Roots, Prefixes & Suffixes',
      'Unseen Reading Comprehension Strategies',
      'Formal Letter Writing, Email & Report Drafting',
      'Persuasive Essay Writing & Rhetorical Devices'
    ]
  },

  // --- HIGHER EDUCATION ---
  {
    id: 'hi-1',
    title: 'Advanced Engineering Mathematics & Multivariable Calculus',
    author: 'Prof. Erwin Kreyszig & Dr. V. Rao',
    category: 'higher',
    categoryName: 'Higher Education',
    pages: 720,
    year: 2024,
    badge: 'University Standard',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    description: 'Rigorous coverage of partial differential equations, Fourier analysis, linear algebra, complex numbers, and vector calculus.',
    chapterTitles: [
      'Ordinary Differential Equations of First & Second Order',
      'Linear Systems, Matrix Eigenvalues & Diagonalization',
      'Vector Differential Calculus: Grad, Div and Curl Operators',
      'Vector Integral Theorems: Green, Gauss & Stokes Laws',
      'Fourier Series, Orthogonal Sets & Harmonic Analysis',
      'Partial Differential Equations: Heat, Wave & Laplace',
      'Complex Analytic Functions & Cauchy-Riemann Equations',
      'Complex Contour Integration & Residue Calculus',
      'Numerical Methods for Linear Systems & Interpolation',
      'Probability Distributions, Markov Chains & Optimization'
    ]
  },
  {
    id: 'hi-2',
    title: 'Operating Systems: Principles & Internal Architecture',
    author: 'Abraham Silberschatz & P. Galvin',
    category: 'higher',
    categoryName: 'Higher Education',
    pages: 650,
    year: 2023,
    badge: 'Computer Science Core',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'Process synchronization, deadlock prevention, virtual memory management, file systems, and kernel security models.',
    chapterTitles: [
      'Operating System Structures & Kernel System Calls',
      'Process Concepts, Context Switches & IPC Mechanisms',
      'CPU Scheduling Algorithms & Real-Time Scheduling',
      'Thread Models, Concurrency & Critical Section Problem',
      'Deadlocks: Modeling, Prevention, Avoidance & Bankers Alg',
      'Memory Management, Paging & Segmentation Architectures',
      'Virtual Memory, Demand Paging & Page Replacement Rules',
      'Mass-Storage Structure, RAID & Disk Scheduling',
      'File-System Interface, Inodes & Directory Implementation',
      'Protection, Hardware Virtualization & Kernel Security'
    ]
  },
  {
    id: 'hi-3',
    title: 'Principles of Macroeconomics & Financial Markets',
    author: 'N. Gregory Mankiw',
    category: 'higher',
    categoryName: 'Higher Education',
    pages: 540,
    year: 2023,
    badge: 'Economics Classic',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    description: 'Analysis of national income, inflation, fiscal & monetary policies, central banking, exchange rates, and economic growth models.',
    chapterTitles: [
      'Ten Principles of Economics & Foundational Thinking',
      'Measuring National Income: Real vs Nominal GDP',
      'Measuring the Cost of Living & Consumer Price Index',
      'Production, Capital Accumulation & Economic Growth',
      'Savings, Investment and the Financial Architecture',
      'Unemployment Dynamics & Structural Wage Rigidity',
      'The Monetary System, Money Supply & Central Banking',
      'Money Growth and Inflation: The Classical Dichotomy',
      'Open-Economy Macroeconomics: Exchange Rates & Capital Flows',
      'Aggregate Demand, Aggregate Supply & Stabilization Policy'
    ]
  },
  {
    id: 'hi-4',
    title: 'Quantum Physics & Modern Mechanics for Graduates',
    author: 'Dr. David J. Griffiths',
    category: 'higher',
    categoryName: 'Higher Education',
    pages: 480,
    year: 2024,
    badge: 'Advanced Physics',
    cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    description: 'Wave functions, the Schrödinger equation, quantum tunneling, angular momentum, and introductory perturbation theory.',
    chapterTitles: [
      'The Wave Function, Born Rule & Statistical Interpretation',
      'Time-Independent Schrödinger Equation & Infinite Square Well',
      'The Quantum Harmonic Oscillator: Ladder Operator Formalism',
      'Delta-Function Potential & Finite Square Well Bound States',
      'Hilbert Space Formalism, Observables & Eigenvalue Problems',
      'Quantum Mechanics in Three Dimensions & Hydrogen Atom',
      'Angular Momentum, Commutation Relations & Spin Operators',
      'Identical Particles, Pauli Exclusion & Multi-Electron Atoms',
      'Time-Independent Perturbation Theory & Fine Structure',
      'Variational Principle, WKB Approximation & Quantum Tunneling'
    ]
  }
];

function generatePages(book, chIdx, chTitle) {
  const pagesCount = 3 + (chIdx % 2); // alternating 3 and 4 pages per chapter
  const pages = [];
  
  for (let p = 1; p <= pagesCount; p++) {
    let pContent = '';
    if (p === 1) {
      pContent = `Welcome to Chapter ${chIdx + 1}: ${chTitle} (Page 1 of ${pagesCount})\n\nIn this opening section of "${book.title}", author ${book.author} introduces the fundamental narrative and conceptual context shaping this phase of the work. Readers examine the essential premises that establish why these specific themes and breakthroughs remain vital in modern study and practice.\n\nEvery dimension explored throughout this chapter illustrates how foundational principles translate into real-world insights, empowering students, scholars, and avid readers with structured analytical depth and immersive perspective.`;
    } else if (p === 2) {
      pContent = `Core Analysis and Deep-Dive Discussion (Page 2 of ${pagesCount})\n\nContinuing our thorough exploration of "${chTitle}", ${book.author} presents critical evidence, compelling case histories, and detailed analytical observations. A key observation emphasized throughout this section is how subtle initial conditions and behavioral patterns lead to significant cumulative outcomes.\n\nWhether dissecting narrative tension, mathematical equations, or human psychology, the master skill lies in recognizing structural patterns behind visible complexity. Reflect upon how these core concepts integrate into broader contexts and challenge standard assumptions.`;
    } else if (p === 3) {
      pContent = `Critical Synthesis and Applied Frameworks (Page 3 of ${pagesCount})\n\nAt this juncture of Chapter ${chIdx + 1}, the text bridges analytical deduction with pragmatic interpretation. ${book.title} highlights common misconceptions and provides clear, step-by-step diagnostic workflows to navigate complex questions.\n\nBy cross-referencing documented findings with benchmark metrics, readers develop sharp discernment. Notice how the arguments presented here synthesize earlier chapters while building a clear intellectual bridge toward the discoveries ahead.`;
    } else {
      pContent = `Comprehensive Review & Practical Exercises (Page 4 of ${pagesCount})\n\nTo solidify your understanding of Chapter ${chIdx + 1}: "${chTitle}", consider these essential review questions:\n\n1. What primary assumptions underpin the core deductions presented by ${book.author}?\n2. In what practical scenarios do these principles encounter edge cases or operational constraints?\n3. How do these insights align with the overarching narrative and mission of "${book.title}"?\n\nKeep these reflections in mind as you transition into the next chapter of this official edition provided by HAMARA BOOK.`;
    }
    pages.push(pContent);
  }
  return pages;
}

const books = bookMeta.map(b => {
  const chapters = b.chapterTitles.map((title, idx) => ({
    chapterNumber: idx + 1,
    title: `Chapter ${idx + 1}: ${title}`,
    pages: generatePages(b, idx, title)
  }));

  return {
    id: b.id,
    title: b.title,
    author: b.author,
    category: b.category,
    categoryName: b.categoryName,
    pages: b.pages,
    year: b.year,
    badge: b.badge,
    cover: b.cover,
    description: b.description,
    chapters: chapters
  };
});

const output = `// HAMARA BOOK - Curated Catalog with 10 Chapters & 3-4 Pages per Chapter
const BOOKS_DATA = ${JSON.stringify(books, null, 2)};

const PREFERENCE_CATEGORIES = [
  {
    id: 'school',
    title: 'School Education',
    subtitle: 'Foundations & Basics',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
    description: 'CBSE/NCERT, Science, Math & foundational learning'
  },
  {
    id: 'higher',
    title: 'Higher Education',
    subtitle: 'University & Advanced',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    description: 'Engineering, Degree programs, Higher Mathematics & Research'
  },
  {
    id: 'popular',
    title: 'Popular Book',
    subtitle: 'Trending & Popular',
    image: 'assets/covers/good-girl-bad-blood.png',
    description: 'World bestsellers, thriller, romance, finance & mindset'
  },
  {
    id: 'it',
    title: 'IT Book',
    subtitle: 'Full-Stack, AI & Cloud',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
    description: 'Coding, Full-Stack development, Artificial Intelligence & DevOps'
  }
];
`;

fs.writeFileSync('books-data.js', output, 'utf-8');
console.log('SUCCESS: books-data.js has been generated with 16 base books, 10 chapters each, and 3-4 pages per chapter!');
