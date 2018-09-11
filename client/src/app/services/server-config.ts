import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverURL } from '@services/config';

@Injectable()
export class ServerConfigService {

  constructor(private http: HttpClient) { }

  async getConfig(): Promise<ApiServerConfig> {
    return this.http.get<ApiServerConfig>(`${serverURL}/server-config`).toPromise();
  }

  async update(config: ApiServerConfigUpdate): Promise<ApiServerConfig> {
    return this.http.put<ApiServerConfig>(`${serverURL}/server-config`, config).toPromise();
  }

}
