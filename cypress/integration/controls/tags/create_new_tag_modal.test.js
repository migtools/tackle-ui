/// <reference types="cypress" />

describe("Create new tag", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagType").then(() => {
        const payload = {
          name: "type-a",
        };
        return cy.createTagType(payload, tokens);
      });
    });
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Delete all tags
    cy.get("@tokens").then((tokens) => cy.tackleControlsCleanTags(tokens));

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypeApi");
    cy.intercept("POST", "/api/controls/tag*").as("createTagApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-tag']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("tag-a");

    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("type-a")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createTagApi");
    cy.wait("@getTagTypeApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "type-a")
      .should("contain", "1");

    cy.get(".pf-c-table").pf4_table_row_expand(0);
    cy.get(".pf-c-table__expandable-row-content > div > .pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "tag-a");
  });
});
