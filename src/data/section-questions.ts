// Hardcoded questions for all 5 sections
export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  timeLimit: number;
  points: number;
  category: 'warmup' | 'general' | 'quickfire';
}

export interface SectionData {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  questions: Question[];
}

export const sectionData: Record<number, SectionData> = {
  1: {
    id: 1,
    title: "HTML Fundamentals",
    description: "Master the structure and semantics of HTML5",
    difficulty: "beginner",
    duration: 25,
    questions: [
      {
        id: "html-1",
        question: "What does HTML stand for?",
        type: "multiple-choice",
        options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperText Machine Language"],
        correctAnswer: 0,
        explanation: "HTML stands for HyperText Markup Language, the standard language for creating web pages.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "html-2",
        question: "HTML is a programming language",
        type: "true-false",
        correctAnswer: "false",
        explanation: "HTML is a markup language, not a programming language. It defines structure and content.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "html-3",
        question: "Which HTML tag is used for the largest heading?",
        type: "multiple-choice",
        options: ["<h1>", "<h6>", "<header>", "<heading>"],
        correctAnswer: 0,
        explanation: "The <h1> tag represents the largest heading in HTML.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "html-4",
        question: "What is the correct HTML tag for creating a hyperlink?",
        type: "multiple-choice",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1,
        explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "html-5",
        question: "The <br> tag requires a closing tag",
        type: "true-false",
        correctAnswer: "false",
        explanation: "The <br> tag is a self-closing tag and does not require a closing tag.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "html-6",
        question: "Which attribute specifies the destination of a link?",
        type: "multiple-choice",
        options: ["src", "href", "link", "url"],
        correctAnswer: 1,
        explanation: "The href attribute specifies the URL or destination of a hyperlink.",
        timeLimit: 60,
        points: 1,
        category: "quickfire"
      },
      {
        id: "html-7",
        question: "HTML5 introduced semantic elements",
        type: "true-false",
        correctAnswer: "true",
        explanation: "HTML5 introduced many semantic elements like <article>, <section>, <nav>, etc.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      },
      {
        id: "html-8",
        question: "Which HTML element is used for the main content?",
        type: "multiple-choice",
        options: ["<content>", "<main>", "<primary>", "<body>"],
        correctAnswer: 1,
        explanation: "The <main> element represents the main content area of a document.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      }
    ]
  },
  
  2: {
    id: 2,
    title: "CSS Styling & Layout",
    description: "Learn modern CSS techniques and responsive design",
    difficulty: "beginner",
    duration: 30,
    questions: [
      {
        id: "css-1",
        question: "What does CSS stand for?",
        type: "multiple-choice",
        options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 0,
        explanation: "CSS stands for Cascading Style Sheets, used for styling HTML documents.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "css-2",
        question: "CSS can only change colors of elements",
        type: "true-false",
        correctAnswer: "false",
        explanation: "CSS can control layout, spacing, fonts, animations, and much more beyond just colors.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "css-3",
        question: "Which CSS property is used to change the text color?",
        type: "multiple-choice",
        options: ["text-color", "color", "font-color", "text-style"],
        correctAnswer: 1,
        explanation: "The color property sets the color of text in CSS.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "css-4",
        question: "What is the correct syntax for a CSS comment?",
        type: "multiple-choice",
        options: ["// comment", "<!-- comment -->", "/* comment */", "# comment"],
        correctAnswer: 2,
        explanation: "CSS comments use /* comment */ syntax.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "css-5",
        question: "Which CSS property controls the space between elements?",
        type: "multiple-choice",
        options: ["spacing", "margin", "gap", "padding"],
        correctAnswer: 1,
        explanation: "The margin property controls the space outside elements.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "css-6",
        question: "Flexbox is a CSS layout method",
        type: "true-false",
        correctAnswer: "true",
        explanation: "Flexbox is a powerful CSS layout method for creating flexible and responsive layouts.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      },
      {
        id: "css-7",
        question: "Which CSS property is used to make text bold?",
        type: "multiple-choice",
        options: ["text-weight", "font-weight", "bold", "text-bold"],
        correctAnswer: 1,
        explanation: "The font-weight property is used to make text bold in CSS.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      },
      {
        id: "css-8",
        question: "CSS Grid is used for 2D layouts",
        type: "true-false",
        correctAnswer: "true",
        explanation: "CSS Grid is designed for creating 2D layouts with rows and columns.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  3: {
    id: 3,
    title: "JavaScript Essentials",
    description: "Core JavaScript concepts and ES6+ features",
    difficulty: "intermediate",
    duration: 35,
    questions: [
      {
        id: "js-1",
        question: "JavaScript is a compiled language",
        type: "true-false",
        correctAnswer: "false",
        explanation: "JavaScript is an interpreted language, not compiled.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "js-2",
        question: "Which of these is the correct way to declare a variable in ES6?",
        type: "multiple-choice",
        options: ["var name", "let name", "const name", "Both let and const"],
        correctAnswer: 3,
        explanation: "ES6 introduced both let and const for variable declaration, replacing var.",
        timeLimit: 45,
        points: 1,
        category: "warmup"
      },
      {
        id: "js-3",
        question: "What does '===' compare in JavaScript?",
        type: "multiple-choice",
        options: ["Value only", "Type only", "Value and type", "Neither"],
        correctAnswer: 2,
        explanation: "The === operator compares both value and type (strict equality).",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "js-4",
        question: "Arrow functions were introduced in ES6",
        type: "true-false",
        correctAnswer: "true",
        explanation: "Arrow functions (=>) were introduced in ES6 as a shorter syntax for functions.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "js-5",
        question: "Which method is used to add an element to the end of an array?",
        type: "multiple-choice",
        options: ["append()", "push()", "add()", "insert()"],
        correctAnswer: 1,
        explanation: "The push() method adds an element to the end of an array.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "js-6",
        question: "JavaScript is case-sensitive",
        type: "true-false",
        correctAnswer: "true",
        explanation: "JavaScript is case-sensitive, so 'Variable' and 'variable' are different.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      },
      {
        id: "js-7",
        question: "Which of these is used for asynchronous programming?",
        type: "multiple-choice",
        options: ["callbacks", "promises", "async/await", "All of the above"],
        correctAnswer: 3,
        explanation: "All three - callbacks, promises, and async/await - are used for asynchronous programming.",
        timeLimit: 60,
        points: 1,
        category: "quickfire"
      },
      {
        id: "js-8",
        question: "The 'this' keyword refers to the global object in arrow functions",
        type: "true-false",
        correctAnswer: "false",
        explanation: "Arrow functions don't have their own 'this' binding; they inherit it from the enclosing scope.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  4: {
    id: 4,
    title: "React & Frontend Frameworks",
    description: "Component-based development with React",
    difficulty: "intermediate",
    duration: 40,
    questions: [
      {
        id: "react-1",
        question: "What is React?",
        type: "multiple-choice",
        options: ["A database", "A JavaScript library", "A CSS framework", "A web server"],
        correctAnswer: 1,
        explanation: "React is a JavaScript library for building user interfaces.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "react-2",
        question: "React components must return a single parent element",
        type: "true-false",
        correctAnswer: "false",
        explanation: "With React Fragments, components can return multiple elements without a wrapper.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "react-3",
        question: "Which hook is used for managing component state?",
        type: "multiple-choice",
        options: ["useEffect", "useState", "useContext", "useCallback"],
        correctAnswer: 1,
        explanation: "useState is the hook used for managing component state in React.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "react-4",
        question: "What is JSX?",
        type: "multiple-choice",
        options: ["A new programming language", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
        correctAnswer: 1,
        explanation: "JSX is a syntax extension for JavaScript that allows writing HTML-like code in React.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "react-5",
        question: "useEffect runs after every render by default",
        type: "true-false",
        correctAnswer: "true",
        explanation: "useEffect runs after every render unless you provide a dependency array.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "react-6",
        question: "Which method is used to update state in class components?",
        type: "multiple-choice",
        options: ["updateState()", "setState()", "changeState()", "modifyState()"],
        correctAnswer: 1,
        explanation: "setState() is the method used to update state in React class components.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      },
      {
        id: "react-7",
        question: "React uses a Virtual DOM",
        type: "true-false",
        correctAnswer: "true",
        explanation: "React uses a Virtual DOM to optimize rendering performance.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      },
      {
        id: "react-8",
        question: "Which hook is used for side effects?",
        type: "multiple-choice",
        options: ["useState", "useEffect", "useCallback", "useMemo"],
        correctAnswer: 1,
        explanation: "useEffect is used for handling side effects like API calls, subscriptions, etc.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      }
    ]
  },

  5: {
    id: 5,
    title: "Full-Stack Development",
    description: "Connecting frontend with backend APIs",
    difficulty: "advanced",
    duration: 45,
    questions: [
      {
        id: "fullstack-1",
        question: "What does API stand for?",
        type: "multiple-choice",
        options: ["Application Programming Interface", "Advanced Programming Interface", "Application Process Interface", "Automated Programming Interface"],
        correctAnswer: 0,
        explanation: "API stands for Application Programming Interface.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "fullstack-2",
        question: "REST APIs are stateless",
        type: "true-false",
        correctAnswer: "true",
        explanation: "REST APIs are stateless, meaning each request must contain all information needed to process it.",
        timeLimit: 30,
        points: 1,
        category: "warmup"
      },
      {
        id: "fullstack-3",
        question: "Which HTTP method is used to retrieve data?",
        type: "multiple-choice",
        options: ["POST", "GET", "PUT", "DELETE"],
        correctAnswer: 1,
        explanation: "GET is the HTTP method used to retrieve data from a server.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "fullstack-4",
        question: "What is the purpose of middleware in web applications?",
        type: "multiple-choice",
        options: ["To style components", "To handle requests between client and server", "To manage databases", "To create user interfaces"],
        correctAnswer: 1,
        explanation: "Middleware handles requests between the client and server, providing additional functionality.",
        timeLimit: 45,
        points: 1,
        category: "general"
      },
      {
        id: "fullstack-5",
        question: "JSON stands for JavaScript Object Notation",
        type: "true-false",
        correctAnswer: "true",
        explanation: "JSON (JavaScript Object Notation) is a lightweight data interchange format.",
        timeLimit: 30,
        points: 1,
        category: "general"
      },
      {
        id: "fullstack-6",
        question: "Which status code indicates a successful HTTP request?",
        type: "multiple-choice",
        options: ["404", "500", "200", "401"],
        correctAnswer: 2,
        explanation: "Status code 200 indicates a successful HTTP request.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      },
      {
        id: "fullstack-7",
        question: "CORS stands for Cross-Origin Resource Sharing",
        type: "true-false",
        correctAnswer: "true",
        explanation: "CORS (Cross-Origin Resource Sharing) is a mechanism that allows restricted resources to be requested from another domain.",
        timeLimit: 30,
        points: 1,
        category: "quickfire"
      },
      {
        id: "fullstack-8",
        question: "Which database type is MongoDB?",
        type: "multiple-choice",
        options: ["Relational", "NoSQL", "Graph", "Key-value"],
        correctAnswer: 1,
        explanation: "MongoDB is a NoSQL document database.",
        timeLimit: 45,
        points: 1,
        category: "quickfire"
      }
    ]
  }
}; 