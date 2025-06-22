// --- START OF FILE main.js ---

// --- Import configuration ---
import { systemPrompts } from './config.js';
import { translations } from './translations.js';

// --- DOM ELEMENT SELECTION ---
const modelSelector = document.getElementById('model-selector-input');
const modeButtons = document.querySelectorAll('.mode-btn');
const fileInput = document.getElementById('file-upload');
const uploadArea = document.getElementById('upload-area');
const apiKeyInput = document.getElementById('api-key-input');
const analyzeButton = document.getElementById('analyze-btn');
const resultDisplayArea = document.getElementById('result-display-area');
const languageButtons = document.querySelectorAll('.language-switcher button');

// --- STATE MANAGEMENT ---
let selectedMode = 'Concise'; // Default mode
let isProcessing = false;
let uploadedFile = null;
let currentLanguage = 'en'; // Default language

// --- TRANSLATION & UI FUNCTIONS ---

// Populates the model selector dropdown with translated options
function populateModelSelector() {
    const selectedValue = modelSelector.value; // Save current selection
    const models = translations[currentLanguage].models;

    modelSelector.innerHTML = ''; // Clear existing options

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.text;
        modelSelector.appendChild(option);
    });

    // Restore previous selection if it still exists
    modelSelector.value = selectedValue || models[0].value;
}

// Gets the rating label from the translations object
function getRatingLabel(rating) {
    const labels = translations[currentLanguage].ratingLabels;
    if (rating <= 2) return labels['1-2'];
    if (rating <= 4) return labels['3-4'];
    if (rating <= 6) return labels['5-6'];
    if (rating <= 8) return labels['7-8'];
    return labels['9-10'];
}

// Sets the language for the entire UI
function setLanguage(lang) {
    currentLanguage = lang;

    // Update active button style
    languageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    // Populate the model selector with the correct language
    populateModelSelector();

    // Update all elements with a data-translate-key
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Handle special cases like placeholders and dynamic content
    apiKeyInput.placeholder = translations[lang].apiKeyPlaceholder;

    // Reset upload prompt to the correct language if no file is uploaded
    if (!uploadedFile) {
        resetUploadPrompt();
    }

    // If there is a result, re-render it in the new language
    if (resultDisplayArea.innerHTML.trim() !== '' && !isProcessing) {
        const verdictEl = resultDisplayArea.querySelector('.result-value[class*="verdict-"]');
        if (verdictEl) {
            const result = {
                verdict: verdictEl.textContent,
                rating: parseInt(resultDisplayArea.querySelector('.result-item:nth-child(2) .result-value').textContent),
                explanation: resultDisplayArea.querySelector('.explanation-text').textContent
            };
            displayResult(result);
        }
    }
}

// Resets the initial upload prompt
function resetUploadPrompt() {
    const trans = translations[currentLanguage];
    uploadArea.innerHTML = `
        <div class="upload-area-content">
            <div class="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p>${trans.uploadPrompt}<span class="upload-link">${trans.uploadLink}</span></p>
        </div>`;
    uploadArea.style.padding = '40px 20px';
    uploadArea.style.borderStyle = 'dashed';
}

function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadArea.innerHTML = `<img src="${event.target.result}" alt="Image preview">`;
        uploadArea.style.padding = '0';
        uploadArea.style.borderStyle = 'solid';
    };
    reader.readAsDataURL(file);
}

function displayLoading() {
    resultDisplayArea.innerHTML = `<p class="loading-text">${translations[currentLanguage].loadingText}</p>`;
}

function displayError(errorMessage) {
    resultDisplayArea.innerHTML = `<p class="error-text"><strong>${translations[currentLanguage].errorPrefix}</strong><br>${errorMessage}</p>`;
}

function displayResult(result) {
    const { verdict, rating, explanation } = result;
    const ratingLabel = getRatingLabel(rating);
    const verdictClass = `verdict-${verdict.toLowerCase()}`;
    const trans = translations[currentLanguage];

    resultDisplayArea.innerHTML = `
        <div class="result-container">
            <div class="result-item">
                <span class="result-label">${trans.verdictLabel}</span>
                <span class="result-value ${verdictClass}">${verdict}</span>
            </div>
            <div class="result-item">
                <span class="result-label">${trans.scoreLabel}</span>
                <span class="result-value">${rating}/10 (${ratingLabel})</span>
            </div>
            <div class="result-item explanation">
                <span class="result-label">${trans.explanationLabel}</span>
                <p class="explanation-text">${explanation}</p>
            </div>
        </div>`;
}

function updateAnalyzeButtonState() {
    const apiKeyPresent = apiKeyInput.value.trim() !== '';
    analyzeButton.disabled = !(uploadedFile && apiKeyPresent);
}

// --- EVENT LISTENERS ---
// 1. Set initial UI state on load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage); // Set default language and populate model selector
});

// 2. Handle language selection
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.dataset.lang);
    });
});

// 3. Handle analysis mode selection
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isProcessing) return;
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedMode = button.querySelector('.mode-title').textContent.trim();
    });
});

// 4. Handle file selection
fileInput.addEventListener('change', handleFileSelection);

// 5. Listen for API key input to update button state
apiKeyInput.addEventListener('input', updateAnalyzeButtonState);

// 6. Handle "Analyze" button click
analyzeButton.addEventListener('click', handleImageAnalysis);

// --- CORE LOGIC ---

function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) {
        uploadedFile = null;
        resetUploadPrompt();
    } else {
        uploadedFile = file;
        displayImagePreview(uploadedFile);
    }
    resultDisplayArea.innerHTML = '';
    updateAnalyzeButtonState();
}

async function handleImageAnalysis() {
    const API_KEY = apiKeyInput.value.trim();
    const selectedModel = modelSelector.value;
    const trans = translations[currentLanguage];

    if (!API_KEY) {
        displayError(trans.apiKeyMissingError);
        return;
    }
    if (!uploadedFile || isProcessing) return;

    isProcessing = true;
    analyzeButton.disabled = true;
    analyzeButton.textContent = trans.analyzingButton;
    displayLoading();

    // --- Variables to store data for logging in case of error ---
    let requestBodyToLog = null;
    let rawResponseTextToLog = null;
    let parsedResponseJsonToLog = null;
    // --- End logging variables ---

    try {
        const base64Image = await imageToBase64(uploadedFile);

        const selectedModeTitleEl = document.querySelector('.mode-btn.active .mode-title');
        const modeKey = selectedModeTitleEl.dataset.translateKey.replace('Title', '').toLowerCase();

        const systemInstruction = systemPrompts[currentLanguage][modeKey];

        if (!systemInstruction) {
            throw new Error(trans.promptError(selectedMode));
        }

        const requestBody = {
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: [{
                parts: [
                    { text: "Analyze the attached image based on your instructions." },
                    { inline_data: { mime_type: uploadedFile.type, data: base64Image } }
                ]
            }],
            generation_config: {
                "response_mime_type": "application/json",
            }
        };
        requestBodyToLog = requestBody; // Store request body for logging

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        // Get raw response text for logging before attempting to parse as JSON
        rawResponseTextToLog = await response.text();

        // Attempt to parse the response text as JSON
        try {
            parsedResponseJsonToLog = JSON.parse(rawResponseTextToLog);
        } catch (jsonParseError) {
            console.warn("API response was not valid JSON. Raw response text is available in logs.", jsonParseError);
            // parsedResponseJsonToLog remains null, rawResponseTextToLog will be logged
        }

        if (!response.ok) {
            // Prefer the parsed JSON for error message if available, otherwise use raw text or status
            const errorData = parsedResponseJsonToLog && parsedResponseJsonToLog.error ? parsedResponseJsonToLog.error : {};
            const errorMessageFromResponse = errorData.message || rawResponseTextToLog || `API request failed with status ${response.status}`;

            if (response.status === 400 && errorMessageFromResponse.includes('API key not valid')) {
                throw new Error(trans.apiKeyInvalidError);
            }
            throw new Error(errorMessageFromResponse);
        }

        // If response.ok, and parsedResponseJsonToLog is available, use it as 'data'
        const data = parsedResponseJsonToLog;

        if (!data || !data.candidates || data.candidates.length === 0) {
            throw new Error(trans.modelError);
        }

        // The model's response is expected to be a JSON string within a 'text' part
        const modelOutputText = data.candidates[0].content.parts[0].text;
        const resultJson = JSON.parse(modelOutputText); // Parse the model's actual output

        displayResult(resultJson);

    } catch (error) {
        console.error("Error during analysis:", error);
        // --- START OF ERROR DUMP ---
        console.groupCollapsed("Gemini API Communication Details (for debugging)");
        if (requestBodyToLog) {
            console.log("Request Sent:", requestBodyToLog);
        }
        if (rawResponseTextToLog) {
            console.log("Raw Response Received:", rawResponseTextToLog);
        }
        if (parsedResponseJsonToLog) {
            console.log("Parsed Response JSON:", parsedResponseJsonToLog);
        }
        console.groupEnd();
        // --- END OF ERROR DUMP ---
        displayError(error.message);
    } finally {
        isProcessing = false;
        analyzeButton.textContent = trans.analyzeButton;
        updateAnalyzeButtonState();
    }
}

// --- DRAG AND DROP EVENT LISTENERS ---
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragging-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging-over');
});

uploadArea.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadArea.classList.remove('dragging-over');

    const files = event.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            displayImagePreview(uploadedFile);
            fileInput.files = files; // Sync the file input with the dropped file
        } else {
            alert('Please drop an image file (e.g., JPEG, PNG, GIF).');
            return;
        }
        resultDisplayArea.innerHTML = '';
        updateAnalyzeButtonState();
    }
});
