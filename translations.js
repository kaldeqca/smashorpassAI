// --- START OF FILE translations.js ---

export const translations = {
    en: {
        // --- Page Titles & Headers ---
        title: "Smash or Pass AI",
        subtitle: "Upload an image to get an AI-powered analysis.",
        subtitleWarning: "(Please do not upload your own personal images)",
        modelSelectorLabel: "Select Model:",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Please provide your own API key from Gemini",
        analysisStyleTitle: "Select Analysis Style",

        // --- Model Selector Options ---
        models: [
            { value: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash (Default – fast and tolerant)' },
            { value: 'gemini-2.5-flash', text: 'Gemini 2.5 Flash (Improved speed and accuracy)' },
            { value: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash (Lightweight and responsive, older version)' },
            { value: 'gemini-2.0-flash-lite', text: 'Gemini 2.0 Flash-Lite (Blazing fast, for quick results)' },
            { value: 'gemini-2.5-flash-lite-preview-06-17', text: 'Gemini 2.5 Flash-Lite Preview (Very fast preview, reduced detail)' },
            { value: 'gemini-1.5-pro', text: 'Gemini 1.5 Pro (Stable and tolerant, legacy model - NOT FREE)' },
            { value: 'gemini-2.5-pro', text: 'Gemini 2.5 Pro (Most powerful – NOT FREE)' }


        ],

        // --- Mode Buttons ---
        conciseTitle: "Concise",
        conciseDesc: "A brief, 1-2 sentence analysis.",
        detailedTitle: "Detailed",
        detailedDesc: "A multi-sentence, in-depth look.",
        comprehensiveTitle: "Comprehensive",
        comprehensiveDesc: "An extensive, multi-paragraph-long evaluation.",

        // --- Upload Area ---
        uploadPrompt: "Drag & drop an image or ",
        uploadLink: "click to upload",

        // --- Buttons & Actions ---
        analyzeButton: "Analyze",
        analyzingButton: "Analyzing...",

        // --- Dynamic Text ---
        loadingText: "Analyzing... This may take a moment.",
        errorPrefix: "Analysis Failed:",
        apiKeyInvalidError: "The provided API key is not valid. Please check your key and try again.",
        modelError: "The model did not return a response. This may be due to a safety policy violation or an unknown API error.",
        promptError: (mode) => `System prompt for mode "${mode}" not found.`,
        apiKeyMissingError: "Please provide your API key.",

        // --- Result Labels ---
        verdictLabel: "Verdict:",
        scoreLabel: "Score:",
        explanationLabel: "Explanation:",

        // --- Rating Labels ---
        ratingLabels: {
            '1-2': 'Pure Shit',
            '3-4': 'Barely Fappable',
            '5-6': 'Kinda Hot',
            '7-8': 'I\'m Hard',
            '9-10': 'Instant Fuck',
        }
    },
    zh: {
        // --- Page Titles & Headers ---
        title: "上不上AI评分系统",
        subtitle: "上传图片，让AI来评判它的可操性。",
        subtitleWarning: "（请不要上传您自己的个人图片）",
        modelSelectorLabel: "选择模型:",
        apiKeyLabel: "API密钥:",
        apiKeyPlaceholder: "请输入自己的Gemini API密钥",
        analysisStyleTitle: "选择分析风格",

        // --- Model Selector Options ---
        models: [
            { value: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash（默认版本 – 快速且宽容）' },
            { value: 'gemini-2.5-flash', text: 'Gemini 2.5 Flash（速度与准确性提升）' },
            { value: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash（轻量且响应迅速，较旧版本）' },
            { value: 'gemini-2.0-flash-lite', text: 'Gemini 2.0 Flash-Lite (速度飞快, 适合快速测试)' },
            { value: 'gemini-2.5-flash-lite-preview-06-17', text: 'Gemini 2.5 Flash-Lite Preview (极速预览版, 细节有所减少)' },
            { value: 'gemini-1.5-pro', text: 'Gemini 1.5 Pro（稳定且宽容的经典型号 - 需付费）' },
            { value: 'gemini-2.5-pro', text: 'Gemini 2.5 Pro（最强大 – 需付费）' }

        ],

        // --- Mode Buttons ---
        conciseTitle: "简洁",
        conciseDesc: "短平快，1-2句，够味",
        detailedTitle: "详细",
        detailedDesc: "细嗦3+句，够劲",
        comprehensiveTitle: "全面",
        comprehensiveDesc: "多段落评估，纯硬核。",

        // --- Upload Area ---
        uploadPrompt: "拖放图片或",
        uploadLink: "点击上传",

        // --- Buttons & Actions ---
        analyzeButton: "分析",
        analyzingButton: "分析中...",

        // --- Dynamic Text ---
        loadingText: "分析中... 这可能需要一些时间。",
        errorPrefix: "分析失败:",
        apiKeyInvalidError: "提供的API密钥无效。请检查您的密钥后重试。",
        modelError: "模型未返回响应。这可能是由于安全策略违规或未知的API错误。",
        promptError: (mode) => `未找到“${mode}”模式的系统提示。`,
        apiKeyMissingError: "请输入您的API密钥。",

        // --- Result Labels ---
        verdictLabel: "评定:",
        scoreLabel: "分数:",
        explanationLabel: "解释:",

        // --- Rating Labels ---
        ratingLabels: {
            '1-2': '纯属答辩',
            '3-4': '勉强能冲',
            '5-6': '有点意思',
            '7-8': '嗯了',
            '9-10': '直接开操',
        }
    }
};
