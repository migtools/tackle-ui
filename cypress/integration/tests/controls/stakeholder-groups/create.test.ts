/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { StakeholderGroup } from "../../../models/stakeholder-group";

describe("Create stakeholder group", () => {
  const stakeholderGroup = new StakeholderGroup();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");

      // Stakeholders for dropdown
      [...Array(3)]
        .map((_, i) => ({
          email: `email-${(i + 10).toString(36)}@domain.com`,
          displayName: `stakeholder-${(i + 10).toString(36)}`,
        }))
        .forEach((payload) => {
          cy.api_create(tokens, "Stakeholder", payload);
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "StakeholderGroup");
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroups"
    );
    cy.intercept("POST", "/api/controls/stakeholder-group*").as(
      "postStakeholderGroup"
    );
  });

  it("With min data", () => {
    stakeholderGroup.create({
      name: "myStakeholderGroup",
    });
    cy.wait("@postStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myStakeholderGroup");
  });

  it("With description", () => {
    stakeholderGroup.create({
      name: "myStakeholderGroup",
      description: "myDescription",
    });
    cy.wait("@postStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myStakeholderGroup")
      .should("contain", "myDescription");
  });

  it("With members", () => {
    stakeholderGroup.create({
      name: "myStakeholderGroup",
      members: ["stakeholder-a", "stakeholder-b"],
    });
    cy.wait("@postStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "myStakeholderGroup")
      .should("contain", "2");
  });
});
