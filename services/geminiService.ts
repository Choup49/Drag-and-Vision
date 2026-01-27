
import { GoogleGenAI, Type } from "@google/genai";
import { PipelineNode, PipelineConnection, Challenge, ValidationResult, CppTranspilationResult, NodeType, Position, LogicConfig } from "../types";
import { AVAILABLE_NODES, MOCK_COMMUNITY_NODES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePythonCode = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a short, 2-sentence pedagogical hint for solving the computer vision challenge: "${challengeTitle}" using OpenCV/Python. Do not give the full code.`,
    });
    return response.text || "Focus on understanding the core algorithm first.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not retrieve hint.";
  }
};

export const validateChallengeSolution = async (
  challenge: Challenge,
  nodes: PipelineNode[],
  connections: PipelineConnection[],
  nodeDefinitions: any[]
): Promise<ValidationResult> => {
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as ValidationResult;
    } catch (e) {
        console.error("Gemini API Error:", e);
        return { success: false, message: "Validation Error", hint: "Check your connections." };
    }
};

export const analyzeAndFixCode = async (code: string, optimizationPreference: number = 5): Promise<{ fixedCode: string; explanation: string }> => {
  try {
    const prompt = `
    You are a world-class Senior Computer Vision Engineer and Python Optimization Expert.
    
    Your task is to review, correct, and optimize the provided Python OpenCV code using GEMINI INTELLIGENCE.
    
    USER OPTIMIZATION PREFERENCE: ${optimizationPreference}/10.
    
    INPUT CODE:
    ${code}
    
    Return JSON: { "fixedCode": "Full runnable python code string", "explanation": "Detailed list of optimizations applied." }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini Optimize Error:", e);
    return { fixedCode: code, explanation: "Failed to analyze code." };
  }
};

export const transpileToCpp = async (pythonCode: string): Promise<CppTranspilationResult> => {
    try {
        const prompt = `
        Transpile the following Python OpenCV code to C++. Also provide a CMakeLists.txt.
        
        Python Code:
        ${pythonCode}

        Return JSON: { "cppCode": "...", "cmakeCode": "...", "explanation": "..." }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        console.error("Gemini API Error:", e);
        return { cppCode: "// Transpilation Failed", cmakeCode: "", explanation: "Error during AI processing." };
    }
};

export const parsePythonToPipeline = async (pythonCode: string): Promise<{ nodes: PipelineNode[]; connections: PipelineConnection[] }> => {
    const allDefs = [...AVAILABLE_NODES, ...MOCK_COMMUNITY_NODES];
    const registry = allDefs.map(n => `- ${n.id} matches python: ${n.pythonClass}`).join('\n');

    const prompt = `
    Analyze the Python code and convert it to a JSON Node Graph.
    REGISTRY:
    ${registry}

    INPUT CODE:
    ${pythonCode}

    RETURN JSON:
    {
      "nodes": [ { "uuid": "...", "defId": "...", "position": { "x": 0, "y": 0 }, "params": {} } ],
      "connections": [ { "id": "...", "sourceNodeId": "...", "targetNodeId": "..." } ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        console.error("Parse Error", e);
        return { nodes: [], connections: [] };
    }
};
