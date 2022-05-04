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
/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { AssessmentReviewPage } from "../../../models/assessment";

describe("Assessment: answer questionnaire", () => {
  const assessmentReviewPage = new AssessmentReviewPage();

  let applicationToEdit;
  let assessmentToEdit;

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "StakeholderGroup");
      cy.api_clean(tokens, "Application");

      cy.log("")
        .then(() => {
          // Create application with assessment
          return cy
            .api_crud(tokens, "Application", "POST", { name: "application-1" })
            .then((responseDataApp) => {
              applicationToEdit = responseDataApp;
              return cy
                .api_crud(tokens, "Assessment", "POST", {
                  applicationId: responseDataApp.id,
                })
                .then((responseDataAssessment) => {
                  assessmentToEdit = responseDataAssessment;
                });
            });
        })
        .then(() => {
          return cy.then(() => {
            // Create stakeholder for questionnaire
            return cy.api_crud(tokens, "Stakeholder", "POST", {
              email: "email-a@domain.com",
              displayName: "stakeholder-a",
            });
          });
        })
        .then(() => {
          return cy.then(() => {
            // Create stakeholder group for questionnaire
            return cy.api_crud(tokens, "StakeholderGroup", "POST", {
              name: "group-a",
            });
          });
        });
    });
  });

  it("Not found assessment", () => {
    assessmentReviewPage.openAssessmentPage(-1);

    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("Not available");
  });

  it("Answer questionnaire with stakeholder", () => {
    assessmentReviewPage.fillQuestionnaire(assessmentToEdit.id, {
      stakeholders: ["stakeholder-a"],
      stakeholderGroups: [],
      categories: [
        { answerIndex: 0 },
        { answerIndex: 1 },
        { answerIndex: 2 },
        { answerIndex: 3 },
        { answerIndex: 4 },
      ],
    });

    cy.url().should(
      "match",
      new RegExp("/application-inventory/application-list*")
    );
  });

  it("Answer questionnaire with stakeholder group", () => {
    assessmentReviewPage.fillQuestionnaire(assessmentToEdit.id, {
      stakeholders: [],
      stakeholderGroups: ["group-a"],
      categories: [
        { answerIndex: 0 },
        { answerIndex: 1 },
        { answerIndex: 2 },
        { answerIndex: 3 },
        { answerIndex: 4 },
      ],
    });

    cy.url().should(
      "match",
      new RegExp("/application-inventory/application-list*")
    );
  });

  it("Answer questionnaire and then 'Review'", () => {
    assessmentReviewPage.fillQuestionnaireAndReview(assessmentToEdit.id, {
      stakeholders: [],
      stakeholderGroups: ["group-a"],
      categories: [
        { answerIndex: 0 },
        { answerIndex: 1 },
        { answerIndex: 2 },
        { answerIndex: 3 },
        { answerIndex: 4 },
      ],
    });

    cy.url().should(
      "match",
      new RegExp(
        `/application-inventory/application/${applicationToEdit.id}/review`
      )
    );
  });
});
