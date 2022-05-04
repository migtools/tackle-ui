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
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { renderHook } from "@testing-library/react-hooks";
import { useDecodedLocation } from "./useDecodedLocation";

describe("useDecodedLocation", () => {
  it("Decodes 'search' and converts queryParams to Object", () => {
    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=my%20application1&name=my%20application2&description=my%20description",
      ],
    });

    // Hook
    const { result } = renderHook(() => useDecodedLocation(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current).toMatchObject({
      pathname: "/myurl",
      search: {
        name: ["my application1", "my application2"],
        description: ["my description"],
      },
    });
  });
});
