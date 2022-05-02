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
export const getQueryParamsAsObject = (search: string) => {
  const params: Record<string, string[]> = {};
  new URLSearchParams(search).forEach((value, key) => {
    const currentValue = params[key] || [];
    params[key] = [...currentValue, value];
  });
  return params;
};

export const removeUndefined = <T extends Record<string, any>>(obj: T) =>
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: obj[key],
      };
    }, {} as Record<string, any>);

export const objectToQueryParams = (
  params: Record<string, string | string[]>
) => {
  const query: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (value !== undefined && value !== null) {
      let queryParamValues: string[] = [];
      if (Array.isArray(value)) {
        queryParamValues = value;
      } else {
        queryParamValues = [value];
      }
      queryParamValues.forEach((v) => query.push(`${key}=${v}`));
    }
  });

  return "?" + query.join("&");
};

export const encodeValues = (obj: Record<string, string[]>) =>
  Object.keys(removeUndefined(obj)).reduce((acc, key) => {
    return {
      ...acc,
      [key]: obj[key] && obj[key].map((f) => encodeURIComponent(f)),
    };
  }, {} as Record<string, string[]>);
