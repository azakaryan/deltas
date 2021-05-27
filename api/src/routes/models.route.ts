import { Router } from 'express';
import Route from '../interfaces/route.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import ModelsController from '../controllers/models.controller';
import { CreateModelDto, UpdateModelDto } from '../dtos/models.dto';

class ModelsRoute implements Route {
  public path = '/models';
  public router = Router();
  public modelsController = new ModelsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.modelsController.getModels);
    this.router.get(`${this.path}/:id`, this.modelsController.getModelById);
    this.router.post(`${this.path}`, validationMiddleware(CreateModelDto, 'body'), this.modelsController.createModel);
    this.router.post(`${this.path}/:id/deltas`, validationMiddleware(UpdateModelDto, 'body'), this.modelsController.updateModelDeltas);
    this.router.delete(`${this.path}/:id`, this.modelsController.deleteModel);
  }
}

export default ModelsRoute;
