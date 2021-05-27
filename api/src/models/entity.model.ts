import { model, Schema, Document } from 'mongoose';
import { Entity } from '../interfaces/entity.interface';

const attributeSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const entitySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  attributes: [attributeSchema],
  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model',
  },
});

const EntityModel = model<Entity & Document>('Entity', entitySchema);

export default EntityModel;
