import { TestBed } from '@angular/core/testing';
import {HttpClient} from "@angular/common/http";
import {RestService} from "./rest.service";

describe('ModelsService', () => {
  let service: RestService;

  beforeEach(() => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        RestService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
