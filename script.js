
const url = "https://newsapi.org/v2/everything?q=";

// State variables to keep track of the current view
let currentQuery = "India";
let currentSortBy = "publishedAt"; // Default sort
let curSelectedNav = null;

// --- DOM ELEMENTS ---
const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news-card");
const searchText = document.getElementById("search-text");
const searchButton = document.getElementById("search-button");
const sortBySelect = document.getElementById("sort-by-select");

// Run functions on page load
window.addEventListener("load", () => {
    fetchNews();
    checkLoginStatus();
});

function reload() {
    window.location.reload();
}

// --- NEWS FETCHING & BINDING ---
async function fetchNews() {
    cardsContainer.innerHTML = '<p style="text-align: center; width: 100%;">Loading...</p>';
    try {
        const res = await fetch(`${url}${currentQuery}&sortBy=${currentSortBy}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Failed to fetch news:", error);
        cardsContainer.innerHTML = `<p style="text-align: center; width: 100%; color: red;">Failed to load news. Please check your connection or API key.</p>`;
    }
}

function bindData(articles) {
    cardsContainer.innerHTML = ""; // Clear the loading message or old articles

    if (!articles || articles.length === 0) {
        cardsContainer.innerHTML = `<p style="text-align: center; width: 100%;">No articles found for "${currentQuery}".</p>`;
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without images
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// --- EVENT HANDLERS for NEWS FILTERING & SORTING ---
function onNavItemClick(id) {
    currentQuery = id;
    fetchNews();
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    currentQuery = query;
    fetchNews();
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
    searchText.value = "";
});

sortBySelect.addEventListener("change", (e) => {
    currentSortBy = e.target.value;
    fetchNews();
});


// --- USER AUTHENTICATION (Simulated with LocalStorage) ---
// --- WARNING: This is NOT secure for a real application! ---

// Auth DOM Elements
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');

const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const userActionsDiv = document.getElementById('user-actions');
const userProfileDiv = document.getElementById('user-profile');
const welcomeMsg = document.getElementById('welcome-msg');

// Modal open/close event listeners
loginBtn.onclick = () => loginModal.style.display = 'block';
registerBtn.onclick = () => registerModal.style.display = 'block';
closeLoginBtn.onclick = () => loginModal.style.display = 'none';
closeRegisterBtn.onclick = () => registerModal.style.display = 'none';
window.onclick = function(event) {
    if (event.target == loginModal) loginModal.style.display = 'none';
    if (event.target == registerModal) registerModal.style.display = 'none';
}

// Form submission handlers
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');

    // Get existing users from localStorage or initialize an empty array
    const users = JSON.parse(localStorage.getItem('newsAppUsers')) || [];

    // Check if user already exists
    if (users.find(user => user.username === username)) {
        errorEl.textContent = 'Username already exists!';
        return;
    }

    // Add new user
    users.push({ username, password });
    localStorage.setItem('newsAppUsers', JSON.stringify(users));
    alert('Registration successful! Please login.');
    registerModal.style.display = 'none';
    registerForm.reset();
    errorEl.textContent = '';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    const users = JSON.parse(localStorage.getItem('newsAppUsers')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateNavUI(user.username);
        loginModal.style.display = 'none';
        loginForm.reset();
        errorEl.textContent = '';
    } else {
        errorEl.textContent = 'Invalid username or password.';
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    updateNavUI(null);
});

// UI Update Functions for Auth
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateNavUI(currentUser.username);
    } else {
        updateNavUI(null);
    }
}

function updateNavUI(username) {
    if (username) {
        // User is logged in
        userActionsDiv.style.display = 'none';
        userProfileDiv.style.display = 'flex';
        welcomeMsg.textContent = `Hi, ${username}`;
    } else {
        // User is logged out
        userActionsDiv.style.display = 'flex';
        userProfileDiv.style.display = 'none';
    }
}
