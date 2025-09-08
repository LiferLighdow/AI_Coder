export const translations = {
  en: {
    // App.tsx
    appTitle: "AI Code Architect",
    appSubtitle: "Generate entire codebases from a single prompt.",
    errorTitle: "Error",
    previewHeader: "Project preview will appear here",
    previewSubtitle: "Enter a prompt above and click \"Generate Project\" to get started.",

    // ControlPanel.tsx
    promptLabel: "Project Description",
    promptPlaceholder: "e.g., A real-time chat application with user authentication and message history",
    languageLabel: "Language / Framework",
    languagePlaceholder: "e.g., React with TypeScript and Tailwind CSS",
    filesLabel: "Upload Context Files (Optional)",
    dropFiles: "Drop files to attach, or",
    browse: "browse",
    generateButton: "Generate Project",
    generatingButton: "Generating...",
    formAlert: "Please fill in both the project description and the language/framework.",

    // ProjectPreview.tsx
    projectFiles: "Project Files",
    selectFile: "Select a file to view its content",
    codeTab: "Code",
    livePreviewTab: "Live Preview",
    noPreviewAvailable: "Live Preview Not Available",
    noIndexHtml: "No index.html file found in the project. Live preview requires an index.html entry point.",

    // CodeBlock.tsx
    copy: "Copy",
    copied: "Copied!",
    copyFail: "Failed to copy text.",

    // Loader.tsx
    loaderMessage1: "Compiling quantum algorithms...",
    loaderMessage2: "Brewing fresh code...",
    loaderMessage3: "Consulting the AI architect...",
    loaderMessage4: "Assembling project blueprints...",
    loaderMessage5: "Polishing the digital artifacts...",
    loaderMessage6: "Reticulating splines...",
    loaderWait: "Please wait, this may take a moment.",
  },
  'zh-TW': {
    // App.tsx
    appTitle: "AI 程式碼架構師",
    appSubtitle: "只需一個提示，即可生成完整的程式碼庫。",
    errorTitle: "錯誤",
    previewHeader: "專案預覽將會顯示在此處",
    previewSubtitle: "請在上方輸入提示，然後點擊「生成專案」開始。",

    // ControlPanel.tsx
    promptLabel: "專案描述",
    promptPlaceholder: "例如：一個具有使用者驗證和訊息歷史記錄的即時聊天應用程式",
    languageLabel: "語言 / 框架",
    languagePlaceholder: "例如：React 搭配 TypeScript 和 Tailwind CSS",
    filesLabel: "上傳參考檔案（可選）",
    dropFiles: "拖放檔案至此，或",
    browse: "瀏覽",
    generateButton: "生成專案",
    generatingButton: "生成中...",
    formAlert: "請填寫專案描述和語言/框架。",

    // ProjectPreview.tsx
    projectFiles: "專案檔案",
    selectFile: "選擇一個檔案以查看其內容",
    codeTab: "程式碼",
    livePreviewTab: "即時預覽",
    noPreviewAvailable: "無法使用即時預覽",
    noIndexHtml: "專案中找不到 index.html 檔案。即時預覽需要一個 index.html 進入點。",
    
    // CodeBlock.tsx
    copy: "複製",
    copied: "已複製！",
    copyFail: "複製文字失敗。",

    // Loader.tsx
    loaderMessage1: "正在編譯量子演算法...",
    loaderMessage2: "正在沖泡新鮮的程式碼...",
    loaderMessage3: "正在諮詢 AI 架構師...",
    loaderMessage4: "正在組裝專案藍圖...",
    loaderMessage5: "正在拋光數位產物...",
    loaderMessage6: "正在網格化樣條...",
    loaderWait: "請稍候，這可能需要一點時間。",
  }
};

export type TranslationKey = keyof typeof translations.en;