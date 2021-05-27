import { model, Schema, Document } from 'mongoose';
import { Model } from '../interfaces/model.interface';

const associationSchema = new Schema({
  name: { type: String, required: true },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Entity',
  },
});

const modelSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  entities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Entity',
    },
  ],
  associations: [associationSchema],
});

const ModelModel = model<Model & Document>('Model', modelSchema);

export default ModelModel;
