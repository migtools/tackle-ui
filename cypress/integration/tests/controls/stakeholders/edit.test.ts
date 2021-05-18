/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Stakeholder } from "../../../models/stakeholder";

describe("Edit stakeholder", () => {
  const stakeholder = new Stakeholder();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "JobFunction");
      cy.api_clean(tokens, "StakeholderGroup");

      const stakeholderGroups = [];

      cy.log("")
        .then(() => {
          // Job functions for dropdown
          return [
            {
              role: "Business Analyst",
            },
            {
              role: "Consultant",
            },
            {
              role: "DBA",
            },
          ].forEach((payload) => {
            cy.api_crud(tokens, "JobFunction", payload);
          });
        })
        .then(() => {
          // Stakeholders groups for dropdown
          return [...Array(3)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "StakeholderGroup",
                payload
              ).then((responseData) => stakeholderGroups.push(responseData));
            });
        })
        .then(() => {
          // Stakeholder to edit
          cy.api_crud(tokens, "Stakeholder", {
            email: "email-a@domain.com",
            displayName: "stakeholder-a",
            stakeholderGroups: stakeholderGroups.slice(0, 1),
          });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholders");
    cy.intercept("PUT", "/api/controls/stakeholder/*").as("putStakeholder");
  });

  it("Email and displayName", () => {
    stakeholder.edit(0, {
      email: "newEmail@domain.com",
      displayName: "newDisplayName",
    });
    cy.wait("@putStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName");
  });

  it("Job function", () => {
    stakeholder.edit(0, {
      email: "newEmail@domain.com",
      displayName: "newDisplayName",
      jobFunction: "Business Analyst",
    });
    cy.wait("@putStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName")
      .should("contain", "Business Analyst");

    // Edit again
    stakeholder.edit(0, {
      email: "newEmail@domain.com",
      displayName: "newDisplayName",
      jobFunction: "Consultant",
    });
    cy.wait("@putStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName")
      .should("contain", "Consultant");
  });

  it("Group", () => {
    stakeholder.edit(0, {
      email: "newEmail@domain.com",
      displayName: "newDisplayName",
      groups: ["group-b", "group-c"],
    });
    cy.wait("@putStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newEmail@domain.com")
      .should("contain", "newDisplayName")
      .should("contain", "3");
  });
});
