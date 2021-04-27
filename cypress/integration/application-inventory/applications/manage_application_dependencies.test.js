/// <reference types="cypress" />

describe("Application dependencies", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => cy.tackleAppInventoryClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create applications").then(() => {
        return [...Array(5)]
          .map((_, i) => ({
            name: `application-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createApplication(payload, tokens);
          });
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplicationsApi"
    );

    cy.intercept(
      "GET",
      "/api/application-inventory/applications-dependency*"
    ).as("getDependenciesApi");
    cy.intercept(
      "POST",
      "/api/application-inventory/applications-dependency"
    ).as("createDependencyApi");
    cy.intercept(
      "DELETE",
      "/api/application-inventory/applications-dependency/*"
    ).as("deleteDependencyApi");

    // Go to page
    cy.visit("/application-inventory");
  });

  it("Add north and south dependencies", () => {
    cy.wait("@getApplicationsApi");

    // Open modal and wait to fetch data
    cy.get(".pf-c-table").pf4_table_action_select(2, "Manage dependencies");

    cy.wait("@getApplicationsApi");
    cy.wait("@getDependenciesApi"); // Northbound dependencies
    cy.wait("@getDependenciesApi"); // Southbound dependencies

    // Add north dependencies: application[a,b]
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("application-a")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .eq(0)
      .contains("application-a");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("application-b")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .eq(1)
      .contains("application-b");

    // Remove application[d] and add south dependencies: [d,e]
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("application-d")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .eq(0)
      .contains("application-d");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("application-e")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .eq(1)
      .contains("application-e");
  });

  it("Add and then delete dependencies", () => {
    cy.wait("@getApplicationsApi");

    // Open modal and wait to fetch data
    cy.get(".pf-c-table").pf4_table_action_select(2, "Manage dependencies");

    cy.wait("@getApplicationsApi");
    cy.wait("@getDependenciesApi"); // Northbound dependencies
    cy.wait("@getDependenciesApi"); // Southbound dependencies

    // Add north dependencies: application[a,b]
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("application-a")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .eq(0)
      .contains("application-a");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("application-b")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .eq(1)
      .contains("application-b");

    // Remove
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(0)
      .type("application-a")
      .type("{enter}");
    cy.wait("@deleteDependencyApi")
      .its("response.statusCode")
      .should("eq", 204);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .should("not.contain", "application-a");

    // Add south dependencies: application[a,b]
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("application-d")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .eq(0)
      .contains("application-d");

    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("application-e")
      .type("{enter}");
    cy.wait("@createDependencyApi")
      .its("response.statusCode")
      .should("eq", 201);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .eq(1)
      .contains("application-e");

    // Remove
    cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
      .eq(1)
      .type("application-d")
      .type("{enter}");
    cy.wait("@deleteDependencyApi")
      .its("response.statusCode")
      .should("eq", 204);
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .should("not.contain", "application-d");
  });
});
