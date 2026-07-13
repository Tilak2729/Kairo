import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const buildProjectContext = (fileTree) => {

    if (!fileTree || Object.keys(fileTree).length === 0) {
        return "The project is currently empty.";
    }

    let context = "========================\n";
    context += "PROJECT STRUCTURE\n";
    context += "========================\n\n";

    Object.keys(fileTree).forEach(path => {
        context += `${path}\n`;
    });

    context += "\n\n";

    Object.entries(fileTree).forEach(([path, file]) => {

        context += "========================\n";
        context += `FILE: ${path}\n`;
        context += "========================\n\n";

        context += file.file.contents;
        context += "\n\n";

    });

    return context;

};
export const selectRelevantFiles = async (prompt, fileTree = {}) => {

    const projectStructure = Object.keys(fileTree);

    const response = await ai.models.generateContent({

        model: "gemini-2.5-flash",

        contents: `
You are a senior software engineer.

Project Structure:

${projectStructure.join("\n")}

User Request:

${prompt}

You are an expert software engineer.

Your ONLY job is to identify which existing files are required to complete the user's request.

Project Structure:

${projectStructure.join("\n")}

User Request:

${prompt}

Return raw JSON only.

Do not wrap the response in markdown.

Do not use code fences.

The response must start with {

The response must end with }

Never write the word "json".

Example:

{
  "files":[
    "index.html"
  ]
}

Rules:

- Return ONLY existing files.
- Never create filenames.
- Never include markdown.
- Never explain your answer.
- If only one file is required, return exactly one file.
- If multiple existing files are required, include all of them.
- If the task requires creating a new file, return an empty array.
`
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

};
export const generateResult = async (prompt, fileTree = {}) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: `
    User Request:
${prompt}
Current Project:

${buildProjectContext(fileTree)}

IMPORTANT:

Respond ONLY in valid JSON.

Do not use markdown.
Do not use code fences.
Do not explain anything outside the JSON.

Return exactly this format:

{
  "message": "short explanation",

  "operations": [
    {
      "type": "create",
      "path": "index.html",
      "contents": "<!DOCTYPE html>..."
    }
  ]
}

Rules:

- You are an AI software engineer working on an existing project.

- First analyze the user's request.

- If the requested feature can be implemented by changing existing files, use the "modify" operation.

- Only use the "create" operation when a required file does not already exist.

- Never recreate a file that already exists.

- Never modify a file that is unrelated to the user's request.

- Each operation must contain:
  - "type"
  - "path"
  - "contents"

- "contents" must contain the COMPLETE contents of the file after the modification.

- Return ONLY the files that actually changed.

- If no changes are required, return an empty operations array.

- Never return markdown.

- Never return code fences.

- Never explain anything outside the JSON.

- Assume every file listed in "Current Project Files" already exists unless you need to create a brand new file.

Editing Rules:

- Treat the provided project files as the source of truth.

- Your primary job is to MODIFY existing code, not regenerate it.

- Preserve all existing code that is unrelated to the user's request.

- Make the SMALLEST possible change required to satisfy the user's request.

- Do not rewrite an entire file if only a few lines need to change.

- Preserve formatting, indentation, comments, imports, and code style whenever possible.

- Do not improve, refactor, optimize, or redesign code unless the user explicitly asks for it.

- Do not rename variables, functions, components, classes, or files unless required.

- Never add extra features that the user did not request.

- If only one file needs to change, return exactly one operation.

- Think like a developer maintaining an existing codebase, not an AI generating a new project.
`,
  });

  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response text";

  return text;
};


export const cleanAIResponse = (text) => {
    return text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
};






