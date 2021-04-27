/// <reference types="cypress" />

describe("Applications table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean app inventory
    cy.get("@tokens").then((tokens) => {
      cy.tackleAppInventoryClean(tokens);
      cy.tackleControlsClean(tokens);
    });

    const tagTypes = [];
    const tags = [];

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagTypes").then(() => {
        return [...Array(6)]
          .map((_, i) => ({
            name: `tagType-${(i + 10).toString(36)}`,
          }))
          .forEach((payload) => {
            cy.createTagType(payload, tokens).then((data) => {
              tagTypes.push(data);
            });
          });
      });
      cy.log("Create tags").then(() => {
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
          .flatMap((a) => a)
          .forEach((payload) => {
            cy.createTag(payload, tokens).then((data) => {
              tags.push(data);
            });
          });
      });

      cy.log("Create applications").then(() => {
        return [...Array(11)]
          .map((_, i) => ({
            name: `application-${(i + 10).toString(36)}`,
            tags: tags.slice(0, i).map((f) => f.id),
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

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getApplicationsApi");
    cy.get(".pf-c-table").pf4_table_column_isAsc("Name");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Name");
    cy.wait("@getApplicationsApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-b");
  });

  it("Sort by tags", () => {
    cy.wait("@getApplicationsApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tags");
    cy.wait("@getApplicationsApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tags");
    cy.wait("@getApplicationsApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("application-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("application-b");
  });
});
