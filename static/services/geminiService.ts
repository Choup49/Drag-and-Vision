
import { PipelineNode, PipelineConnection, Challenge, ValidationResult, CppTranspilationResult } from "../types";
import { AVAILABLE_NODES, MOCK_COMMUNITY_NODES } from "../constants";

// Fonction utilitaire pour appeler notre backend Flask
const callBackendAI = async (prompt: string, model: string = 'gemini-3-pro-preview', responseMimeType?: string) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model,
        config: responseMimeType ? { response_mime_type: responseMimeType } : {}
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data.text;
  } catch (error) {
    console.error("Backend AI Error:", error);
    return null;
  }
};

export const generatePythonCode = async (prompt: string): Promise<string> => {
  const instruction = `You are a Python OpenCV generator. Requirement: "${prompt}". Assign result to {output}. Do not use markdown backticks.`;
  const result = await callBackendAI(instruction);
  return result || "{output} = {input} # Error";
};

export const getChallengeHint = async (challengeTitle: string): Promise<string> => {
  const result = await callBackendAI(`Short pedagogical hint for: "${challengeTitle}". 2 sentences max.`);
  return result || "Try exploring the OpenCV documentation.";
};

export const validateChallengeSolution = async (
  challenge: Challenge,
  nodes: PipelineNode[],
  connections: PipelineConnection[],
  nodeDefinitions: any[]
): Promise<ValidationResult> => {
    const prompt = `Validate CV Challenge: "${challenge.title}". Return JSON: { "success": boolean, "message": "...", "hint": "..." }`;
    const result = await callBackendAI(prompt, 'gemini-3-pro-preview', 'application/json');
    try {
        return JSON.parse(result || '{"success":false, "message":"Error"}');
    } catch {
        return { success: false, message: "Parse Error" };
    }
};

export const analyzeAndFixCode = async (code: string, pref: number = 5): Promise<{ fixedCode: string; explanation: string }> => {
    const prompt = `Optimize Python: ${code}. Return JSON: { "fixedCode": "...", "explanation": "..." }`;
    const result = await callBackendAI(prompt, 'gemini-3-pro-preview', 'application/json');
    try {
        return JSON.parse(result || '{"fixedCode":"", "explanation":""}');
    } catch {
        return { fixedCode: code, explanation: "Error" };
    }
};

export const transpileToCpp = async (pythonCode: string): Promise<CppTranspilationResult> => {
    const prompt = `Transpile to C++: ${pythonCode}. Return JSON: { "cppCode": "...", "cmakeCode": "...", "explanation": "..." }`;
    const result = await callBackendAI(prompt, 'gemini-3-pro-preview', 'application/json');
    try {
        return JSON.parse(result || '{"cppCode":"", "cmakeCode":"", "explanation":""}');
    } catch {
        return { cppCode: "// Error", cmakeCode: "", explanation: "" };
    }
};

export const parsePythonToPipeline = async (pythonCode: string): Promise<{ nodes: any[]; connections: any[] }> => {
    const prompt = `Convert Python to Node Graph JSON: ${pythonCode}`;
    const result = await callBackendAI(prompt, 'gemini-3-pro-preview', 'application/json');
    try {
        return JSON.parse(result || '{"nodes":[], "connections":[]}');
    } catch {
        return { nodes: [], connections: [] };
    }
};
