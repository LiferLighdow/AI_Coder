import { GoogleGenAI, Type } from "@google/genai";
import type { UploadedFile, ProjectFile } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the key is not set.
  // In a real deployed environment, this should be handled properly.
  // For this context, we assume process.env.API_KEY is available.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
  process.env.API_KEY = "YOUR_API_KEY"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProject = async (
  prompt: string,
  language: string,
  files: UploadedFile[]
): Promise<ProjectFile[]> => {

  let contextPrompt = '';
  if (files.length > 0) {
    contextPrompt = 'The user has provided the following files for context:\n\n';
    files.forEach(file => {
      contextPrompt += `--- FILE: ${file.name} ---\n${file.content}\n--- END FILE: ${file.name} ---\n\n`;
    });
  }

  const fullPrompt = `
    You are a world-class AI software engineer. Your task is to generate a complete, functional, and well-structured project based on the user's request. 
    Adhere to modern coding best practices for the specified language/framework.

    **User's Request:**
    "${prompt}"

    **Primary Language/Framework:**
    ${language}

    ${contextPrompt}

    Please generate all the necessary files for this project. Ensure the file paths are correct and include all required code. 
    The code should be complete and ready to run. Do not add any explanatory text outside the JSON structure.
    
    IMPORTANT for web projects:
    - Create a single 'index.html' file as the main entry point.
    - All necessary CSS and JavaScript should be included or linked from this file using relative paths (e.g., <script src="./app.js"></script>).
    - The project must be runnable by simply opening the 'index.html' file in a browser.

    Provide your response as a JSON array of file objects, where each object has a 'path' and a 'content' property.
  `;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        path: {
          type: Type.STRING,
          description: "The full path of the file, including directories. e.g., 'src/components/Button.tsx'",
        },
        content: {
          type: Type.STRING,
          description: "The complete and unabridged content of the file.",
        },
      },
      required: ["path", "content"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Lower temperature for more deterministic and structured code output
      },
    });

    const jsonString = response.text.trim();
    const generatedFiles = JSON.parse(jsonString);

    if (Array.isArray(generatedFiles) && generatedFiles.every(f => typeof f === 'object' && f !== null && 'path' in f && 'content' in f)) {
        return generatedFiles as ProjectFile[];
    } else {
        throw new Error("Invalid project structure format received from API.");
    }
  } catch (e) {
    console.error("Error generating project with Gemini:", e);
    throw new Error("Failed to generate project. The AI model might have returned an invalid response.");
  }
};