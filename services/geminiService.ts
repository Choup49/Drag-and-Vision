
import { GoogleGenAI } from "@google/genai";
import { PipelineNode, PipelineConnection, Challenge, ValidationResult, CppTranspilationResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generatePythonCode = async (prompt: string): Promise<string> => {
  if (!ai) {
    return "# API Key missing. Fallback: {output} = {input} # Pass through";
  }

  try {
    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a Python OpenCV code generator. 
      
      Requirement: "${prompt}"
      
      I have a variable '{input}' (numpy array, BGR image).
      I need you to generate the Python code lines to process '{input}' and assign the result to variable '{output}'.
      
      Rules:
      1. Do NOT write a function definition. Just write the execution lines.
      2. Use 'cv2' and 'np' (numpy).
      3. Assume '{input}' is valid.
      4. You MUST assign the final result to '{output}'.
      5. Do not include markdown backticks.
      
      Example Input: "Convert to gray"
      Example Output: 
      {output} = cv2.cvtColor({input}, cv2.COLOR_BGR2GRAY)
      
      Example Input: "Draw circle in center"
      Example Output:
      {output} = {input}.copy()
      h, w = {output}.shape[:2]
      cv2.circle({output}, (w//2, h//2), 20, (0, 0, 255), -1)
      `,
    });

    return response.text || "{output} = {input} # AI failed to generate";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "# Error generating code.";
  }
};

export const getChallengeHint = async (challengeTitle: string): Promise<string> => {
  if (!ai) return "AI Assistant not available (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give a short, 2-sentence pedagogical hint for solving the computer vision challenge: "${challengeTitle}" using OpenCV/Python. Do not give the full code.`,
    });
    return response.text || "Focus on understanding the core algorithm first.";
  } catch (error) {
    return "Could not retrieve hint.";
  }
};

export const validateChallengeSolution = async (
  challenge: Challenge,
  nodes: PipelineNode[],
  connections: PipelineConnection[],
  nodeDefinitions: any[]
): Promise<ValidationResult> => {
    if (!ai) return { success: false, message: "API Key Missing" };

    // Build a text representation of the graph
    const nodeDesc = nodes.map(n => {
        const def = nodeDefinitions.find(d => d.id === n.defId);
        return `Node ${n.uuid} is type '${def?.name}'`;
    }).join('\n');

    const connDesc = connections.map(c => `Node ${c.sourceNodeId} connects to ${c.targetNodeId}`).join('\n');

    const prompt = `
    I have a Computer Vision Challenge: "${challenge.title}".
    Description: "${challenge.description}"
    Objectives: ${challenge.objectives.join(', ')}

    Here is the user's Node Pipeline Graph:
    ${nodeDesc}
    
    Connections:
    ${connDesc}

    Does this graph logically solve the challenge? 
    Return JSON format: { "success": boolean, "message": "Short explanation", "hint": "Optional hint if failed" }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as ValidationResult;
    } catch (e) {
        return { success: false, message: "Validation Error", hint: "Check your connections." };
    }
};

export const analyzeAndFixCode = async (code: string, optimizationPreference: number = 5): Promise<{ fixedCode: string; explanation: string }> => {
  if (!ai) return { fixedCode: code, explanation: "API Key Missing" };

  try {
    const prompt = `
    You are a Senior Computer Vision Engineer. 
    Analyze the following Python/OpenCV code.
    
    Optimization Strategy (Scale 1-10, user selected: ${optimizationPreference}):
    - If > 5: Prioritize FPS/Speed aggressively (e.g., reduce resolution using cv2.resize, skip frames, use threading, simplier algorithms).
    - If < 5: Prioritize Accuracy/Quality (e.g., keep resolution, use more precise algo, no skipping).
    - If 5: Balanced approach.

    1. Fix any syntax or logical errors.
    2. Optimize based on the preference above.
    3. Refactor for readability.
    
    Input Code:
    ${code}

    Return JSON: { "fixedCode": "Full python code string...", "explanation": "Bulleted list of changes made and optimization techniques applied." }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (e) {
    return { fixedCode: code, explanation: "Failed to analyze code. Please check API Key or try again." };
  }
};

export const transpileToCpp = async (pythonCode: string): Promise<CppTranspilationResult> => {
    if (!ai) return { cppCode: "// API Key Missing", cmakeCode: "", explanation: "Could not transpile." };

    try {
        const prompt = `
        You are an expert Computer Vision Engineer. 
        Transpile the following Python OpenCV code to C++ (using cv::Mat).
        Also provide a CMakeLists.txt to compile it.
        
        Python Code:
        ${pythonCode}

        Return JSON: { "cppCode": "Full main.cpp content...", "cmakeCode": "CMakeLists.txt content...", "explanation": "Key changes and C++ specifics used (e.g., using references, efficient loops)." }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        return { cppCode: "// Transpilation Failed", cmakeCode: "", explanation: "Error during AI processing." };
    }
};
