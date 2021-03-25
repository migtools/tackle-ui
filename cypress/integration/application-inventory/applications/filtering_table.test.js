/// <reference types="cypress" />

describe("Application filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));

    // Create data
    const businessServices = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create business services")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createBusinessService(payload, tokens).then((data) => {
                businessServices.push(data);
              });
            });
        })

        .log("Create applications")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `application-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              businessService: businessServices[i].id,
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

    // Inteceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );

    // Go to page
    cy.visit("/application-inventory");
  });

  it("By name", () => {
    // First filter
    cy.wait("@getApplicationsApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("application-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("application-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("application-k");
  });
});
