import 'dotenv/config';
import App from './app';
import ModelsRoute from './routes/models.route';
import ModelModel from './models/model.model';
import EntityModel from './models/entity.model';
import axios from 'axios';
import { strict as assert } from 'assert';
import { compare } from 'fast-json-patch';
import { Delta } from './interfaces/delta.interface';
import { Model } from './interfaces/model.interface';
import { Entity } from './interfaces/entity.interface';

const app = new App([new ModelsRoute()]);
const server = app.listen();

const baseUrl = 'http://127.0.0.1:3000/v1/models';
const modelTestData = {
  "name": "MyFirstModel",
  "entities": [
    {
      "name": "Person",
      "attributes": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "hairColor",
          "type": "string"
        }
      ]
    },
    {
      "name": "Company",
      "attributes": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "country",
          "type": "string"
        }
      ]
    },
    {
      "name": "WebSite",
      "attributes": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        }
      ]
    }
  ],
  "associations": [
    {
      "name": "worksFor",
      "source": "Person",
      "target": "Company"
    },
    {
      "name": "hasSite",
      "source": "Person",
      "target": "WebSite"
    }
  ]
};
const frontendGeneratedDeltasForRemoveEntityCompany: Delta[] = [
  {
    "op": "remove",
    "path": "/entities/2"
  },
  {
    "op": "replace",
    "path": "/entities/1/attributes/1/name",
    "value": "url"
  },
  {
    "op": "replace",
    "path": "/entities/1/name",
    "value": "WebSite"
  },
  {
    "op": "replace",
    "path": "/associations/0/target",
    "value": null
  }
]

function getDiff(originalDoc, newDoc): Delta[] {
  const deltas = compare(originalDoc, newDoc);
  // To make sure all 'associations' operations comes at the very end have to rearrange them using filters
  // Note the order of each operation is important thus simple sort may not always work.
  const associationOps = deltas.filter((delta: Delta) => delta.path.includes('associations'));
  const otherOps = deltas.filter((delta: Delta) => !delta.path.includes('associations'));

  return <Delta[]>[...otherOps, ...associationOps];
}
function normalizeModelData(model: any): any {
  return {
    name: model.name,
    entities: model.entities.map(({name, attributes}) => ({name, attributes: attributes.map(({name, type}) => ({name, type}))})),
    associations: model.associations.map(({name, source, target}) => ({name, source: source.name, target: target.name})),
  };
}
async function resetDB(): Promise<void> {
  console.log('Resetting models...');
  await ModelModel.remove();
  console.log('Resetting entities...');
  await EntityModel.remove();
}
async function createModel(name: string): Promise<void> {
  console.log('Creating model...');
  const { status, data } = await axios.post(baseUrl, { name });
  assert.ok(status === 201);
  assert.ok(data.message === 'created');
}
async function getExistingModelId(): Promise<Model> {
  console.log('Creating model...');
  const { status, data } = await axios.get(baseUrl);
  assert.ok(status === 200);
  assert.ok(data.message === 'findAll');
  assert.ok(Array.isArray(data.models));
  assert.ok(data.models.length === 1);
  assert.ok(data.models[0].name === modelTestData.name);
  return data.models[0];
}
async function updateModel(modelId: string, deltas: Delta[]): Promise<Model> {
  console.log('updating model...');
  const { status, data } = await axios.post(`${baseUrl}/${modelId}/deltas`, { deltas });
  assert.ok(status === 200);
  assert.ok(data.message === 'updated');
  assert.ok(typeof data.model === 'object' && data.model !== null);
  assert.ok(data.model.entities);
  return data.model;
}

async function main(): Promise<void> {
  try {
    // Step 1: create a model based on the previously speciﬁed JSON
    await resetDB();
    await createModel(modelTestData.name);
    const model: Model = await getExistingModelId();
    const deltas = getDiff(normalizeModelData(model), modelTestData);
    const responseModelStep1 = await updateModel(model._id, deltas);
    const normalizedData = normalizeModelData(responseModelStep1);
    assert.deepEqual(modelTestData, normalizedData);

    // Step 2 removes the entity called Company
    const responseModelStep2: any = await updateModel(model._id, frontendGeneratedDeltasForRemoveEntityCompany);
    assert.ok(responseModelStep2.entities.length === 2);
    assert.ok(!responseModelStep2.entities.find((e: Entity) => e.name === 'Company'));
    assert.ok(responseModelStep2.associations[0].target === null);

    // Step 3 change the value of the attribute name of entity WebSite
    assert.ok(responseModelStep2.entities[1].attributes[0].name === 'name');
    const responseModelStep3: any = await updateModel(model._id, [{
      "op": "replace",
      "path": "/entities/1/attributes/0/name",
      "value": "new name"
    }]);
    assert.ok(responseModelStep3.entities[1].attributes[0].name === 'new name');

    console.log('🟢 Successfully finished');
  } catch (error) {
    console.error('🔴 ', error);
  } finally {
    console.log('Press COMMAND + D to exit.');
    server.close();
  }
}

main();
