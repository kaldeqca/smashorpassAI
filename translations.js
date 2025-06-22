// --- START OF FILE translations.js ---

export const translations = {
    en: {
        // --- Page Titles & Headers ---
        title: "Smash or Pass AI",
        subtitle: "Upload an image to get an AI-powered analysis.",
        subtitleWarning: "(Please do not upload your own personal images)",
        apiKeyLabel: "API Key:",
        apiKeyPlaceholder: "Please provide your own API key from Gemini",
        analysisStyleTitle: "Select Analysis Style",

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
        apiKeyLabel: "API密钥:",
        apiKeyPlaceholder: "请输入自己的Gemini API密钥",
        analysisStyleTitle: "选择分析风格",

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