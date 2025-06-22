# Smash or Pass AI Image Analyzer

An interactive web application that uses the Google Gemini API to provide a humorous "Smash or Pass" style analysis of any uploaded image. The app allows users to select different analysis depths, from a concise summary to a comprehensive evaluation.

---

## ✨ Features

- **Model Selector**: Allows user to select specific Gemini model
- **Dynamic Image Upload**: Click to select or drag-and-drop an image file.
- **Bilingual Support**: Supports both English and Chinese
- **Multiple Analysis Styles**:
  - **Concise**: A brief, 1-2 sentence analysis.
  - **Detailed**: A multi-sentence, in-depth look.
  - **Comprehensive**: An extensive, multi-paragraph evaluation.
- **Direct Gemini API Integration**: Communicates with the Google Gemini API (`gemini-2.5-flash`) to generate content.
- **Structured JSON Output**: The model is prompted to return a clean JSON object, which is then parsed and displayed.
- **Clear UI States**: Displays loading, error, and final result states to the user.
- **Pure Vanilla JS**: Built with modern, dependency-free HTML, CSS, and JavaScript (ES Modules).

---

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES Modules)
- **API**: [Google Gemini API](https://ai.google.dev/)
- **Fonts**: [Google Fonts (Inter)](https://fonts.google.com/specimen/Inter)

---

To run this project locally, you will need a Google Gemini API key.
