chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Summarizer Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "summarize") {
        fetchSummary(request.text).then(summary => {
            sendResponse({ summary: summary });
        });
        return true;
    } else if (request.action === "translate") {
        const { text, language } = request;
        translateText(text, language).then(translation => {
            sendResponse({ translation: translation });
        }).catch(err => {
            sendResponse({ translation: `Error: ${err.message}` });
        });
        return true;
    }
});

async function fetchSummary(text) {
    const apiKey = "YOUR_API";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestData = {
        contents: [
            {
                parts: [
                    { text: text }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response:", result);
            return "Error: No summary generated.";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return "Error: Unable to fetch summary.";
    }
}


async function translateText(text, targetLanguage) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0][0][0]; // Extract translated text
    } catch (error) {
        throw new Error("Translation failed.");
    }
}
