import { StudyPlan } from '../types';

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-cs-foundation',
    title: 'CS & IT College Foundations (Year 1-2)',
    tagline: 'Master C++, Java, Logic Formulation, and Core Computer Science Fundamentals',
    level: 'Beginner',
    durationWeeks: 8,
    description: 'Designed specifically for IT, CS, and Computer Engineering students to excel in college programming courses, understand memory and pointers, and build solid algorithmic instincts.',
    recommendedLanguages: ['cpp', 'java', 'python'],
    items: [
      {
        id: 'cs-1',
        title: '01. Variables, Control Flow & Logic Formulation',
        description: 'Conditional branching, nested loops, truth tables, and edge case thinking.',
        estimatedHours: 6,
        topics: ['Conditionals', 'Loops', 'Logic', 'Functions'],
        challengeIds: ['ch-2']
      },
      {
        id: 'cs-2',
        title: '02. Arrays, Memory & Pointers Deep Dive',
        description: 'Contiguous memory, stack vs heap allocation, pointer arithmetic, and reference passing.',
        estimatedHours: 8,
        topics: ['Pointers', 'Dynamic Memory', 'Arrays'],
        challengeIds: ['ch-1']
      },
      {
        id: 'cs-3',
        title: '03. Object-Oriented Programming (OOP) Pillars',
        description: 'Encapsulation, Inheritance, Polymorphism, Abstraction, and clean class modularity.',
        estimatedHours: 10,
        topics: ['Classes', 'Inheritance', 'Interfaces', 'Polymorphism'],
        challengeIds: ['ch-4'],
        isMilestone: true
      },
      {
        id: 'cs-4',
        title: '04. Classical Data Structures: Stacks, Queues & Lists',
        description: 'Implementing LIFO and FIFO primitives from scratch, node references, and runtime bounds.',
        estimatedHours: 12,
        topics: ['Stack', 'Queue', 'Singly Linked List'],
        challengeIds: ['ch-4']
      },
      {
        id: 'cs-5',
        title: '05. Recursion & Algorithmic Complexity (Big-O)',
        description: 'Base cases, recursive trees, call stacks, and formal time/space complexity analysis.',
        estimatedHours: 8,
        topics: ['Recursion', 'Call Stack', 'Big-O Notation'],
        challengeIds: ['ch-3', 'ch-5'],
        isMilestone: true
      }
    ]
  },
  {
    id: 'plan-fullstack-dev',
    title: 'Web Dev & PHP Full-Stack (HTML, CSS, JS & PHP)',
    tagline: 'Semantic HTML5, CSS Flexbox/Grid, JavaScript DOM, PHP 8.2 & SQL',
    level: 'Beginner',
    durationWeeks: 10,
    description: 'Ang standard web curriculum para sa IT & Computer Science students: mag-simula sa HTML at CSS layout, interactive JavaScript, hanggang sa dynamic PHP backend at relational databases.',
    recommendedLanguages: ['html', 'css', 'javascript', 'php', 'sql'],
    items: [
      {
        id: 'fs-0',
        title: '01. Semantic HTML5 & Responsive CSS3 Flexbox',
        description: 'Semantic tags (article, figure, nav), box model, responsive media queries, at modern Flexbox/Grid layouts.',
        estimatedHours: 8,
        topics: ['HTML5', 'CSS Flexbox', 'Grid', 'Responsive Design'],
        challengeIds: ['ch-web-card'],
        isMilestone: true
      },
      {
        id: 'fs-1',
        title: '02. Modern JavaScript ES6+ & DOM Events',
        description: 'DOM selection, event listeners, array methods (map, filter, reduce), promises, at async/await fetch API.',
        estimatedHours: 10,
        topics: ['JavaScript', 'DOM Events', 'ES6 Methods', 'Fetch API'],
        challengeIds: ['ch-web-dom']
      },
      {
        id: 'fs-2',
        title: '03. PHP 8.2 Backend Fundamentals & Forms',
        description: 'PHP variables, arrays, associative arrays, form processing ($_POST/$_GET), sanitization, at session management.',
        estimatedHours: 12,
        topics: ['PHP 8.2', 'Superglobals', 'Form Sanitization', 'Sessions'],
        challengeIds: ['ch-php-gpa'],
        isMilestone: true
      },
      {
        id: 'fs-3',
        title: '04. Relational Databases & MySQL Integration',
        description: 'Database design, PDO connection sa PHP, Prepared Statements para iwas SQL injection, at CRUD operations.',
        estimatedHours: 10,
        topics: ['MySQL', 'PDO', 'Prepared Statements', 'CRUD'],
        challengeIds: ['ch-1']
      },
      {
        id: 'fs-4',
        title: '05. Git & GitHub Version Control Workflow',
        description: 'Branching strategies, staging, commits, merge conflicts, pull requests, at pag-deploy ng school projects.',
        estimatedHours: 6,
        topics: ['Git Init', 'Remote Add', 'Push/Pull', 'Deploy'],
        challengeIds: [],
        isMilestone: true
      }
    ]
  },
  {
    id: 'plan-interview-dsa',
    title: 'DSA & Technical Interview Masterclass',
    tagline: 'Ace Technical Interviews at Top Tech Companies & Software Studios',
    level: 'Advanced',
    durationWeeks: 6,
    description: 'Curated 75 core patterns covering Two Pointers, Binary Search, Trees, Graphs, Dynamic Programming, and System Design concepts.',
    recommendedLanguages: ['python', 'cpp', 'java', 'go'],
    items: [
      {
        id: 'dsa-1',
        title: '01. Two Pointers & Sliding Window Mastery',
        description: 'Master in-place array manipulation, sub-array window expansion, and boundary contraction.',
        estimatedHours: 8,
        topics: ['Two Pointers', 'Sliding Window', 'In-place Algorithms'],
        challengeIds: ['ch-1', 'ch-2']
      },
      {
        id: 'dsa-2',
        title: '02. Logarithmic Search & Divide and Conquer',
        description: 'Binary search variations: search in rotated array, boundary checks, and peak finding.',
        estimatedHours: 7,
        topics: ['Binary Search', 'Logarithmic Time', 'Divide & Conquer'],
        challengeIds: ['ch-3']
      },
      {
        id: 'dsa-3',
        title: '03. Stacks, Monotonic Stacks & Queues',
        description: 'Parentheses validation, next greater element, sliding window maximums.',
        estimatedHours: 9,
        topics: ['Stack', 'Monotonic Stack', 'Deque'],
        challengeIds: ['ch-4'],
        isMilestone: true
      },
      {
        id: 'dsa-4',
        title: '04. Trees, Traversals & BST Manipulations',
        description: 'DFS (Pre/In/Postorder), BFS Level-order, tree heights, BST validation, and tree inversion.',
        estimatedHours: 12,
        topics: ['Binary Tree', 'BST', 'DFS', 'BFS'],
        challengeIds: ['ch-5'],
        isMilestone: true
      },
      {
        id: 'dsa-5',
        title: '05. Sorting, Interval Merging & Greedy Strategies',
        description: 'Custom comparator sorting, non-overlapping interval consolidation, and greedy choices.',
        estimatedHours: 10,
        topics: ['Intervals', 'Greedy', 'Custom Sort'],
        challengeIds: ['ch-6']
      }
    ]
  }
];
