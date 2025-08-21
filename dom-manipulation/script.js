let quotes = [
  "The best way to predict the future is to invent it.",
  "Life is 10% what happens to us and 90% how we react to it.",
  "Do not watch the clock. Do what it does. Keep going.",
  "Success is not in what you have, but who you are.",
];

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}
loadQuotes();

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function newQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerHTML = quotes[randomIndex];

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", quotes[randomIndex]);
}

// Dynamically create Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "newQuoteInput";
  input.placeholder = "Enter your quote";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote); // ✅ event listener instead of onclick

  formContainer.appendChild(input);
  formContainer.appendChild(button);
}

// Add a new quote
function addQuote() {
  const newQuote = document.getElementById("newQuoteInput").value.trim();
  if (newQuote) {
    quotes.push(newQuote);
    saveQuotes();
    alert("Quote added successfully!");
    document.getElementById("newQuoteInput").value = "";
  } else {
    alert("Please enter a valid quote!");
  }
}

// Export quotes to JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Attach all event listeners after DOM loads
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuoteBtn").addEventListener("click", newQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

  createAddQuoteForm();

  // Load last viewed quote from session storage
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").innerHTML = lastQuote;
  }
});
