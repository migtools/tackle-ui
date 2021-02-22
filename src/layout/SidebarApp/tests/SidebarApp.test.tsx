import React from "react";
import { shallow } from "enzyme";
import { SidebarApp } from "../SidebarApp";

it("Test snapshot", () => {
  jest.mock("react-i18next", () => ({
    useTranslation: () => {
      return {
        t: (str: any) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
  }));

  const wrapper = shallow(<SidebarApp />);
  expect(wrapper).toMatchSnapshot();
});
