import { CreateModelDto, UpdateModelDto } from '../dtos/models.dto';
import HttpException from '../exceptions/HttpException';
import { Model } from '../interfaces/model.interface';
import ModelModel from '../models/model.model';
import { isEmpty } from '../utils/util';
import EntityModel from '../models/entity.model';
import { DeltaHandlerService } from '../utils/delta';
import { ClientSession, Document } from 'mongoose';

class ModelsService {
  public models = ModelModel;
  public entities = EntityModel;

  public async findAllModels(): Promise<Model[]> {
    const models: Model[] = await this.models.find();
    return models;
  }

  public async findModelById(modelId: string): Promise<Model> {
    const findModel: Model = await this.models
      .findById(modelId)
      .populate('entities')
      .populate({
        path: 'associations',
        populate: {
          path: 'source',
          model: 'Entity',
          select: 'name',
        },
      })
      .populate({
        path: 'associations',
        populate: {
          path: 'target',
          model: 'Entity',
          select: 'name',
        },
      });

    if (!findModel) throw new HttpException(404, 'Model not found');

    return findModel;
  }

  public async createModel(modelData: CreateModelDto): Promise<Model> {
    if (isEmpty(modelData)) throw new HttpException(400, 'modelData is required');

    const findModel: Model = await this.models.findOne({ name: modelData.name });
    if (findModel) throw new HttpException(409, `model with name ${findModel.name} already exists`);

    const createModelData: Model = await this.models.create({ name: modelData.name, entities: [], associations: [] });

    return await this.findModelById(createModelData._id);
  }

  public async updateModel(modelId: string, modelData: UpdateModelDto): Promise<Model> {
    const { deltas } = modelData;
    if (!deltas?.length) throw new HttpException(400, 'deltas are required');

    const session: ClientSession = await this.models.startSession();
    session.startTransaction();

    try {
      const modelDocument: Document = await this.models.findOne({ _id: modelId });

      const deltaHandlerService: DeltaHandlerService = new DeltaHandlerService(modelDocument, this.entities, session);
      await deltaHandlerService.applyPatch(deltas);

      await session.commitTransaction();
      console.log('Transaction Committed');
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction Aborted', error);
      throw new HttpException(400, 'invalid deltas');
    } finally {
      await session.endSession();
      console.log('Closing the session');
    }

    return await this.findModelById(modelId);
  }

  public async deleteModel(modelId: string): Promise<Model> {
    const deleteModelById: Model = await this.models.findByIdAndDelete(modelId);
    if (!deleteModelById) throw new HttpException(404, 'not found');

    return deleteModelById;
  }
}

export default ModelsService;
