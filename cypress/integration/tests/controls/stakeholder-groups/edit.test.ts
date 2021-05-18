/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { StakeholderGroup } from "../../../models/stakeholder-group";

describe("Edit stakeholder group", () => {
  const stakeholderGroup = new StakeholderGroup();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "StakeholderGroup");

      const stakeholders = [];

      cy.log("")
        .then(() => {
          // Stakeholders for dropdown
          return [...Array(3)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Stakeholder", "POST", payload).then(
                (responseData) => {
                  stakeholders.push(responseData);
                }
              );
            });
        })
        .then(() => {
          // Stakeholder group to edit
          return cy.api_crud(tokens, "StakeholderGroup", "POST", {
            name: "group-a",
            stakeholders: stakeholders.slice(0, 1),
          });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroups"
    );
    cy.intercept("PUT", "/api/controls/stakeholder-group/*").as(
      "putStakeholderGroup"
    );
  });

  it("Name and description", () => {
    stakeholderGroup.edit(0, {
      name: "newName",
      description: "newDescription",
    });
    cy.wait("@putStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Members", () => {
    stakeholderGroup.edit(0, {
      name: "newName",
      members: ["stakeholder-b", "stakeholder-c"],
    });
    cy.wait("@putStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "3");
  });
});
