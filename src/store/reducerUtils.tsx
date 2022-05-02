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
import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./rootReducer";

export const mockStore = (initialStatus?: any) =>
  initialStatus
    ? createStore(rootReducer, initialStatus, applyMiddleware(thunk))
    : createStore(rootReducer, applyMiddleware(thunk));

export const mountWithRedux = (component: any, store: any = mockStore()) =>
  mount(<Provider store={store}>{component}</Provider>);
