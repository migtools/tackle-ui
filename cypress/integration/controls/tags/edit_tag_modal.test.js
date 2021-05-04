/// <reference types="cypress" />

describe("Edit tag", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    let tagTypeA;
    let tagTypeB;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagType")
        .then(() => {
          const payload = {
            name: "type-a",
          };
          return cy.createTagType(payload, tokens).then((data) => {
            tagTypeA = data;
          });
        })
        .then(() => {
          const payload = {
            name: "type-b",
          };
          return cy.createTagType(payload, tokens).then((data) => {
            tagTypeB = data;
          });
        })

        .log("Create tags")
        .then(() => {
          return [...Array(2)]
            .map((_, i) => ({
              name: `tag-${(i + 10).toString(36)}`,
              tagType: tagTypeA,
            }))
            .forEach((payload) => {
              cy.createTag(payload, tokens);
            });
        })
        .then(() => {
          return [...Array(2)]
            .map((_, i) => ({
              name: `tag-${(i + 12).toString(36)}`,
              tagType: tagTypeB,
            }))
            .forEach((payload) => {
              cy.createTag(payload, tokens);
            });
        });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypesApi");
    cy.intercept("PUT", "/api/controls/tag/*").as("updateTagApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("Edit tag name", () => {
    // Expand area
    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-a");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-b");

    cy.get(".pf-c-table").pf4_table_row_expand(1);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-c");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-d");

    // Open modal
    cy.get(
      ".pf-c-table__expandable-row-content > div > .pf-c-table"
    ).pf4_table_action_select(0, "Edit");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("tag-changed");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateTagApi");
    cy.wait("@getTagTypesApi");

    // Verify table
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-changed");
  });

  it("Edit tagType", () => {
    // Expand area1
    cy.get(".pf-c-table").pf4_table_row_expand(0);

    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-a");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-b");

    // Expand area2
    cy.get(".pf-c-table").pf4_table_row_expand(1);

    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-c");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(1)
      .should("contain", "tag-d");

    // Open modal
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_action_select(0, "Edit");

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("type-b")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateTagApi");
    cy.wait("@getTagTypesApi");

    // Verify table
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(0)
      .pf4_table_rows()
      .eq(0)
      .should("not.contain", "tag-a");
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .eq(1)
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-a");
  });
});
