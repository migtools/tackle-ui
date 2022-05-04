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
          {
            id: 1,
            order: 1,
            questions: [],
            title: "title1",
            comment: "comments1",
          },
          {
            id: 2,
            order: 2,
            questions: [],
            title: "title2",
            comment: "comments2",
          },
          {
            id: 3,
            order: 3,
            questions: [],
            title: "title3",
            comment: "comments3",
          },
        ],
      },
    };
    const wrapper = shallow(
      <ApplicationDetails application={application} assessment={assessment} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
