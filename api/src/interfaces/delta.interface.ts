import { Attribute } from './attribute.interface';
import { Entity } from './entity.interface';
import { Association } from './association.interface';

export enum Operation {
  Add = 'add',
  Replace = 'replace',
  Remove = 'remove',
}

export interface Delta {
  op: Operation;
  path: string;
  value: string | Entity | Attribute | Association;
}
