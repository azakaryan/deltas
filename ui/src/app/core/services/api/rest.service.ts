import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as config } from '../../../../environments/environment';

/**
 * Rest is a generic REST Api handler. Set your API url first from config.
 */

@Injectable()
export class RestService {
  private url = `${config.api.protocol}://${config.api.host}:${config.api.port}/${config.api.version}`;

  constructor(private http: HttpClient) {}

  public get(endpoint: string, opt: any = {}): Observable<any> {
    return this.http.get(this.url + '/' + endpoint, opt);
  }

  public post(endpoint: string, opt: any = {}, headers: any = {}, params: any = {}): Observable<any> {
    return this.http.post(this.url + '/' + endpoint, opt, { headers, params });
  }

  public delete(endpoint: string, opt: any = {}): Observable<any> {
    return this.http.delete(this.url + '/' + endpoint, opt);
  }
}
