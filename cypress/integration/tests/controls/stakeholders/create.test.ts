/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Stakeholder } from "../../../models/stakeholder";

describe("Create new business service", () => {
  const stakeholder = new Stakeholder();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "JobFunction");
      cy.api_clean(tokens, "StakeholderGroup");

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
              cy.api_crud(tokens, "StakeholderGroup", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder*").as("getStakeholders");
    cy.intercept("POST", "/api/controls/stakeholder*").as("postStakeholder");
  });

  it("With min data", () => {
    stakeholder.create({
      email: "aaa@domain.com",
      displayName: "myDisplayName",
    });
    cy.wait("@postStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName");
  });

  it("With job function", () => {
    stakeholder.create({
      email: "aaa@domain.com",
      displayName: "myDisplayName",
      jobFunction: "Business Analyst",
    });
    cy.wait("@postStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName")
      .should("contain", "Business Analyst");
  });

  it("With group", () => {
    stakeholder.create({
      email: "aaa@domain.com",
      displayName: "myDisplayName",
      groups: ["group-a", "group-b"],
    });
    cy.wait("@postStakeholder");

    // Verify table
    cy.wait("@getStakeholders");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa@domain.com")
      .should("contain", "myDisplayName")
      .should("contain", "2");
  });
});
