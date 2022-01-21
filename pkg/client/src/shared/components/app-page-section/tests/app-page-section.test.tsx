import React from "react";
import { shallow } from "enzyme";
import { AppPageSection } from "../app-page-section";

describe("AppPageSection", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<AppPageSection />);
    expect(wrapper).toMatchSnapshot();
  });
});
