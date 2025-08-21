let quotes = [
  "The best way to predict the future is to invent it.",
  "Life is 10% what happens to us and 90% how we react to it.",
  "Do not watch the clock. Do what it does. Keep going.",
  "Success is not in what you have, but who you are.",
];

// Load quotes from local storage when the app starts
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

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastQuote", quotes[randomIndex]);
}

// Create Add Quote Form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  formContainer.innerHTML = `
    <input type="text" id="newQuoteInput" placeholder="Enter your quote" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Add a new quote from user input
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

// Export quotes to a JSON file
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

// Import quotes from a JSON file
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

// Load last viewed quote from session storage (optional feature)
window.onload = function () {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    document.getElementById("quoteDisplay").innerHTML = lastQuote;
  }
};
