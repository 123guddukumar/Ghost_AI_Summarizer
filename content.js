document.addEventListener('mouseup', function (event) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        event.stopPropagation();
        showActionButtons(event.pageX, event.pageY, selectedText);
    } else {
        removeActionButtons();
    }
});

function showActionButtons(x, y, text) {
    if (document.getElementById('summarizeBtnInjected') || document.getElementById('translateBtnInjected')) return;

    const summarizeButton = document.createElement('button');
    summarizeButton.id = 'summarizeBtnInjected';
    summarizeButton.textContent = 'Summarize';
    styleButton(summarizeButton, x, y);

    summarizeButton.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: 'summarize', text: text }, function (response) {
            removeActionButtons();
            displaySummary(response.summary || "Error: No summary generated.");
        });
    });

    

    document.body.appendChild(summarizeButton);

    const translateButton = document.createElement('button');
    translateButton.id = 'translateBtnInjected';
    translateButton.textContent = 'Translate';
    styleButton(translateButton, x, y + 40);

    translateButton.addEventListener('click', function () {
        const selectedLanguage = prompt("Enter language code (e.g., es for Spanish, fr for French):");
        if (selectedLanguage) {
            chrome.runtime.sendMessage({ action: 'translate', text: text, language: selectedLanguage }, function (response) {
                removeActionButtons();
                alert(response.translation || "Error: Translation failed.");
            });
        }
    });

    document.body.appendChild(translateButton);

    
}

function styleButton(button, x, y) {
    button.style.position = 'absolute';
    button.style.top = `${y}px`;
    button.style.left = `${x}px`;
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
    button.style.zIndex = '99999';
    button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'opacity 0.3s ease';
}

function removeActionButtons() {
    const summarizeButton = document.getElementById('summarizeBtnInjected');
    if (summarizeButton) summarizeButton.remove();

    const translateButton = document.getElementById('translateBtnInjected');
    if (translateButton) translateButton.remove();
}

function displaySummary(summary) {
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summaryContainer';
    summaryContainer.style.position = 'fixed';
    summaryContainer.style.bottom = '20px';
    summaryContainer.style.right = '20px';
    summaryContainer.style.width = '350px';
    summaryContainer.style.backgroundColor = '#ffffff';
    summaryContainer.style.border = '3px solid black';
    summaryContainer.style.borderRadius = '8px';
    summaryContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    summaryContainer.style.padding = '15px';
    summaryContainer.style.zIndex = '99999';
    summaryContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    // Close Button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 12px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginBottom = '15px';

    closeButton.addEventListener('click', function () {
        summaryContainer.style.opacity = '0';
        summaryContainer.style.transform = 'translateY(10px)';
        setTimeout(() => summaryContainer.remove(), 300); // Delay for transition
    });

    // Summary Text
    const summaryText = document.createElement('p');
    summaryText.textContent = `Summary: ${summary.substring(0, 200)}...`;
    summaryText.style.marginBottom = '10px';

    // "Open Side Panel" Button
    const readMoreButton = document.createElement('button');
    readMoreButton.textContent = 'Open Side Panel';
    readMoreButton.style.backgroundColor = '#0d6efd';
    readMoreButton.style.color = 'white';
    readMoreButton.style.border = 'none';
    readMoreButton.style.padding = '8px 12px';
    readMoreButton.style.borderRadius = '4px';
    readMoreButton.style.cursor = 'pointer';
    readMoreButton.style.marginRight = '10px';

    readMoreButton.addEventListener('click', function () {
        showSidePanel(summary);
    });


    // Append elements
    summaryContainer.appendChild(closeButton);
    summaryContainer.appendChild(summaryText);
    summaryContainer.appendChild(readMoreButton);
    document.body.appendChild(summaryContainer);

    // Animate in
    setTimeout(() => {
        summaryContainer.style.opacity = '1';
        summaryContainer.style.transform = 'translateY(0)';
    }, 100);
}


function showSidePanel(summary) {
    const sidePanel = document.createElement('div');
    sidePanel.id = 'sidePanel';
    sidePanel.style.position = 'fixed';
    sidePanel.style.top = '0';
    sidePanel.style.left = '0';
    sidePanel.style.height = '100%';
    sidePanel.style.width = '316px';
    sidePanel.style.borderRadius = '8px';
    sidePanel.style.backgroundColor = '#f8f9fa';
    sidePanel.style.boxShadow = '4px 0 8px rgba(0, 0, 0, 0.2)';
    sidePanel.style.padding = '20px';
    sidePanel.style.overflowY = 'auto';
    sidePanel.style.zIndex = '99999';
    sidePanel.style.transform = 'translateX(-100%)';
    sidePanel.style.transition = 'transform 0.4s ease';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '8px 12px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginBottom = '15px';

    closeButton.addEventListener('click', function () {
        sidePanel.style.transform = 'translateX(-100%)';
        setTimeout(() => sidePanel.remove(), 400);
    });

    const fullSummary = document.createElement('p');
    fullSummary.textContent = summary;
    fullSummary.style.lineHeight = '1.5';

    sidePanel.appendChild(closeButton);
    sidePanel.appendChild(fullSummary);
    document.body.appendChild(sidePanel);

    setTimeout(() => {
        sidePanel.style.transform = 'translateX(0)';
    }, 100);
}
