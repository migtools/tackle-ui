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
import { BrowserRouter as Router } from "react-router-dom";
import { mount, shallow } from "enzyme";
import { BreadCrumbPath } from "../breadcrumb-path";

describe("BreadCrumbPath", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <BreadCrumbPath
        breadcrumbs={[
          {
            title: "first",
            path: "/first",
          },
          {
            title: "second",
            path: "/second",
          },
          {
            title: "thrid",
            path: "/thrid",
          },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Given a function path, should callback", () => {
    const secondBreadcrumbSpy = jest.fn();

    const wrapper = mount(
      <Router>
        <BreadCrumbPath
          breadcrumbs={[
            {
              title: "first",
              path: "/first",
            },
            {
              title: "second",
              path: secondBreadcrumbSpy,
            },
            {
              title: "thrid",
              path: "/thrid",
            },
          ]}
        />
      </Router>
    );

    wrapper.find("button").simulate("click");
    expect(secondBreadcrumbSpy).toHaveBeenCalledTimes(1);
  });
});
