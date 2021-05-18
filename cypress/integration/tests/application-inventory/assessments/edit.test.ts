/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Assessment } from "../../../models/assessment";

describe("Create new business service", () => {
  const assessment = new Assessment();

  let assessmentToEdit;

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");

      cy.log("").then(() => {
        // Create application with assessment
        return cy
          .api_crud(tokens, "Application", "POST", { name: "application-1" })
          .then((responseDataApp) =>
            cy
              .api_crud(tokens, "Assessment", "POST", {
                applicationId: responseDataApp.id,
              })
              .then((responseDataAssessment) => {
                assessmentToEdit = responseDataAssessment;
              })
          );
      });
    });
  });

  it("Not found assessment", () => {
    assessment.openPage(-1);

    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("Not available");
  });

  it("Answer questionnaire", () => {
    assessment.edit(assessmentToEdit.id, {
      categories: [
        {
          answerIndex: 0,
        },
        {
          answerIndex: 1,
        },
        {
          answerIndex: 2,
        },
        {
          answerIndex: 3,
        },
        {
          answerIndex: 4,
        },
      ],
    });

    cy.url().should(
      "match",
      new RegExp("/application-inventory/application-list*")
    );
  });
});
