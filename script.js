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
  //Career exploration content block
  function renderCareerFundamentals() {
    const data = moduleData.career_readiness_data;
    const target = document.getElementById('career-exploration-fundamentals');
    
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
        <div class="career-hero-container">
            <img src="${data.image}" class="hero-img" alt="Overview">
            <div class="hero-text-content">
                ${sectionsBody}
            </div>
        </div>
    `;
}

  //Digital citizenship content block
  function renderDigitalFundamentals() {
    const data = moduleData.digital_citizenship_data;
    const target = document.getElementById('digital-fundamentals-target');

    if (!data || !target) return;

    let sectionsBody = "";
    data.sections.forEach(sec => {
        let listItems = "";
        sec.list.forEach(item => { listItems += `<li>${item}</li>`; });
        sectionsBody += `
            <div class="info-block">
                <h3>${sec.title}</h3>
                <p>${sec.description}</p>
                <ul class="fundamentals-list">${listItems}</ul>
            </div>`;
    });

    target.innerHTML = `
        <div class="digital-hero-container">
            <img src="${data.image}" class="hero-img" alt="Digital Overview">
            <div class="hero-text-content">${sectionsBody}</div>
        </div>`;
}

// Data variable
let moduleData = {};

// Fetching content from JSON file
fetch('modules.json')
    .then(response => response.json())
    .then(data => {
        moduleData = data;
        console.log("Adulting 101 content loaded successfully.");
    })
    .catch(err => console.error("Critical: Could not load module data", err));

// Show the correct Sub-Menu
function loadModule(moduleKey) {
    // 1. Hide all screens
    const screens = ['welcome-screen', 'module-content', 'finance-menu', 'career-menu', 'digital-menu', 'sources-menu', 'login-screen'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Show the requested sub-menu
    const targetId = `${moduleKey}-menu`;
    const targetEl = document.getElementById(targetId);
    
    if (targetEl) {
        targetEl.classList.remove('hidden');
        
        // Render content only when the module is on screen
        if (moduleKey === 'finance') {
            renderFinanceFundamentals();
        }
        if (moduleKey === 'career') {
            renderCareerFundamentals();
        }
        if (moduleKey === 'digital') {
            renderDigitalFundamentals();
          if (moduleData.digital_citizenship_data && moduleData.digital_citizenship_data.footprintQuiz) {
        renderScorecard(moduleData.digital_citizenship_data.footprintQuiz);
    }
          
        }
    } else {
        console.error("Menu ID not found:", targetId);
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

    // Clear old quiz options
    const quizContainer = document.getElementById('quiz-interaction');
    const finishBtn = document.getElementById('finish-btn'); // Finish button
    
    if (quizContainer) {
        quizContainer.innerHTML = ''; 
        // Feedback box for the quiz 
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
        finishBtn.classList.remove('hidden'); // Finish Lesson button
    } else {
        feedbackBox.style.backgroundColor = "#f8d7da"; // Error 
        feedbackBox.style.color = "#721c24";
        feedbackBox.style.borderColor = "#f5c6cb";
        finishBtn.classList.add('hidden'); // The finish button remains hidden 
    }
}

// LPC: Moving through Lecture -> Practice -> Quiz
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

//Finance Mini Game
let portfolio = 1000;
let currentAge = 18;
const retirementAge = 65;

// Updates the current age based on the starting input
function updateStartAge() {
    const startAgeInput = document.getElementById('start-age');
    currentAge = parseInt(startAgeInput.value);
    document.getElementById('current-age-display').innerHTML = `Current Age: <strong>${currentAge}</strong>`;
}

function playRoulette(riskLevel) {
    // Stop the game when retirement age is reached
    if (currentAge >= retirementAge) return;

    const feedback = document.getElementById('roulette-feedback');
    const display = document.getElementById('portfolio-value');
    const wheel = document.getElementById('wheel-animation');
    const resetBtn = document.getElementById('reset-roulette');
    const ageDisplay = document.getElementById('current-age-display');

    // Visual spin
    wheel.style.transform = "rotate(360deg)";
    setTimeout(() => { wheel.style.transform = "rotate(0deg)"; }, 500);

    // Risk Logic
    let change = 0;
    let outcome = Math.random();

    if (riskLevel === 'low') {
        // 90% chance of small gain, 10% chance of small loss
        change = (outcome > 0.1) ? (0.02 + Math.random() * 0.03) : -0.01;
    } else if (riskLevel === 'med') {
        // 70% chance of gain, 30% chance of loss
        change = (outcome > 0.3) ? (0.07 + Math.random() * 0.05) : -(0.05 + Math.random() * 0.05);
    } else if (riskLevel === 'high') {
        // 40% chance of big gain, 60% chance of big loss
        change = (outcome > 0.6) ? (0.50 + Math.random() * 0.50) : -(0.40 + Math.random() * 0.40);
    }

    let result = portfolio * change;
    portfolio += result;
    currentAge++; // Age increases by 1 year per spin

    // Age and portfolio value
    ageDisplay.innerHTML = `Current Age: <strong>${currentAge}</strong>`;
    display.innerText = `$${portfolio.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    if (result > 0) {
        feedback.innerHTML = `📈 Age ${currentAge}: Market gain of <strong>$${Math.abs(result).toFixed(2)}</strong>.`;
        feedback.style.color = "#27ae60";
    } else {
        feedback.innerHTML = `📉 Age ${currentAge}: Market loss of <strong>$${Math.abs(result).toFixed(2)}</strong>.`;
        feedback.style.color = "#c0392b";
    }

    // Retirement and bankrupcy
    if (currentAge >= retirementAge) {
        feedback.innerHTML = `🎉 <strong>Retirement Reached!</strong><br>Your retirement account has <strong>$${portfolio.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong>.`;
        feedback.style.color = "#2c3e50";
        endGame();
    } else if (portfolio <= 0) {
        feedback.innerHTML = "💀 <strong>Bankruptcy!</strong> Your portfolio hit $0.";
        portfolio = 0;
        display.innerText = "$0.00";
        endGame();
    }
}

function endGame() {
    document.querySelectorAll('.risk-btn').forEach(btn => btn.disabled = true);
    document.getElementById('start-age').disabled = true;
    document.getElementById('reset-roulette').classList.remove('hidden');
}

function resetRoulette() {
    portfolio = 1000;
    // Age from input
    updateStartAge();
    
    document.getElementById('portfolio-value').innerText = "$1,000.00";
    document.getElementById('roulette-feedback').innerText = "";
    document.getElementById('reset-roulette').classList.add('hidden');
    document.querySelectorAll('.risk-btn').forEach(btn => btn.disabled = false);
    document.getElementById('start-age').disabled = false;
}

// Career Exploration Tools
// Resume Red Flags 
let flagsFound = 0;

function flagFound(element) {
    // Only count it if it hasn't been clicked
    if (!element.classList.contains('found')) {
        element.classList.add('found');
        flagsFound++;

        // Hide the bad resume and show the correct version
        if (flagsFound === 3) {
            setTimeout(() => {
                document.getElementById('bad-resume').classList.add('hidden');
                document.getElementById('good-resume').classList.remove('hidden');
            }, 500); // 500ms delay 
        }
    }
}

// Workplace Scenarios 
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

// 100th Day Goal Setter 
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
// Digital habits
function renderScorecard(quizArray) {
    const container = document.getElementById('footprint-questions-container');
    if (!container) return; 
    
    container.innerHTML = ""; 

    // Loop through the data we just pulled from the JSON
    quizArray.forEach(item => {
        container.innerHTML += `
            <li style="margin-bottom: 10px;">
                ${item.q} 
                <select class="score-select">
                    <option value="10">${item.s}</option>
                    <option value="0">${item.r}</option>
                </select>
            </li>
        `;
    });
}

// Password Strength Tool
function checkPasswordStrength() {
    const password = document.getElementById('password-input').value;
    const resultDiv = document.getElementById('password-result');
    if (!password) { resultDiv.innerText = "Awaiting input..."; return; }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
        resultDiv.innerHTML = "🔴 Weak, try adding some special characters like numbers and symbols";
        resultDiv.style.color = "#c0392b";
    } else if (strength <= 3) {
        resultDiv.innerHTML = "🟡 Moderate, you are almost there!";
        resultDiv.style.color = "#b7950b";
    } else {
        resultDiv.innerHTML = "🟢 Strong, you have a reliable password!";
        resultDiv.style.color = "#27ae60";
    }
}

// Scorecard Calculation 
function calculateFootprint() {
    const selects = document.querySelectorAll('.score-select');
    let totalScore = 0;

    selects.forEach(select => {
        totalScore += parseInt(select.value);
    });

    const resultDiv = document.getElementById('footprint-result');
    resultDiv.classList.remove('hidden');
    
    let message = totalScore >= 80 ? "🏆 Digital Safety, be proud of yourself!" : totalScore >= 50 ? "⚠️ Average User, you are in a good position, but be careful!" : "🛑 High Risk, consider impproving your habits!";
    resultDiv.innerHTML = `<strong>Score: ${totalScore}/100</strong><br>${message}`;
}

//Phishing link inspector
//Show the link
function showLink() {
    const reveal = document.getElementById('link-reveal');
    if (reveal) {
        reveal.classList.remove('hidden');
    }
}

// Hide the link
function hideLink() {
    const reveal = document.getElementById('link-reveal');
    if (reveal) {
        reveal.classList.add('hidden');
    }
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

//Permissions App 
const appData = [
    {
        name: "Flashlight Ultra HD",
        desc: "A simple tool to turn your phone into a bright torch.",
        permissions: [
            { text: "Access Camera (to use the LED Flash)", necessary: true },
            { text: "Access Contacts", necessary: false },
            { text: "Read Text Messages", necessary: false },
            { text: "Access GPS Location", necessary: false }
        ]
    },
    {
        name: "SocialMap Pro",
        desc: "Find your friends on a real-time map and share photos.",
        permissions: [
            { text: "Access GPS Location", necessary: true },
            { text: "Access Contacts (to find friends)", necessary: true },
            { text: "Access Calendar", necessary: false },
            { text: "Access Microphone", necessary: false }
        ]
    },
    {
        name: "Vintage Photo Filter",
        desc: "Add cool 90s filters to your selfies.",
        permissions: [
            { text: "Access Photos & Gallery", necessary: true },
            { text: "Access Camera", necessary: true },
            { text: "Access GPS Location (to tag photo locations)", necessary: false }
        ]
    }
];

// Game State Variables
let currentAppIndex = 0;
let currentPermIndex = 0;
let privacyLeaks = 0; // Leaks per app
let totalLeaks = 0;   // Leaks across all apps

function loadApp() {
    const app = appData[currentAppIndex];
    document.getElementById('app-name').innerText = app.name;
    document.getElementById('app-description').innerText = app.desc;
    
    // Reset UI visibility for the new app
    document.getElementById('results').style.display = "none";
    document.getElementById('permission-card').style.display = "block";
    
    showPermission();
}

function showPermission() {
    const app = appData[currentAppIndex];
    document.getElementById('permission-text').innerText = `Allow "${app.name}" to ${app.permissions[currentPermIndex].text}?`;
}

function handlePermission(allowed) {
    const app = appData[currentAppIndex];
    const perm = app.permissions[currentPermIndex];

    // Check if the user allowed something unnecessary
    if (allowed && !perm.necessary) {
        privacyLeaks++;
        totalLeaks++;
    }
    
    currentPermIndex++;

    // Move to next permission or show results if done
    if (currentPermIndex < app.permissions.length) {
        showPermission();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('permission-card').style.display = "none";
    document.getElementById('results').style.display = "block";
    
    if (currentAppIndex < appData.length - 1) {
        // Results for a single app
        document.getElementById('review-title').innerText = "App Review";
        document.getElementById('final-score').innerText = privacyLeaks === 0 
            ? "Perfect! You kept your data safe on this app." 
            : `You had ${privacyLeaks} unnecessary data leaks for this app.`;
            
        document.getElementById('next-app-btn').style.display = "block";
        document.getElementById('reset-game-btn').style.display = "none";
    } else {
        // Final Results for the whole game
        document.getElementById('review-title').innerText = "Final Results";
        
        let finalMessage = "";
        if (totalLeaks === 0) {
            finalMessage = "🏆 Incredible! You audited all apps with ZERO data leaks. You are a Privacy Master!";
        } else {
            finalMessage = `⚠️ You finished auditing with a total of ${totalLeaks} unnecessary data leaks across all apps. Remember to always ask WHY an app needs your data!`;
        }
        
        document.getElementById('final-score').innerText = finalMessage;
        
        document.getElementById('next-app-btn').style.display = "none";
        document.getElementById('reset-game-btn').style.display = "block";
    }
}

function nextApp() {
    currentAppIndex++;
    currentPermIndex = 0;
    privacyLeaks = 0;
    loadApp();
}

// Resets back to zero
function restartGame() {
    currentAppIndex = 0;
    currentPermIndex = 0;
    privacyLeaks = 0;
    totalLeaks = 0;
    loadApp();
}

// Start the game for the first time
loadApp();

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
