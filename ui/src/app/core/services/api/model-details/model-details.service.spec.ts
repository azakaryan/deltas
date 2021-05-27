import { TestBed } from '@angular/core/testing';
import { ModelDetailsService } from './model-details.service';
import {RestService} from "../rest.service";

describe('ModelDetailsService', () => {
  let modelDetailsService: ModelDetailsService;

  beforeEach(() => {
    const restServiceSpy = jasmine.createSpyObj('RestService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ModelDetailsService,
        { provide: RestService, useValue: restServiceSpy }
      ]
    });
    modelDetailsService = TestBed.inject(ModelDetailsService);
  });

  it('should be created', () => {
    expect(modelDetailsService).toBeTruthy();
  });
});
