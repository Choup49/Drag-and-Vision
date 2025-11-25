
import { GoogleGenAI } from "@google/genai";
import { PipelineNode, PipelineConnection, Challenge, ValidationResult, CppTranspilationResult, NodeType, Position } from "../types";
import { AVAILABLE_NODES, MOCK_COMMUNITY_NODES } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Use Flash for quick interactive generation
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

    // Use Pro model for better logical validation
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
        return { success: false, message: "Validation Error", hint: "Check your connections." };
    }
};

export const analyzeAndFixCode = async (code: string, optimizationPreference: number = 5): Promise<{ fixedCode: string; explanation: string }> => {
  if (!ai) return { fixedCode: code, explanation: "API Key Missing" };

  try {
    // Use Pro model for complex coding tasks and better reasoning
    const modelName = 'gemini-3-pro-preview';

    const prompt = `
    You are a world-class Senior Computer Vision Engineer and Python Optimization Expert.
    
    Your task is to review, correct, and optimize the provided Python OpenCV code using GEMINI INTELLIGENCE.
    
    USER OPTIMIZATION PREFERENCE: ${optimizationPreference}/10.
    (1 = Max Quality, 10 = Max Speed/FPS)
    
    ADVANCED STRATEGY:
    ${optimizationPreference >= 7 ? 
      `- **AGGRESSIVE PERFORMANCE (High FPS)**: 
       - **Threading**: Use \`threading.Thread\` for video I/O to prevent blocking the main loop.
       - **Resolution Scaling**: Downscale input images using \`cv2.resize(src, (0,0), fx=0.5, fy=0.5)\` before processing.
       - **Frame Skipping**: Process only every Nth frame (e.g., if \`frame_count % 3 == 0\`).
       - **Approximations**: Use faster detectors (e.g. FAST instead of ORB/SIFT).
       - **Vectorization**: Replace ALL Python loops with NumPy array operations.
       - **Data Types**: Use uint8 instead of float32/float64 where possible.` : 
      optimizationPreference <= 3 ?
      `- **MAXIMUM QUALITY**: 
       - **Resolution**: Maintain full native resolution.
       - **Interpolation**: Use \`cv2.INTER_LANCZOS4\` or \`cv2.INTER_CUBIC\` for resizing.
       - **Accuracy**: Use computationally expensive algorithms for better precision (e.g., CLAHE, Non-Local Means Denoising).
       - **No Frame Skipping**: Ensure every frame is processed.` :
      `- **BALANCED (Default)**: 
       - **Standard Optimization**: Remove redundant \`.copy()\` calls.
       - **In-place Operations**: Use \`dst=src\` in OpenCV functions where safe.
       - **Loop Unrolling**: Vectorize pixel-level operations using NumPy.`
    }

    MANDATORY CHECKS:
    1. **Vectorization**: Replace slow Python \`for\` loops with fast Numpy array operations immediately.
    2. **Safety**: Ensure \`if not ret: break\` exists after \`cap.read()\`.
    3. **Cleanup**: Ensure \`cap.release()\` and \`cv2.destroyAllWindows()\` are present.
    4. **Refactoring**: Clean up variable names to be PEP-8 compliant.
    
    INPUT CODE:
    ${code}
    
    Return JSON: { "fixedCode": "Full runnable python code string", "explanation": "Detailed list of optimizations applied (e.g., 'Implemented Threaded Video Capture', 'Vectorized pixel loop')." }
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini Optimize Error:", e);
    return { fixedCode: code, explanation: "Failed to analyze code. Please check API Key or try again." };
  }
};

export const transpileToCpp = async (pythonCode: string): Promise<CppTranspilationResult> => {
    if (!ai) return { cppCode: "// API Key Missing", cmakeCode: "", explanation: "Could not transpile." };

    try {
        // Use Pro model for translation accuracy
        const prompt = `
        You are an expert Computer Vision Engineer. 
        Transpile the following Python OpenCV code to C++ (using cv::Mat).
        Also provide a CMakeLists.txt to compile it.
        
        Python Code:
        ${pythonCode}

        Return JSON: { "cppCode": "Full main.cpp content...", "cmakeCode": "CMakeLists.txt content...", "explanation": "Key changes and C++ specifics used (e.g., using references, efficient loops)." }
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
        return { cppCode: "// Transpilation Failed", cmakeCode: "", explanation: "Error during AI processing." };
    }
};

export const parsePythonToPipeline = async (pythonCode: string): Promise<{ nodes: PipelineNode[]; connections: PipelineConnection[] }> => {
    if (!ai) throw new Error("API Key Missing");

    const allDefs = [...AVAILABLE_NODES, ...MOCK_COMMUNITY_NODES];
    // Create a simplified registry for the AI
    const registry = allDefs.map(n => ({ id: n.id, pythonClass: n.pythonClass, name: n.name })).map(n => `- ${n.id} (${n.name}) matches python: ${n.pythonClass}`).join('\n');

    const prompt = `
    You are a Static Analysis Engine for a Node-Based Computer Vision tool.
    Your task is to REVERSE ENGINEER the provided Python code into a JSON Node Graph.

    NODE REGISTRY:
    ${registry}
    - src_webcam: cv2.VideoCapture(0)
    - src_file: cv2.VideoCapture("file")
    - out_screen: cv2.imshow
    - cv_blur: cv2.GaussianBlur
    - cv_gray: cv2.cvtColor(..., COLOR_BGR2GRAY)
    - cv_canny: cv2.Canny
    - mp_hands: mp.solutions.hands
    
    INSTRUCTIONS:
    1. Analyze the Python code to find function calls that match the Registry.
    2. Create a list of 'nodes'. 
       - If a block of code matches a registry item, use that 'defId'.
       - If a block of code is generic image processing but not in registry, use 'CUSTOM' node logic.
    3. Analyze variable flow to create 'connections'.
       - If Node A produces 'gray' and Node B takes 'gray' as input, create a connection A -> B.
    4. Auto-Layout: Calculate 'position' {x, y} for each node so they flow left-to-right (x increases by 250 for each step).
    5. Parameters: Extract constants (like kernel size (5,5)) and put them in 'params'.

    INPUT CODE:
    ${pythonCode}

    RETURN JSON:
    {
      "nodes": [ { "uuid": "unique_id", "defId": "registry_id", "position": { "x": 0, "y": 0 }, "params": {} } ],
      "connections": [ { "id": "conn_id", "sourceNodeId": "uuid_1", "targetNodeId": "uuid_2" } ]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Strong reasoning needed for AST simulation
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
