/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Application dependencies", () => {
  const application = new Application();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");
      cy.log("").then(() => {
        return [...Array(5)]
          .map((_, i) => ({
            name: `application-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.api_crud(tokens, "Application", "POST", payload);
          });
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Create data
    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "ApplicationsDependency");
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
    application.manageDependencies(2, {
      northToAdd: ["application-a", "application-b"],
      southToAdd: ["application-d", "application-e"],
    });

    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .should("contain", "application-a")
      .should("contain", "application-b");
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .should("contain", "application-d")
      .should("contain", "application-e");
  });

  it("Add north and south dependencies", () => {
    application.manageDependencies(2, {
      northToAdd: ["application-a", "application-b"],
      southToAdd: ["application-d", "application-e"],
    });

    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .should("contain", "application-a")
      .should("contain", "application-b");
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .should("contain", "application-d")
      .should("contain", "application-e");
  });

  it("Add dependencies and then move all to north", () => {
    // Add north and south
    application.manageDependencies(
      2,
      {
        northToAdd: ["application-a", "application-b"],
        southToAdd: ["application-d", "application-e"],
      },
      {
        northToDelete: ["application-a"],
        southToDelete: ["application-d"],
      }
    );

    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(0)
      .pf4_chip_group_chips()
      .should("not.contain", "application-a");
    cy.get(".pf-c-form__group-control .pf-c-chip-group")
      .eq(1)
      .pf4_chip_group_chips()
      .should("not.contain", "application-d");
  });

  it("Application circle dependency", () => {
    // Add north and south
    application.manageDependencies(2, {
      northToAdd: ["application-a"],
      southToAdd: ["application-a"],
    });

    cy.get(".pf-c-form__group-control > .pf-m-error").contains(
      "Dependencies cycle created"
    );
  });
});
