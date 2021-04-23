/// <reference types="cypress" />

describe("Edit application", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls and app inventory
    cy.get("@tokens").then((tokens) => {
      cy.tackleControlsClean(tokens);
      cy.tackleAppInventoryClean(tokens);
    });

    // Create data
    const businessServices = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create business services")
        .then(() => {
          return [...Array(5)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createBusinessService(payload, tokens).then((data) => {
                businessServices.push(data);
              });
            });
        })

        .log("Create application")
        .then(() => {
          const payload = {
            name: `application-a`,
            businessService: businessServices[0].id,
          };
          return cy.createApplication(payload, tokens);
        });
    });

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );
    cy.intercept("PUT", "/api/application-inventory/application/*").as(
      "updateApplicationApi"
    );

    // Go to page
    cy.visit("/application-inventory");
  });

  it("Name, description, and comments", () => {
    // Open modal
    cy.get(".pf-c-table").pf4_table_row_edit(0, "open");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("newName");
    cy.get("input[name='description']").clear().type("newDescription");
    cy.get("textarea[name='comments']").clear().type("newComments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateApplicationApi");
    cy.wait("@getApplicationsApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Business service", () => {
    cy.intercept("GET", new RegExp("/api/controls/business-service*")).as(
      "getBusinessServicesApi"
    );

    // Open modal
    cy.get(".pf-c-table").pf4_table_row_edit(0, "open");
    cy.wait("@getBusinessServicesApi");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .clear()
      .type("service-b")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateApplicationApi");
    cy.wait("@getApplicationsApi");
    cy.wait("@getBusinessServicesApi");

    // Verify table
    cy.get(".pf-c-table").pf4_table_rows().eq(0).should("contain", "service-b");
  });
});
