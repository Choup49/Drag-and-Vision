
export enum NodeType {
  SOURCE = 'SOURCE',
  PROCESS = 'PROCESS',
  AI = 'AI',
  UTILITY = 'UTILITY',
  OUTPUT = 'OUTPUT',
  CUSTOM = 'CUSTOM'
}

export type Language = 'en' | 'fr';

export interface NodeDefinition {
  id: string;
  name: string;
  name_fr?: string;
  type: NodeType;
  description: string;
  description_fr?: string;
  category: 'input' | 'transform' | 'ai' | 'utility' | 'output' | 'custom';
  library: 'Core' | 'OpenCV' | 'MediaPipe' | 'Custom' | 'Community' | 'Connectivity' | 'GenAI';
  pythonClass: string;
  pythonTemplate: string;
  requiredImports?: string[];
  inputs: number;
  outputs: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface ApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  headers: { id: string; key: string; value: string; isSecret: boolean }[];
  timeout: number;
  sendImage: boolean;
  imageResizeWidth?: number; // 0 for no resize
  asyncMode: boolean;
}

export interface DroidCamConfig {
  ip: string;
  port: string;
}

export interface OnnxConfig {
  modelPath: string;
}

export interface PipelineNode {
  uuid: string;
  defId: string;
  position: Position;
  params: Record<string, any>; // Stores ApiConfig, DroidCamConfig, OnnxConfig, etc.
}

export interface PipelineConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface Challenge {
  id: string;
  title: string;
  title_fr?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Custom';
  theme: 'Basic' | 'Tracking' | 'Segmentation' | 'Optimization' | 'Creative' | 'Community';
  description: string;
  description_fr?: string;
  objectives: string[];
  objectives_fr?: string[];
  locked: boolean;
  isUserCreated?: boolean;
  // New fields for progress tracking
  isCompleted?: boolean;
  completionDate?: string | null;
}

export interface OptimizerConfig {
  resolutionScale: number; // 0.1 to 1.0
  frameSkip: number; // 0 to 10
  useThreading: boolean;
  enableCuda: boolean;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  hint?: string;
}

export interface CppTranspilationResult {
  cppCode: string;
  cmakeCode: string;
  explanation: string;
}

export type ViewState = 'STUDIO' | 'CHALLENGES' | 'EDITOR' | 'CHALLENGE_WORKSPACE' | 'CORRECTOR';
