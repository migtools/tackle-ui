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
import { renderHook, act } from "@testing-library/react-hooks";
import { useEntityModal } from "./useEntityModal";

describe("useEntityModal", () => {
  it("onCreate", () => {
    const { result } = renderHook(() => useEntityModal());

    //
    const { create } = result.current;
    act(() => create());
    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toBeUndefined();
  });

  it("onUpdate", () => {
    const ENTITY = "hello";

    const { result } = renderHook(() => useEntityModal<string>());

    //
    const { update } = result.current;
    act(() => update(ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);
  });

  it("Close after update", () => {
    const ENTITY = "hello";

    const { result } = renderHook(() => useEntityModal<string>());
    const { update, close } = result.current;

    // update
    act(() => update(ENTITY));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.data).toEqual(ENTITY);

    // close
    act(() => close());

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.data).toBeUndefined();
  });
});
