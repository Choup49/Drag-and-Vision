
import { GoogleGenAI, Type } from "@google/genai";
import { PipelineNode, PipelineConnection, Challenge, ValidationResult, NodeType, CppTranspilationResult } from "../types";
import { AVAILABLE_NODES } from "../constants";

// Independent Gemini client using environment key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePythonCode = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Task: Generate Python OpenCV snippet for: "${prompt}". Input variable is '{input}', output is '{output}'.`,
      config: {
        systemInstruction: "You are an OpenCV assistant. Return ONLY valid Python code execution lines. No classes, no functions, no imports, no markdown.",
      }
    });
    return response.text || "{output} = {input} # AI Error";
  } catch (e) {
    console.error(e);
    return "{output} = {input} # API Error";
  }
};

export const getChallengeHint = async (challengeTitle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give a pedagogical hint for CV challenge: "${challengeTitle}"`,
      config: {
        systemInstruction: "Keep it under 2 sentences. Focus on the algorithm, not code.",
      }
    });
    return response.text || "Try connecting the processing nodes to the webcam.";
  } catch (e) {
    return "Ensure your nodes follow a logical flow.";
  }
};

export const validateChallengeSolution = async (
  challenge: Challenge,
  nodes: PipelineNode[],
  connections: PipelineConnection[]
): Promise<ValidationResult> => {
  const pipelineDesc = nodes.map(n => {
    const def = AVAILABLE_NODES.find(d => d.id === n.defId);
    return `- Node ${n.uuid} is ${def?.name}`;
  }).join('\n');
  
  const connDesc = connections.map(c => `- ${c.sourceNodeId} -> ${c.targetNodeId}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Challenge: ${challenge.title}. Pipeline: \n${pipelineDesc}\nConnections: \n${connDesc}`,
      config: {
        systemInstruction: "Check if this pipeline solves the challenge objectives. Return JSON with 'success', 'message', 'hint'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ["success", "message"]
        }
      }
    });
    return JSON.parse(response.text || '{"success":false, "message":"Failed to validate"}');
  } catch (e) {
    return { success: false, message: "Validation error." };
  }
};

// Updated analyzeAndFixCode signature to support optimization preference
export const analyzeAndFixCode = async (code: string, pref: number = 5): Promise<{ fixedCode: string; explanation: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Optimize this OpenCV code based on this user preference: Level ${pref}/10. 
      (Level 1 = Maximize Accuracy, Quality, and Robustness. Level 10 = Maximize FPS, Speed, and Fluidity).
      Code: \n${code}`,
      config: {
        systemInstruction: "Refactor based on the preference level. For Level 1, add checks and better algorithms. For Level 10, remove overhead, use faster approximations. Return JSON with 'fixedCode' and 'explanation'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fixedCode: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["fixedCode", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || '{"fixedCode":"", "explanation":""}');
  } catch (e) {
    return { fixedCode: code, explanation: "Optimization failed." };
  }
};

export const transpileToCpp = async (pythonCode: string): Promise<CppTranspilationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Transpile this Python OpenCV code to C++ (using OpenCV C++ API): \n${pythonCode}`,
      config: {
        systemInstruction: "Return JSON with 'cppCode', 'cmakeCode', and 'explanation'.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cppCode: { type: Type.STRING },
            cmakeCode: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["cppCode", "cmakeCode", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || '{"cppCode":"", "cmakeCode":"", "explanation":""}');
  } catch (e) {
    return { cppCode: "// Transpilation failed.", cmakeCode: "", explanation: "API Error" };
  }
};

export const parsePythonToPipeline = async (pythonCode: string): Promise<{ nodes: PipelineNode[]; connections: PipelineConnection[] }> => {
  const registry = AVAILABLE_NODES.map(n => `- ${n.id} (python: ${n.pythonClass})`).join('\n');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Convert code to node graph using this registry:\n${registry}\nCode:\n${pythonCode}`,
      config: {
        systemInstruction: "Output JSON with 'nodes' (uuid, defId, position, params) and 'connections' (id, sourceNodeId, targetNodeId).",
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{"nodes":[], "connections":[]}');
  } catch (e) {
    return { nodes: [], connections: [] };
  }
};
