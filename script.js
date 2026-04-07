// Firebase connection
const firebaseConfig = {
  apiKey: "AIzaSyArFJPMUnY1MTcnNUYk7lO3_mbiY-52sfo",
  authDomain: "adulting101-7e9de.firebaseapp.com",
  projectId: "adulting101-7e9de",
  storageBucket: "adulting101-7e9de.firebasestorage.app",
  messagingSenderId: "447222841291",
  appId: "1:447222841291:web:6e2490d9e5fc555e09c04e",
  measurementId: "G-7RPX9GHKRN"
};

// Run Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Login function
function handleLogin() {
    const email = document.getElementById('student-email').value;
    const pass = document.getElementById('student-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            console.log("Welcome back:", userCredential.user.email);
            // Hide login, show welcome
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        })
        .catch((error) => {
            alert("Login Error: " + error.message);
        });
}

// Sign Up function
function handleSignUp() {
    const email = document.getElementById('student-email').value;
    const pass = document.getElementById('student-pass').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            alert("Account created! You are now logged in.");
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        })
        .catch((error) => {
            alert("Registration Error: " + error.message);
        });
}

// Data variable
let moduleData = {};

// Fetching external content
fetch('modules.json')
    .then(response => response.json())
    .then(data => {
        moduleData = data;
        console.log("Adulting 101 content loaded successfully.");
    })
    .catch(err => console.error("Critical: Could not load module data", err));

// Show the correct Sub-Menu
function loadModule(moduleKey) {
    // Hiding all screens 
    const screens = ['welcome-screen', 'module-content', 'finance-menu', 'career-menu', 'digital-menu'];
    screens.forEach(id => document.getElementById(id).classList.add('hidden'));

    // Show the requested sub-menu
    const targetId = `${moduleKey}-menu`;
    if (document.getElementById(targetId)) {
        document.getElementById(targetId).classList.remove('hidden');
    }
}

// Moving from Menu to a specific Lesson
function startLesson(lessonKey) {
    const data = moduleData[lessonKey];
    if (data) {
        // Hide sub-menus
        document.getElementById('finance-menu').classList.add('hidden');
        document.getElementById('career-menu').classList.add('hidden');
        document.getElementById('digital-menu').classList.add('hidden');

        // Fill the page with text
        populateContent(data);
        document.getElementById('module-content').classList.remove('hidden');
        resetStages();
    } else {
        console.error("Lesson key not found in JSON:", lessonKey);
    }
}

// Fill HTML with JSON data
function populateContent(data) {
    document.getElementById('module-title').innerText = data.title;
    document.getElementById('lecture-text').innerText = data.lecture;
    document.getElementById('practice-text').innerText = data.practice;
    document.getElementById('quiz-text').innerText = data.quiz;

    // Clear old practice options and feedback
    const optionsContainer = document.getElementById('practice-options');
    const feedbackBox = document.getElementById('practice-feedback');
    const nextBtn = document.getElementById('next-to-quiz');
    
    // Ensure these elements exist before trying to modify them
    if (optionsContainer) optionsContainer.innerHTML = '';
    if (feedbackBox) feedbackBox.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    // Create buttons for each choice provided in JSON
    if (data.choices && optionsContainer) {
        data.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = 'choice-btn';
            // Arrow function to pass the choice data to the checker
            btn.onclick = () => checkPractice(choice);
            optionsContainer.appendChild(btn);
        });
    }
}

// LPC Logic: Moving through Lecture -> Practice -> Quiz
function nextStage(stageId) {
    const stages = document.querySelectorAll('.lpc-stage');
    stages.forEach(stage => stage.classList.add('hidden'));
    document.getElementById(stageId).classList.remove('hidden');
    window.scrollTo(0, 0);
}

function resetStages() {
    const stages = document.querySelectorAll('.lpc-stage');
    stages.forEach(stage => stage.classList.add('hidden'));
    document.getElementById('lecture-section').classList.remove('hidden');
}

// Return to Sub-Menu 
function completeModule() {
    alert("Lesson completed! Your progress will be saved.");
    
    // Determine which menu to return to based on the current title
    const currentTitle = document.getElementById('module-title').innerText.toLowerCase();

    if (currentTitle.includes("finance")) {
        loadModule('finance');
    } else if (currentTitle.includes("career")) {
        loadModule('career');
    } else if (currentTitle.includes("digital")) {
        loadModule('digital');
    } else {
        showHome();
    }
}

// Back to Home
function showHome() {
    // Hide every section first
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.classList.add('hidden'));

    // Show the welcome screen if the user is logged in
    if (firebase.auth().currentUser) {
        document.getElementById('welcome-screen').classList.remove('hidden');
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
    }
}

function checkPractice(choice) {
    const feedbackBox = document.getElementById('practice-feedback');
    const nextBtn = document.getElementById('next-to-quiz');

    if (!feedbackBox || !nextBtn) return;

    feedbackBox.innerText = choice.feedback;
    feedbackBox.classList.remove('hidden');

    if (choice.isCorrect) {
        feedbackBox.style.backgroundColor = "#d4edda"; // Success Green
        feedbackBox.style.color = "#155724";
        feedbackBox.style.borderColor = "#c3e6cb";
        nextBtn.classList.remove('hidden'); // Reveal the "Take the Quiz" button
    } else {
        feedbackBox.style.backgroundColor = "#f8d7da"; // Error Red
        feedbackBox.style.color = "#721c24";
        feedbackBox.style.borderColor = "#f5c6cb";
        nextBtn.classList.add('hidden'); // Keep the quiz hidden until correct
    }
}
//Disable home screen buttons until log in
auth.onAuthStateChanged((user) => {
    const navButtons = document.querySelectorAll('.nav-btn');

    if (user) {
        navButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        });
        showHome(); 
    } else {
        navButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        });
        showHome();
    }
});
