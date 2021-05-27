import { NextFunction, Request, Response } from 'express';
import ModelsService from '../services/models.service';
import { Model } from '../interfaces/model.interface';
import { CreateModelDto, UpdateModelDto } from '../dtos/models.dto';

class ModelsController {
  public modelsService = new ModelsService();

  public getModels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const models: Model[] = await this.modelsService.findAllModels();
      res.status(200).json({ models, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getModelById = async (req: Request, res: Response, next: NextFunction) => {
    const modelId: string = req.params.id;

    try {
      const model: Model = await this.modelsService.findModelById(modelId);
      res.status(200).json({ model, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createModel = async (req: Request, res: Response, next: NextFunction) => {
    const modelData: CreateModelDto = req.body;

    try {
      const model: Model = await this.modelsService.createModel(modelData);
      res.status(201).json({ model, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateModelDeltas = async (req: Request, res: Response, next: NextFunction) => {
    const modelId: string = req.params.id;
    const modelData: UpdateModelDto = req.body;

    try {
      const model: Model = await this.modelsService.updateModel(modelId, modelData);
      res.status(200).json({ model, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // This is an extra feature.
  public deleteModel = async (req: Request, res: Response, next: NextFunction) => {
    const modelId: string = req.params.id;

    try {
      const model: Model = await this.modelsService.deleteModel(modelId);
      res.status(200).json({ model, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ModelsController;
