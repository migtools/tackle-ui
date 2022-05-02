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
import { shallow, mount } from "enzyme";
import { global_palette_blue_300 as blue } from "@patternfly/react-tokens";
import { Color } from "../color";

describe("Color", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<Color hex="#FFF" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("Applies hex color style", () => {
    const wrapper = mount(<Color hex="#FFF" />);

    expect(
      wrapper.find('div[cy-data="color-box"]').prop("style")
    ).toHaveProperty("backgroundColor", "#FFF");
  });

  it("Applies color label with lowercase hex", () => {
    const wrapper = mount(<Color hex={blue.value.toLowerCase()} />);

    expect(wrapper.find('span[cy-data="color-label"]').text()).toEqual(
      "colors.blue"
    );
  });

  it("Applies color label with upercase hex", () => {
    const wrapper = mount(<Color hex={blue.value.toUpperCase()} />);

    expect(wrapper.find('span[cy-data="color-label"]').text()).toEqual(
      "colors.blue"
    );
  });

  it("Applies color hex code", () => {
    const wrapper = mount(<Color hex={"#fff"} />);

    expect(wrapper.find('span[cy-data="color-label"]').text()).toEqual("#fff");
  });
});
