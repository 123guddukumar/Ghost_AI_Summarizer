document.addEventListener('DOMContentLoaded', function () {
    // Show Translate options
    document.getElementById('translateBtn').addEventListener('click', function () {
        const languageList = document.getElementById('languageList');
        languageList.style.display = languageList.style.display === 'none' ? 'block' : 'none';
    });

    // Handle translation request
    document.getElementById('confirmTranslateBtn').addEventListener('click', function () {
        const selectedLanguage = document.getElementById('languageSelect').value;
        const summaryText = document.getElementById('summaryText').textContent;

        if (!summaryText || summaryText === "No summary yet.") {
            alert("Please generate a summary before translating.");
            return;
        }

        chrome.runtime.sendMessage({ action: "translate", text: summaryText, language: selectedLanguage }, function (response) {
            document.getElementById('translationText').textContent = response.translation || "Error: Translation failed.";
        });
    });

    // Summarize button logic
    document.getElementById('summarizeBtn').addEventListener('click', function () {
        const inputText = document.getElementById('inputText').value;

        if (!inputText) {
            alert("Please enter text to summarize.");
            return;
        }

        chrome.runtime.sendMessage({ action: "summarize", text: inputText }, function (response) {
            document.getElementById('summaryText').textContent = response.summary || "Error: No summary generated.";
        });
    });
});
