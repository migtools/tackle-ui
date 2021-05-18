/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { BusinessService } from "../../../models/business-service";

describe("Sort business services", () => {
  const businessService = new BusinessService();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data
    const stakeholders = [];

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Stakeholder");
      cy.api_clean(tokens, "BusinessService");

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
          // Create business services
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              owner: stakeholders[i],
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "BusinessService", "POST", payload);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServices"
    );
  });

  it("Sort by name", () => {
    businessService.openPage();
    cy.wait("@getBusinessServices");

    // Asc is the default
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("service-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getBusinessServices");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("service-b");
  });

  it("Sort by owner", () => {
    businessService.openPage();
    cy.wait("@getBusinessServices");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Owner");
    cy.wait("@getBusinessServices");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Owner");
    cy.wait("@getBusinessServices");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-b");
  });
});
