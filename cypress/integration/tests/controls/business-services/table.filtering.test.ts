/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { BusinessService } from "../../../models/business-service";

describe("Filter business services", () => {
  const bussinessService = new BusinessService();

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
              cy.api_create(tokens, "Stakeholder", payload).then((data) => {
                stakeholders.push(data);
              });
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
              cy.api_create(tokens, "BusinessService", payload);
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

  it("By name", () => {
    bussinessService.openPage();
    cy.wait("@getBusinessServices");

    // First filter
    bussinessService.applyFilter(0, "service-a");

    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");

    // Second filter
    bussinessService.applyFilter(0, "service-k");

    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("service-k");
  });

  it("By description", () => {
    bussinessService.openPage();
    cy.wait("@getBusinessServices");

    // First filter
    bussinessService.applyFilter(1, "description-a");

    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    bussinessService.applyFilter(1, "description-k");

    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("By owner", () => {
    bussinessService.openPage();
    cy.wait("@getBusinessServices");

    // First filter
    bussinessService.applyFilter(2, "stakeholder-j");

    cy.wait("@getBusinessServices");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-j");
  });
});
