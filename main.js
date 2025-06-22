// --- Import configuration from config.js ---
import { systemPrompts, getRatingLabel } from './config.js';

// --- API & MODEL CONFIGURATION ---
const MODEL_NAME = "gemini-2.5-flash"; // Using a stable public model for reliability

// --- DOM ELEMENT SELECTION ---
const modeButtons = document.querySelectorAll('.mode-btn');
const fileInput = document.getElementById('file-upload');
const uploadArea = document.getElementById('upload-area');
const apiKeyInput = document.getElementById('api-key-input');
const analyzeButton = document.getElementById('analyze-btn');
const resultDisplayArea = document.getElementById('result-display-area');

// --- STATE MANAGEMENT ---
let selectedMode = 'Concise'; // Default mode, matches the active button in HTML
let isProcessing = false; // Prevent multiple simultaneous requests
let uploadedFile = null; // Store the uploaded file object

// --- UI FUNCTIONS ---

// Resets the initial upload prompt
function resetUploadPrompt() {
    uploadArea.innerHTML = `
        <div class="upload-area-content">
            <div class="upload-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <p>Drag & drop an image or <span class="upload-link">click to upload</span></p>
        </div>`;
    uploadArea.style.padding = '40px 20px'; // Restore padding
    uploadArea.style.borderStyle = 'dashed'; // Restore border style
}

// Displays a preview of the selected image
function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        uploadArea.innerHTML = `<img src="${event.target.result}" alt="Image preview">`;
        uploadArea.style.padding = '0'; // Remove padding to fit the image
        uploadArea.style.borderStyle = 'solid'; // Change border to solid
    };
    reader.readAsDataURL(file);
}

function displayLoading() {
    resultDisplayArea.innerHTML = `<p class="loading-text">Analyzing... This may take a moment.</p>`;
}

function displayError(errorMessage) {
    resultDisplayArea.innerHTML = `<p class="error-text"><strong>Analysis Failed:</strong><br>${errorMessage}</p>`;
}

function displayResult(result) {
    const { verdict, rating, explanation } = result;
    const ratingLabel = getRatingLabel(rating);
    const verdictClass = `verdict-${verdict.toLowerCase()}`;

    resultDisplayArea.innerHTML = `
        <div class="result-container">
            <div class="result-item">
                <span class="result-label">Verdict:</span>
                <span class="result-value ${verdictClass}">${verdict}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Score:</span>
                <span class="result-value">${rating}/10 (${ratingLabel})</span>
            </div>
            <div class="result-item explanation">
                <span class="result-label">Explanation:</span>
                <p class="explanation-text">${explanation}</p>
            </div>
        </div>`;
}

// Checks conditions and enables/disables the analyze button
function updateAnalyzeButtonState() {
    const apiKeyPresent = apiKeyInput.value.trim() !== '';
    if (uploadedFile && apiKeyPresent) {
        analyzeButton.disabled = false;
    } else {
        analyzeButton.disabled = true;
    }
}

// --- EVENT LISTENERS ---
// 1. Set initial UI state
document.addEventListener('DOMContentLoaded', resetUploadPrompt);

// 2. Handle analysis mode selection
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (isProcessing) return; // Don't change mode while processing
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedMode = button.querySelector('.mode-title').textContent.trim();
    });
});

// 3. Handle file selection
fileInput.addEventListener('change', handleFileSelection);

// 4. Listen for API key input to update button state
apiKeyInput.addEventListener('input', updateAnalyzeButtonState);

// 5. Handle "Analyze" button click
analyzeButton.addEventListener('click', handleImageAnalysis);


// --- CORE LOGIC ---

// Converts an image file to a Base64 string for the API
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Called when a user selects a file
function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) {
        uploadedFile = null;
        resetUploadPrompt();
    } else {
        uploadedFile = file;
        displayImagePreview(uploadedFile);
    }
    // Clear previous results when a new image is selected
    resultDisplayArea.innerHTML = '';
    updateAnalyzeButtonState();
}

// Main function to process the image and call the API, triggered by button click
async function handleImageAnalysis() {
    const API_KEY = apiKeyInput.value.trim();

    if (!uploadedFile || isProcessing || !API_KEY) {
        if (!API_KEY) {
            displayError("Please provide your API key.");
        }
        return;
    }

    isProcessing = true;
    analyzeButton.disabled = true;
    analyzeButton.textContent = 'Analyzing...';
    displayLoading();

    try {
        const base64Image = await imageToBase64(uploadedFile);
        const selectedModeKey = selectedMode.toLowerCase();
        const systemInstruction = systemPrompts[selectedModeKey];

        if (!systemInstruction) {
            throw new Error(`System prompt for mode "${selectedMode}" not found.`);
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

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 400 && errorData.error.message.includes('API key not valid')) {
                throw new Error("The provided API key is not valid. Please check your key and try again.");
            }
            throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("The model did not return a response. This may be due to a safety policy violation or an unknown API error.");
        }

        const resultJson = JSON.parse(data.candidates[0].content.parts[0].text);
        displayResult(resultJson);

    } catch (error) {
        console.error("Error during analysis:", error);
        displayError(error.message);
    } finally {
        isProcessing = false;
        analyzeButton.textContent = 'Analyze';
        // Re-enable the button if conditions are still met
        updateAnalyzeButtonState();
    }
}

// --- DRAG AND DROP EVENT LISTENERS ---
uploadArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadArea.classList.add('dragging-over');
});

// 2. Handle the user dragging a file away from the drop area
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging-over'); // Remove visual feedback
});

// 3. Handle the actual file drop
uploadArea.addEventListener('drop', (event) => {
    event.preventDefault(); // Prevent the browser from opening the file
    uploadArea.classList.remove('dragging-over');

    const files = event.dataTransfer.files;

    if (files.length > 0) {
        // Use the first file that was dropped
        const file = files[0];

        // Check if the dropped file is an image
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file; // Update the global state
            displayImagePreview(uploadedFile); // Show the preview

            // Also update the hidden file input's files list. 
            // This isn't strictly necessary for your app to work but is good practice.
            fileInput.files = files;

        } else {
            // Optional: Alert the user if they drop a non-image file
            alert('Please drop an image file (e.g., JPEG, PNG, GIF).');
            return;
        }

        // Clear previous results and update the button state, just like in your click handler
        resultDisplayArea.innerHTML = '';
        updateAnalyzeButtonState();
    }
});
