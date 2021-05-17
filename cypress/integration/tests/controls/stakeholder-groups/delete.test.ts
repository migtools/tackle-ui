/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { StakeholderGroup } from "../../../models/stakeholder-group";

describe("Delete business service", () => {
  const stakeholderGroup = new StakeholderGroup();

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "StakeholderGroup");
      cy.api_create(tokens, "StakeholderGroup", {
        name: "group-a",
      });
    });

    // Interceptors
    cy.intercept("DELETE", "/api/controls/stakeholder-group/*").as(
      "deleteStakeholderGroup"
    );
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroups"
    );
  });

  it("Delete the only item available", () => {
    stakeholderGroup.delete(0);
    cy.wait("@deleteStakeholderGroup");

    // Verify table
    cy.wait("@getStakeholderGroups");
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No stakeholder groups available");
  });
});
