import { Association } from './association.interface';

export interface Model {
  _id: string;
  name: string;
  entities: string[];
  associations: Association[];
}
