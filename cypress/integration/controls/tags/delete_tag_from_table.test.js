/// <reference types="cypress" />

describe("Delete tag", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    let tagType;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagType")
        .then(() => {
          const payload = {
            name: "type-a",
          };
          return cy.createTagType(payload, tokens).then((data) => {
            tagType = data;
          });
        })

        .log("Create tags")
        .then(() => {
          return [...Array(3)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagType,
            }))
            .forEach((payload) => {
              cy.createTag(payload, tokens);
            });
        });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypesApi");
    cy.intercept("DELETE", "/api/controls/tag/*").as("deleteTagApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("Delete last item", () => {
    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("type-a");

    // Expand area
    cy.get(".pf-c-table").pf4_table_row_expand(0);

    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-a");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-b");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(2)
      .should("contain", "tag-c");

    // Delete
    cy.get(
      ".pf-c-table__expandable-row-content > div > .pf-c-table"
    ).pf4_table_action_select(0, "Delete");
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteTagApi");
    cy.wait("@getTagTypesApi");

    // Verify
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("not.contain", "tag-a");
  });
});
