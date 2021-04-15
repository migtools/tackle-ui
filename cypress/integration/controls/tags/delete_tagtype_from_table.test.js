/// <reference types="cypress" />

describe("Delete tagType", () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Clean controls
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Create data
    cy.get("@tokens").then((tokens) => {
      cy.log("Create tagType").then(() => {
        const payload = {
          name: "aaa",
        };
        return cy.createTagType(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypesApi");
    cy.intercept("DELETE", "/api/controls/tag-type/*").as("deleteTagTypeApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("Delete last item", () => {
    cy.wait("@getTagTypesApi");
    cy.get(".pf-c-table").pf4_table_rows().eq(0).contains("aaa");

    // Delete
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='delete']")
      .first()
      .click();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteTagTypeApi");
    cy.wait("@getTagTypesApi");

    // Verify
    cy.get(
      ".pf-c-empty-state > .pf-c-empty-state__content > .pf-c-title"
    ).contains("No tag types available");
  });
});
