/// <reference types="cypress" />

describe("Edit application", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    const businessServices = [];

    cy.get("@tokens").then((tokens) => {
      cy.tackleControlsClean(tokens);
      cy.tackleAppInventoryClean(tokens);
    });

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

    cy.intercept({
      method: "GET",
      path: `/api/application-inventory/application*`,
    }).as("getTableDataApi");
    cy.intercept({
      method: "PUT",
      path: `/api/application-inventory/application/*`,
    }).as("updateDataApi");

    cy.visit("/application-inventory");
  });

  it("Name, description, and comments", () => {
    // Open modal
    cy.pf4_table_select_kebabAction("Edit").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("newName");
    cy.get("input[name='description']").clear().type("newDescription");
    cy.get("textarea[name='comments']").clear().type("newComments");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");

    // Verify table
    cy.pf4_table_select_mainRows()
      .eq(0)
      .should("contain", "newName")
      .should("contain", "newDescription");
  });

  it("Business service", () => {
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service*",
    }).as("apiCheckGetAllBusinessServices");
    cy.intercept({
      method: "GET",
      path: "/api/controls/business-service/*",
    }).as("apiCheckGetOneBusinessServices");

    // Open modal
    cy.pf4_table_select_kebabAction("Edit").click();
    cy.wait("@apiCheckGetAllBusinessServices");

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

    cy.wait("@updateDataApi");
    cy.wait("@getTableDataApi");
    cy.wait("@apiCheckGetOneBusinessServices");

    // Verify table
    cy.pf4_table_select_mainRows().eq(0).should("contain", "service-b");
  });
});
