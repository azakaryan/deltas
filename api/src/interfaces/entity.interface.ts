import { Attribute } from './attribute.interface';

export interface Entity {
  _id?: string;
  name: string;
  attributes: Attribute[];
  model: string;
}
