/// <reference types="cypress" />

describe("TagType table sorting", () => {
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
              rank: i,
            }))
            .forEach((payload) => {
              cy.createTagType(payload, tokens).then((data) => {
                tagTypes.push(data);
              });
            });
        })

        .log("Create tags")
        .then(() => {
          return [...Array(10)]
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
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypeApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("Sort by name", () => {
    // Asc is the default
    cy.wait("@getTagTypeApi");
    cy.get(".pf-c-table").pf4_table_column_isAsc("Tag type");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag type");
    cy.wait("@getTagTypeApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-b");
  });

  it("Sort by rank", () => {
    cy.wait("@getTagTypeApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Rank");
    cy.wait("@getTagTypeApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Rank");
    cy.wait("@getTagTypeApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-b");
  });

  it("Sort by tags", () => {
    cy.wait("@getTagTypeApi");

    // Asc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag(s)");
    cy.wait("@getTagTypeApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-k");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");

    // Desc
    cy.get(".pf-c-table").pf4_table_column_toggle("Tag(s)");
    cy.wait("@getTagTypeApi");

    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");
    cy.get(".pf-c-table").pf4_table_rows().eq(9).contains("type-j");
  });
});
