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
import {
  getQueryParamsAsObject,
  removeUndefined,
  objectToQueryParams,
  encodeValues,
} from "./helpers";

describe("Helpers", () => {
  it("getQueryParamsAsObject", () => {
    const result = getQueryParamsAsObject("?a=1&b=2&b=3&c");

    expect(result).toMatchObject({
      a: ["1"],
      b: ["2", "3"],
    });
  });

  it("removeUndefined", () => {
    const result = removeUndefined({
      a: "1",
      b: 1,
      c: undefined,
      d: true,
    });

    expect(result).toMatchObject({
      a: "1",
      b: 1,
      d: true,
    });
  });

  it("objectToQueryParams", () => {
    const result = objectToQueryParams({
      a: "1",
      b: ["x", "y"],
    });

    expect(result).toBe("?a=1&b=x&b=y");
  });

  it("encodeValues", () => {
    const result = encodeValues({
      a: ["red car", "big house"],
      b: ["one", "two"],
    });

    expect(result).toMatchObject({
      a: ["red%20car", "big%20house"],
      b: ["one", "two"],
    });
  });
});
