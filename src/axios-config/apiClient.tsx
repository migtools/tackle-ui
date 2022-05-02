/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import axios, { AxiosPromise } from "axios";

export class APIClient {
  public static request<T>(
    path: string,
    body: any = null,
    method:
      | "get"
      | "post"
      | "put"
      | "delete"
      | "options"
      | "patch"
      | undefined = "get",
    config = {}
  ): AxiosPromise<T> {
    return axios.request<T>(
      Object.assign(
        {},
        {
          url: path,
          method,
          data: body,
        },
        config
      )
    );
  }

  public static post<T>(path: string, body: any, config = {}): AxiosPromise<T> {
    return this.request<T>(path, body, "post", config);
  }

  public static put<T>(path: string, body: any, config = {}): AxiosPromise<T> {
    return this.request<T>(path, body, "put", config);
  }

  public static patch<T>(
    path: string,
    body: any,
    config = {}
  ): AxiosPromise<T> {
    return this.request<T>(path, body, "patch", config);
  }

  public static get<T>(path: string, config = {}): AxiosPromise<T> {
    return this.request<T>(path, null, "get", config);
  }

  public static delete(path: string, config = {}) {
    return this.request(path, null, "delete", config);
  }
}
