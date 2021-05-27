import mongoose from 'mongoose';
import request from 'supertest';
import App from '../app';
import ModelsRoute from '../routes/models.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Models', () => {
  describe('GET /models', () => {
    it('response All Models', () => {
      const modelsRoute = new ModelsRoute();
      modelsRoute.modelsController.modelsService.models.find = jest.fn().mockReturnValue(
        Promise.resolve([
          {
            name: 'Model 1',
          },
        ]),
      );

      (mongoose as any).connect = jest.fn().mockResolvedValue(200);
      const app = new App([modelsRoute]);
      return request(app.getServer()).get(`/v1${modelsRoute.path}`).expect(200);
    });
  });
});
