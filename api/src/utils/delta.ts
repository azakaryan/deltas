import { Delta } from '../interfaces/delta.interface';
import { ClientSession, Document } from 'mongoose';
import { Association } from '../interfaces/association.interface';
import HttpException from '../exceptions/HttpException';
import { Attribute } from '../interfaces/attribute.interface';
import { Entity } from '../interfaces/entity.interface';

export class DeltaHandlerService {
  // Entity name(key) -> id(value) pair.
  // It's required to handle cases when active entities(entities referenced by existing associations) are being removed.
  private removedEntities: { [key: string]: string } = {};

  constructor(private modelDocument: any, private entityModel: any, private session: ClientSession) {}

  async applyPatch(deltas: Delta[]): Promise<void> {
    for (let i = 0; i < deltas.length; i++) {
      await this.applyDelta(deltas[i]);
      await this.saveModelDocument();
    }
  }

  /*
   * Private Methods
   * */
  private async saveModelDocument(): Promise<void> {
    return this.modelDocument.save({ session: this.session });
  }

  private applyDelta(delta: Delta): Promise<void> {
    // NOTE: The order is important here. attributes should be the first.
    if (delta.path.includes('attributes')) return this.applyAttributeDelta(delta);
    if (delta.path.includes('entities')) return this.applyEntityDelta(delta);
    if (delta.path.includes('associations')) return this.applyAssociationDelta(delta);

    // Updates the name of the model.
    this.modelDocument.set('name', delta.value);
  }

  private async applyAttributeDelta({ op, path, value }: Delta): Promise<void> {
    const pathChunks: string[] = path.split('/');
    const entityDocument = await this.entityModel
      .findOne({ _id: this.modelDocument.entities[+pathChunks[2]], model: this.modelDocument })
      .session(this.session);

    if (!entityDocument) throw new HttpException(404, 'Entity not found');
    const attribute = entityDocument.attributes[+pathChunks[4]]; // NOTE: attribute is not defined for case 'add'.

    if (op === 'add') {
      entityDocument.attributes.push({ name: (<Attribute>value).name, type: (<Attribute>value).type });
    } else if (op === 'remove') {
      entityDocument.attributes.pull({ _id: attribute._id });
    } else if (op === 'replace') {
      if (path.includes('name')) {
        attribute.set('name', value);
      } else if (path.includes('type')) {
        attribute.set('type', value);
      }
    }

    await entityDocument.save({ session: this.session });
  }

  private async applyEntityDelta({ op, path, value }: Delta): Promise<void> {
    if (op === 'add') {
      const { name } = <Entity>value;
      const entity = await this.entityModel.findOne({ model: this.modelDocument, name }).session(this.session);
      if (entity) throw new HttpException(409, `Entity with name ${value} already exists.`);

      const attributes = (<Entity>value).attributes.map(({ name, type }) => {
        if (!name || !type) throw new HttpException(409, 'Both name and type of Attribute are required');
        return { name, type };
      });

      const newEntity = new this.entityModel({ model: this.modelDocument._id, name, attributes });
      await newEntity.save({ session: this.session });

      this.modelDocument.entities.push(newEntity);
      return;
    }

    const entityId = this.modelDocument.entities[+path.split('/')[2]];
    if (!entityId) throw new HttpException(404, 'Entity not found');
    const entity = await this.entityModel.findById(entityId).session(this.session);
    if (!entity) throw new HttpException(404, 'Entity not found');

    if (op === 'remove') {
      await this.entityModel.findByIdAndRemove(entityId, { session: this.session });
      this.modelDocument.entities.pull({ _id: entityId });
      this.removedEntities[entity.name] = entityId;
      return;
    }

    if (op === 'replace' && path.includes('name')) {
      entity.set('name', value);
      entity.save({ session: this.session });
      const removedEntityId = this.removedEntities[<string>value];
      if (removedEntityId) {
        this.modelDocument.associations.forEach((association: Document) => {
          if (association.get('source')?.toString() === removedEntityId.toString()) association.set('source', entityId);
          if (association.get('target')?.toString() === removedEntityId.toString()) association.set('target', entityId);
        });
        delete this.removedEntities[<string>value];
      }
      return;
    }
  }

  private async applyAssociationDelta({ op, path, value }: Delta): Promise<void> {
    if (op === 'add') {
      if (typeof value === 'object' && value !== null) {
        if ((<Association>value).source === (<Association>value).target) {
          throw new HttpException(409, 'Source and target should be different');
        }
        this.validateDuplicateAssociationName(this.modelDocument.associations, (<Association>value).name);
        const entities = await this.entityModel.find({
          $and: [
            { model: this.modelDocument },
            { $or: [{ name: (<Association>value).source }, { name: (<Association>value).target }] },
          ],
        }).session(this.session);

        const source = entities.find(({ name }) => name === (<Association>value).source);
        const target = entities.find(({ name }) => name === (<Association>value).target);
        return this.modelDocument.associations.push({ name: (<Association>value).name, source, target });
      }
    }

    const association: Document = this.modelDocument.associations[+path.split('/')[2]];
    if (!association) throw new HttpException(404, 'Association not found');

    if (op === 'remove') return this.modelDocument.associations.pull({ _id: association._id });

    if (op === 'replace' || (op === 'add' && (typeof value !== 'object' || value === null))) {
      if (path.includes('name')) {
        this.validateDuplicateAssociationName(this.modelDocument.associations, <string>value);
        association.set('name', <string>value);
        return;
      }

      let entity = null;
      if (value) {
        entity = await this.entityModel.findOne({ model: this.modelDocument, name: <string>value }).session(this.session);
        if (!entity) throw new HttpException(404, 'Target not found');
      }

      if (path.includes('source')) {
        if (value && association.get('target').toString() === entity._id.toString()) {
          throw new HttpException(409, 'Source and target should be different');
        }
        association.set('source', entity);
        return;
      }

      if (path.includes('target')) {
        if (value && association.get('source').toString() === entity._id.toString()) {
          throw new HttpException(409, 'Source and target should be different');
        }
        association.set('target', entity);
        return;
      }
    }
  }

  private validateDuplicateAssociationName(associations: Association[], associationName: string): void {
    if (associations.find(({ name }) => name === associationName)) {
      throw new HttpException(409, `Association with name ${associationName} already exists.`);
    }
  }

  private isRemovedEntitiesEmpty(): boolean {
    return Object.keys(this.removedEntities).length === 0;
  }
}
