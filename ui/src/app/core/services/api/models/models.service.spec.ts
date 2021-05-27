import { TestBed } from '@angular/core/testing';
import { ModelsService } from './models.service';
import {RestService} from "../rest.service";

describe('ModelsService', () => {
  let service: ModelsService;

  beforeEach(() => {
    const restServiceSpy = jasmine.createSpyObj('RestService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ModelsService,
        { provide: RestService, useValue: restServiceSpy }
      ]
    });
    service = TestBed.inject(ModelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
