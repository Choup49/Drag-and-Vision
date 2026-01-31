
export enum NodeType {
  SOURCE = 'SOURCE',
  PROCESS = 'PROCESS',
  AI = 'AI',
  UTILITY = 'UTILITY',
  OUTPUT = 'OUTPUT',
  CUSTOM = 'CUSTOM',
  LOGIC = 'LOGIC'
}

export type Language = 'en' | 'fr';

export interface NodeDefinition {
  id: string;
  name: string;
  name_fr?: string;
  type: NodeType;
  description: string;
  description_fr?: string;
  category: 'input' | 'transform' | 'ai' | 'utility' | 'output' | 'custom' | 'logic';
  library: 'Core' | 'OpenCV' | 'MediaPipe' | 'Custom' | 'Logic';
  pythonClass: string;
  pythonTemplate: string;
  requiredImports?: string[];
  inputs: number;
  outputs: number; // 0, 1, or 2 (for Logic)
}

export interface Position {
  x: number;
  y: number;
}

export interface DroidCamConfig {
  ip: string;
  port: string;
}

export interface PipelineNode {
  uuid: string;
  defId: string;
  position: Position;
  params: {
    droidCam?: DroidCamConfig;
    [key: string]: any;
  };
}

export interface PipelineConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: 'main' | 'true' | 'false'; // Distinguish outputs
}

export interface Challenge {
  id: string;
  title: string;
  title_fr?: string;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Custom';
  theme: 'Basic' | 'Tracking' | 'Segmentation' | 'Creative';
  description: string;
  description_fr?: string;
  objectives: string[];
  objectives_fr?: string[];
  locked: boolean;
  isCompleted?: boolean;
  isUserCreated?: boolean;
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
