/// <reference types="cypress" />

describe("Create new application", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));
    cy.get("@tokens").then((tokens) => {
      cy.log("Create business services").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `service-${(i + 10).toString(36)}`,
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

    cy.get("@tokens").then((tokens) =>
      cy.tackleControlsCleanApplications(tokens)
    );

    cy.intercept({
      method: "GET",
      path: `/api/application-inventory/application*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "POST",
      path: `/api/application-inventory/application*`,
    }).as("createDataApi");

    cy.visit("/application-inventory");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-application']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("myapplication");
    cy.get("input[name='description']").type("mydescription");
    cy.get("textarea[name='comments']").type("mycomments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.get(".pf-c-table").pf4_table_rows()
      .eq(0)
      .should("contain", "myapplication")
      .should("contain", "mydescription");
  });

  it("With business service", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service*",
    }).as("apiCheckGetAllBusinessServices");
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service/*",
    }).as("apiCheckGetSingleBusinessService");

    // Open modal
    cy.get("button[aria-label='create-application']").click();
    cy.wait("@apiCheckGetAllBusinessServices");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("mybusinessservice");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("service-a")
      .type("{enter}");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createDataApi");
    cy.wait("@getTableDataApi");
    cy.wait("@apiCheckGetSingleBusinessService");

    // Verify table
    cy.get(".pf-c-table").pf4_table_rows()
      .eq(0)
      .should("contain", "mybusinessservice")
      .should("contain", "service-a");
  });
});
