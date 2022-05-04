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
import { mount, shallow } from "enzyme";
import { EmptyTextMessage } from "shared/components";
import { Application } from "api/models";
import { ApplicationListExpandedArea } from "../application-list-expanded-area";

describe("ApplicationListExpandedArea", () => {
  it("Should shown 'not yet reviewed'", () => {
    const application: Application = {
      name: "anyApp",
    };

    const wrapper = shallow(
      <ApplicationListExpandedArea application={application} />
    );

    const notReviewed = "terms.notYetReviewed";
    expect(
      wrapper.find({ "cy-data": "proposed-action" }).children().props().message
    ).toBe(notReviewed);
    expect(
      wrapper.find({ "cy-data": "effort-estimate" }).children().props().message
    ).toBe(notReviewed);
    expect(
      wrapper.find({ "cy-data": "business-criticality" }).children().props()
        .message
    ).toBe(notReviewed);
    expect(
      wrapper.find({ "cy-data": "work-priority" }).children().props().message
    ).toBe(notReviewed);
    expect(
      wrapper.find({ "cy-data": "review-comments" }).children().props().message
    ).toBe(notReviewed);
  });

  it("Should shown values from Review", () => {
    const application: Application = {
      name: "anyApp",
      review: {
        proposedAction: "rehost",
        effortEstimate: "small",
        businessCriticality: 2,
        workPriority: 3,
        comments: "my review comments",
      },
    };

    const wrapper = shallow(
      <ApplicationListExpandedArea application={application} />
    );

    expect(
      wrapper
        .find({ "cy-data": "proposed-action" })
        .children()
        .children()
        .text()
    ).toBe("proposedActions.rehost");
    expect(
      wrapper.find({ "cy-data": "effort-estimate" }).children().text()
    ).toBe("efforts.small");
    expect(
      wrapper.find({ "cy-data": "business-criticality" }).children().text()
    ).toBe("2");
    expect(wrapper.find({ "cy-data": "work-priority" }).children().text()).toBe(
      "3"
    );
    expect(wrapper.find({ "cy-data": "risk" }).children().length).toBe(1);
    expect(
      wrapper.find({ "cy-data": "review-comments" }).children().text()
    ).toBe("my review comments");
  });
});
