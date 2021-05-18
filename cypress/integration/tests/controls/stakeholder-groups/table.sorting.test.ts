/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { StakeholderGroup } from "../../../models/stakeholder-group";

describe("Sort stakeholder groups", () => {
  const stakeholderGroup = new StakeholderGroup();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    const stakeholders = [];

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "StakeholderGroup");

      cy.log("")
        .then(() => {
          // Create stakeholders
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Stakeholder", "POST", payload).then(
                (data) => {
                  stakeholders.push(data);
                }
              );
            });
        })
        .then(() => {
          // Create stakeholder groups
          return [...Array(11)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
              stakeholders: stakeholders.slice(0, i),
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "StakeholderGroup", "POST", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroups"
    );
  });

  it("Sort by name", () => {
    stakeholderGroup.openPage();
    cy.wait("@getStakeholderGroups");

    // Asc is the default
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getStakeholderGroups");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-b");
  });

  it("Sort by members", () => {
    stakeholderGroup.openPage();
    cy.wait("@getStakeholderGroups");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Member(s)");
    cy.wait("@getStakeholderGroups");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Member(s)");
    cy.wait("@getStakeholderGroups");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("group-b");
  });
});
