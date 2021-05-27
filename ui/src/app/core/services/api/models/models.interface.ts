export interface ModelResponse {
  message: string;
  model?: Model;
  models?: Model[];
}

export interface Model {
  id: string;
  name: string;
}

export interface ModelUrlParams {
  modelId: string;
}

