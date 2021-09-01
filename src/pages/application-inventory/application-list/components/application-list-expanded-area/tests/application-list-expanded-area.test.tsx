import React from "react";
import { mount, shallow } from "enzyme";
import { ApplicationListExpandedArea } from "../application-list-expanded-area";
import { Application } from "api/models";

const notReviewed = "terms.notYetReviewed";
const ddQuery = (cyKey: string) => {
  return `dd[cy-data='${cyKey}'] > div`;
};

describe("ApplicationListExpandedArea", () => {
  it("Should shown 'not yet reviewed'", () => {
    const application: Application = {
      name: "anyApp",
    };

    const wrapper = mount(
      <ApplicationListExpandedArea application={application} />
    );

    expect(wrapper.find(ddQuery("proposed-action")).text()).toBe(notReviewed);
    expect(wrapper.find(ddQuery("effort-estimate")).text()).toBe(notReviewed);
    expect(wrapper.find(ddQuery("business-criticality")).text()).toBe(
      notReviewed
    );
    expect(wrapper.find(ddQuery("work-priority")).text()).toBe(notReviewed);
    expect(wrapper.find(ddQuery("review-comments")).text()).toBe(notReviewed);
  });

  it("Should review values 'not yet reviewed'", () => {
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

    const wrapper = mount(
      <ApplicationListExpandedArea application={application} />
    );

    expect(wrapper.find(ddQuery("proposed-action")).text()).toBe(
      "proposedActions.rehost"
    );
    expect(wrapper.find(ddQuery("effort-estimate")).text()).toBe("Small");
    expect(wrapper.find(ddQuery("business-criticality")).text()).toBe("2");
    expect(wrapper.find(ddQuery("work-priority")).text()).toBe("3");
    expect(wrapper.find(ddQuery("review-comments")).text()).toBe(
      "my review comments"
    );
  });
});
