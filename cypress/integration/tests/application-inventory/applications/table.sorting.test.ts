/// <reference types="cypress" />
/// <reference types="cypress-keycloak-commands" />

import { Application } from "../../../models/application";

describe("Sort applications", () => {
  const application = new Application();

  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Data

    cy.get<KcTokens>("@tokens").then((tokens) => {
      cy.api_clean(tokens, "Application");
      cy.api_clean(tokens, "TagType");

      const tagTypes = [];
      const tags = [];

      cy.log("")
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
              tags: tags.slice(0, i).map((f) => f.id),
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

  it("Sort by name", () => {
    application.openPage();
    cy.wait("@getApplications");

    // Asc is the default
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getApplications");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-b");
  });

  it("Sort by tags", () => {
    application.openPage();
    cy.wait("@getApplications");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tags");
    cy.wait("@getApplications");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tags");
    cy.wait("@getApplications");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-b");
  });
});
