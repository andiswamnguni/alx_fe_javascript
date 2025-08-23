let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Perseverance" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
];

// --- Local Storage ---
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}
loadQuotes();

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- UI Notification ---
function showNotification(message) {
  const notif = document.createElement("div");
  notif.textContent = message;
  notif.style.background = "#fffae6";
  notif.style.border = "1px solid #ccc";
  notif.style.padding = "8px";
  notif.style.margin = "10px 0";
  notif.style.color = "#333";
  document.body.prepend(notif);

  setTimeout(() => notif.remove(), 3000);
}

// --- Server Sync (simulation with JSONPlaceholder) ---
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await res.json();

    const serverQuotes = serverData.map(p => ({
      text: p.title,
      category: "Server"
    }));

    let updated = false;

    serverQuotes.forEach(sq => {
      if (!quotes.some(lq => lq.text === sq.text)) {
        quotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server (new quotes added).");
    }
  } catch (err) {
    console.error("Error fetching server data:", err);
  }
}

async function postToServer(newQuote) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote),
    });
    const data = await res.json();
    console.log("Posted to server:", data);
    showNotification("Quote synced to server!");
  } catch (err) {
    console.error("Error posting to server:", err);
  }
}

// --- Filtering ---
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<em>No quotes available in this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").innerHTML =
    `"${filteredQuotes[randomIndex].text}" <br><small>[${filteredQuotes[randomIndex].category}]</small>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(filteredQuotes[randomIndex]));
}

// --- Add Quote ---
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteInput";
  textInput.placeholder = "Enter your quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", () => addQuote(textInput, categoryInput));

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(button);
}

function addQuote(textInput, categoryInput) {
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please fill in both fields!");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();

  // Sync new quote with server
  postToServer(newQuote);

  alert("Quote added successfully!");
  textInput.value = "";
  categoryInput.value = "";
}

// --- Import / Export ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- Event Listeners ---
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuoteBtn").addEventListener("click", filterQuotes);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("syncBtn").addEventListener("click", fetchQuotesFromServer);

  createAddQuoteForm();
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `"${q.text}" <br><small>[${q.category}]</small>`;
  }
});

// --- Auto sync every 15s ---
setInterval(fetchQuotesFromServer, 15000);
