/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { StakeholderGroup } from "../../../models/stakeholder-group";

describe("Filter business services", () => {
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
              cy.api_crud(tokens, "Stakeholder", payload).then((data) => {
                stakeholders.push(data);
              });
            });
        })
        .then(() => {
          // Create stakeholder groups
          return [...Array(11)]
            .map((_, i) => ({
              name: `group-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              stakeholders: stakeholders.slice(0, i),
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

    // Inteceptors
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getStakeholderGroups"
    );
  });

  it("By name", () => {
    stakeholderGroup.openPage();
    cy.wait("@getStakeholderGroups");

    // First filter
    stakeholderGroup.applyFilter(0, "group-a");

    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");

    // Second filter
    stakeholderGroup.applyFilter(0, "group-k");

    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("group-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("group-k");
  });

  it("By description", () => {
    stakeholderGroup.openPage();
    cy.wait("@getStakeholderGroups");

    // First filter
    stakeholderGroup.applyFilter(1, "description-a");

    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    stakeholderGroup.applyFilter(1, "description-k");

    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("By member", () => {
    stakeholderGroup.openPage();
    cy.wait("@getStakeholderGroups");

    // First filter
    stakeholderGroup.applyFilter(2, "stakeholder-j");

    cy.wait("@getStakeholderGroups");
    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table > tbody > tr.pf-c-table__expandable-row")
      .find(".pf-c-description-list .pf-c-description-list__text")
      .contains("stakeholder-j");
  });
});
