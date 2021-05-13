import { shallow } from "enzyme";

import { ApplicationDetails } from "../application-details";
import { Application, Assessment, AssessmentStatus } from "api/models";

describe("AppTable", () => {
  it("Renders without crashing", () => {
    const application: Application = {
      name: "myApp",
      description: "myDescription",
    };

    const assessment: Assessment = {
      applicationId: 1,
      status: "COMPLETE",
      questionnaire: {
        categories: [
          { id: 1, order: 1, questions: [], comment: "comments1" },
          { id: 2, order: 2, questions: [], comment: "comments2" },
          { id: 3, order: 3, questions: [], comment: "comments3" },
        ],
      },
    };
    const wrapper = shallow(
      <ApplicationDetails application={application} assessment={assessment} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
