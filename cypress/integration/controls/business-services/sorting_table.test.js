/// <reference types="cypress" />

describe("Business services table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const stakeholders = [];
    cy.get("@tokens").then((tokens) => {
      cy.log("Create stakeholders")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              email: `email-${(i + 10).toString(36)}@domain.com`,
              displayName: `stakeholder-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createStakeholder(payload, tokens).then((data) => {
                stakeholders.push(data);
              });
            });
        })

        .log("Create businessService")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
              owner: stakeholders[i],
            }))
            .forEach((payload) => {
              cy.createBusinessService(payload, tokens);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/controls/business-service*").as(
      "getBusinessServicesApi"
    );

    // Go to page
    cy.visit("/controls/business-services");
  });

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getBusinessServicesApi");
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("service-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getBusinessServicesApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("service-b");
  });

  it("Sort by owner", () => {
    cy.wait("@getBusinessServicesApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Owner");
    cy.wait("@getBusinessServicesApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Owner");
    cy.wait("@getBusinessServicesApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("stakeholder-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("stakeholder-b");
  });
});
