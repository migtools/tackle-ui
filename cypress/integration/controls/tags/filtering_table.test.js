/// <reference types="cypress" />

describe("TagType filtering table", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    const tagTypes = [];

    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagTypes")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `type-${(i + 10).toString(36)}`,
            }))
            .forEach((payload) => {
              cy.createTagType(payload, tokens).then((data) => {
                tagTypes.push(data);
              });
            });
        })

        .log("Create tags")
        .then(() => {
          return [...Array(11)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagTypes[i],
            }))
            .forEach((payload) => {
              cy.createTag(payload, tokens);
            });
        });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Inteceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypesApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("By name", () => {
    // First filter
    cy.wait("@getTagTypesApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("type-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");

    // Second filter

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("type-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("type-k");
  });

  it("Filter by tag", () => {
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
    cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("select", 1).click();

    // First filter
    cy.wait("@getTagTypesApi");

    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("tag-a");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");

    // Second filter
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
    ).type("tag-k");
    cy.get(
      ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
    ).click();

    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(1).contains("type-k");
  });
});
