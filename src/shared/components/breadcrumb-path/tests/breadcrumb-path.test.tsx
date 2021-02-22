import React from "react";
import { shallow } from "enzyme";
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
});
