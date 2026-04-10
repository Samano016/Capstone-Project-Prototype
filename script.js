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
        })
        .catch((error) => {
            alert("Registration Error: " + error.message);
        });
}
//Log out of the session
function handleLogout() {
    auth.signOut().then(() => {
        console.log("User logged out");
    }).catch((error) => {
        alert("Logout Error: " + error.message);
    });
}

//Finance content block
function renderFinanceFundamentals() {
    const data = moduleData.finance_intro_data;
    const target = document.getElementById('finance-fundamentals-target');
    
    // Safety check: ensure data and target exist
    if (!data || !target) return;

    let sectionsBody = "";
    data.sections.forEach(sec => {
        let listItems = "";
        sec.list.forEach(item => {
            listItems += `<li>${item}</li>`;
        });

        sectionsBody += `
            <div class="info-block">
                <h3>${sec.title}</h3>
                <p>${sec.description}</p>
                <ul class="fundamentals-list">${listItems}</ul>
            </div>
        `;
    });

    target.innerHTML = `
        <div class="finance-hero-container">
            <img src="${data.image}" class="hero-img" alt="Overview">
            <div class="hero-text-content">
                ${sectionsBody}
            </div>
        </div>
    `;
}

// Data variable
let moduleData = {};

// Fetching external content
fetch('modules.json')
    .then(response => response.json())
    .then(data => {
        moduleData = data;
        console.log("Adulting 101 content loaded successfully.");
      renderFinanceFundamentals();
    })
    .catch(err => console.error("Critical: Could not load module data", err));

// Show the correct Sub-Menu
function loadModule(moduleKey) {
    // Hiding all screens 
    const screens = ['welcome-screen', 'module-content', 'finance-menu', 'career-menu', 'digital-menu', 'sources-menu'];
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

// HTML and JSON data
function populateContent(data) {
    document.getElementById('module-title').innerText = data.title;
    document.getElementById('lecture-text').innerText = data.lecture;
    document.getElementById('practice-text').innerText = data.practice;
    document.getElementById('quiz-text').innerText = data.quiz;

    // Clear old practice options and feedback
    const practiceContainer = document.getElementById('practice-options');
    const practiceFeedback = document.getElementById('practice-feedback');
    const nextBtn = document.getElementById('next-to-quiz');
    
    if (practiceContainer) practiceContainer.innerHTML = '';
    if (practiceFeedback) practiceFeedback.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    // Buttons for practice
    if (data.choices && practiceContainer) {
        data.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = 'choice-btn';
            btn.onclick = () => checkPractice(choice);
            practiceContainer.appendChild(btn);
        });
    }

    // Clear old quiz options and hide the finish button
    const quizContainer = document.getElementById('quiz-interaction');
    const finishBtn = document.getElementById('finish-btn'); // Grabs the finish button
    
    if (quizContainer) {
        quizContainer.innerHTML = ''; 
        // We will make a new dedicated feedback box for the quiz inside the container
        const quizFeedback = document.createElement('div');
        quizFeedback.id = 'quiz-feedback';
        quizFeedback.className = 'feedback-box hidden';
        quizContainer.appendChild(quizFeedback);
    }
    if (finishBtn) finishBtn.classList.add('hidden');

    // Buttons for the quiz
    if (data.quizChoices && quizContainer) {
        data.quizChoices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = 'choice-btn';
            btn.onclick = () => checkQuiz(choice);
            quizContainer.appendChild(btn);
        });
    }
}

// Quiz Logic
function checkQuiz(choice) {
    const feedbackBox = document.getElementById('quiz-feedback');
    const finishBtn = document.getElementById('finish-btn');

    if (!feedbackBox || !finishBtn) return;

    feedbackBox.innerText = choice.feedback;
    feedbackBox.classList.remove('hidden');

    if (choice.isCorrect) {
        feedbackBox.style.backgroundColor = "#d4edda"; // Success Green
        feedbackBox.style.color = "#155724";
        feedbackBox.style.borderColor = "#c3e6cb";
        finishBtn.classList.remove('hidden'); // Reveal the "Finish Lesson" button
    } else {
        feedbackBox.style.backgroundColor = "#f8d7da"; // Error 
        feedbackBox.style.color = "#721c24";
        feedbackBox.style.borderColor = "#f5c6cb";
        finishBtn.classList.add('hidden'); // The finish button is hidden until correct
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

// Finance Tools
// 50/30/20 Budget Logic
function calculateBudget() {
    const income = document.getElementById('budget-input').value;
    if (income > 0) {
        document.getElementById('needs-val').innerText = (income * 0.50).toLocaleString();
        document.getElementById('wants-val').innerText = (income * 0.30).toLocaleString();
        document.getElementById('savings-val').innerText = (income * 0.20).toLocaleString();
    }
}

// Work Hours 
function calculateHours() {
    const cost = document.getElementById('item-cost').value;
    const wage = document.getElementById('hourly-wage').value;
    
    if (cost > 0 && wage > 0) {
        // We assume 15% goes to taxes for realism
        const netWage = wage * 0.85; 
        const hours = (cost / netWage).toFixed(1);
        document.getElementById('hours-needed').innerText = hours;
    }
}

// Compound Interest Calculator
function calculateCompound() {
    const P = parseFloat(document.getElementById('compound-principal').value) || 0;
    const PMT = parseFloat(document.getElementById('compound-monthly').value) || 0;
    const t = parseFloat(document.getElementById('compound-years').value) || 0;
    const r = 0.07; // 7% annual return
    const n = 12;   // Monthly compounding
    
    if (t > 0) {
        const principalGrowth = P * Math.pow(1 + r/n, n * t);
        const seriesGrowth = PMT * (Math.pow(1 + r/n, n * t) - 1) / (r/n);
        const total = principalGrowth + seriesGrowth;
        document.getElementById('compound-total').innerText = Math.round(total).toLocaleString();
    }
}

//Loan Calculator
function calculateLoan() {
    const P = parseFloat(document.getElementById('loan-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('loan-rate').value) || 0;
    const t = parseFloat(document.getElementById('loan-years').value) || 0;

    if (P > 0 && annualRate > 0 && t > 0) {
        const r = (annualRate / 100) / 12; // Monthly interest rate
        const n = t * 12; // Total number of payments

        // repayment Formula
        const x = Math.pow(1 + r, n);
        const monthly = (P * x * r) / (x - 1);

        document.getElementById('monthly-payment').innerText = monthly.toFixed(2).toLocaleString();
    } else {
        document.getElementById('monthly-payment').innerText = "0";
    }
}

// Career Exploration Tools
// --- 1. Resume Red Flags Logic ---
let flagsFound = 0;

function flagFound(element) {
    // Only count it if it hasn't been clicked yet
    if (!element.classList.contains('found')) {
        element.classList.add('found');
        flagsFound++;

        // If they found all 3, hide the bad resume and show the Level 100 one
        if (flagsFound === 3) {
            setTimeout(() => {
                document.getElementById('bad-resume').classList.add('hidden');
                document.getElementById('good-resume').classList.remove('hidden');
            }, 500); // 500ms delay so they can see the final click
        }
    }
}

// --- 2. Workplace Scenarios Logic ---
function checkScenario(choice) {
    const feedbackBox = document.getElementById('scenario-feedback');
    feedbackBox.classList.remove('hidden');

    if (choice === 'A') {
        feedbackBox.innerHTML = "❌ <strong>Careful!</strong> Arguing immediately can seem defensive. Take a breath first.";
        feedbackBox.style.color = "#c0392b";
    } else if (choice === 'B') {
        feedbackBox.innerHTML = "✅ <strong>Spot on!</strong> Listening and asking clarifying questions shows maturity and a willingness to grow.";
        feedbackBox.style.color = "#27ae60";
    } else if (choice === 'C') {
        feedbackBox.innerHTML = "❌ <strong>Not quite.</strong> Ignoring feedback means you miss a chance to improve and might frustrate your boss.";
        feedbackBox.style.color = "#c0392b";
    }
}

// --- 3. 100th Day Goal Setter Logic ---
function saveGoals() {
    const g1 = document.getElementById('goal1').value;
    const g2 = document.getElementById('goal2').value;
    const g3 = document.getElementById('goal3').value;
    const displayBox = document.getElementById('goals-display');

    if (g1 && g2 && g3) {
        displayBox.classList.remove('hidden');
        displayBox.innerHTML = `
            <strong>Your 100-Day Plan:</strong><br>
            1. ${g1}<br>
            2. ${g2}<br>
            3. ${g3}<br>
            <em>Screenshot this to hold yourself accountable!</em>
        `;
        displayBox.style.color = "#2980b9";
    } else {
        alert("Please fill out all 3 goals before committing!");
    }
}

// Digital Citizenship Tools


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

          if (btn.id === 'dark-mode-toggle') {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            return; // Dark Mode will still work
        }
          
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

function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById('dark-mode-toggle');
    
    body.classList.toggle('dark-theme');
    
    // Save preference to localStorage
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        btn.innerText = "Light Mode";
    } else {
        localStorage.setItem('theme', 'light');
        btn.innerText = "Dark Mode";
    }
}

// Saved user preference when page loads
window.onload = function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('dark-mode-toggle').innerText = "Light Mode";
    }
};
