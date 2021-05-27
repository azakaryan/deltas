import {Model} from "../models/models.interface";

export interface Association {
  name: string;
  source: string;
  target: string;
  id?: string;
}

export interface Attribute {
  name: string;
  type: string;
  id?: string;
}

export interface Entity {
  name: string;
  attributes: Attribute[];
  id?: string;
  modelId?: string;
}

export interface ModelDetails extends Model {
  entities: Entity[];
  associations: Association[];
}

export interface ModelDetailsResponse {
  message: string;
  model: ModelDetails;
}

