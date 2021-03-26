/// <reference types="cypress" />

describe("Assess an application from table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create applications").then(() => {
        return [...Array(3)]
          .map((_, i) => ({
            name: `application-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createApplication(payload, tokens);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );

    // Go to page
    cy.visit("/application-inventory");
  });

  it.only("Should redirect to assess page", () => {
    // cy.wait("@getApplicationsApi");

    // cy.get(".pf-c-table").pf4_table_row_check(0);
    // cy.get(".pf-c-toolbar button[aria-label='assess-application']").click();

    // cy.url().should("match", "/application-inventory/assessment/*");
  });
});
