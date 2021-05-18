/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Filter applications", () => {
  const application = new Application();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");
      cy.api_clean(tokens, "BusinessService");
      cy.api_clean(tokens, "TagType");

      const businessServices = [];
      const tagTypes = [];
      const tags = [];

      cy.log("")
        .then(() => {
          // Create business services
          return [...Array(11)]
            .map((_, i) => ({
              name: `service-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "BusinessService",
                payload,
                "POST"
              ).then((responseData) => businessServices.push(responseData));
            });
        })
        .then(() => {
          // Create tag types
          return [...Array(6)]
            .map((_, i) => ({
              name: `tagType-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.api_crud(
                tokens,
                "TagType",
                payload,
                "POST"
              ).then((responseData) => tagTypes.push(responseData));
            });
        })
        .then(() => {
          // Create tags
          return [...Array(6)]
            .map((_, i) => [
              {
                name: `tag-${(i + 10).toString(36)}-1`,
                tagType: tagTypes[i],
              },
              {
                name: `tag-${(i + 10).toString(36)}-2`,
                tagType: tagTypes[i],
              },
            ])
            .flatMap((e) => e)
            .forEach((payload) => {
              cy.api_crud(tokens, "Tag", payload, "POST").then((responseData) =>
                tags.push(responseData)
              );
            });
        })
        .then(() => {
          // Create applications
          return [...Array(11)]
            .map((_, i) => ({
              name: `application-${(i + 10).toString(36)}`,
              description: `description-${(i + 10).toString(36)}`,
              businessService: businessServices[i].id,
              tags: [tags[i].id],
            }))
            .forEach((payload) => {
              cy.api_crud(tokens, "Application", payload, "POST");
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/application-inventory/application*").as(
      "getApplications"
    );
  });

  it("By name", () => {
    application.openPage();
    cy.wait("@getApplications");

    // First filter
    application.applyFilter(0, "application-a");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");

    // Second filter
    application.applyFilter(0, "application-k");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("application-k");
  });

  it("By description", () => {
    application.openPage();
    cy.wait("@getApplications");

    // First filter
    application.applyFilter(1, "description-a");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");

    // Second filter
    application.applyFilter(1, "description-k");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("description-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("description-k");
  });

  it("By business service", () => {
    application.openPage();
    cy.wait("@getApplications");

    // First filter
    application.applyFilter(2, "service-a");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");

    // Second filter
    application.applyFilter(2, "service-k");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("service-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("service-k");
  });

  it("By tags", () => {
    application.openPage();
    cy.wait("@getApplications");

    // First filter
    application.applyFilter(3, "tag-a-1");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");

    // Second filter
    application.applyFilter(3, "tag-a-2");

    cy.wait("@getApplications");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("application-b");
  });
});
