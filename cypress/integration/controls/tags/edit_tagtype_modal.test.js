/// <reference types="cypress" />

describe("Edit tagType", () => {
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
          rank: 111,
          colour: `#fff`,
        };
        cy.createTagType(payload, tokens);
      });
    });

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypesApi");
    cy.intercept("PUT", "/api/controls/tag-type/*").as("updateTagTypeApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("Name and rank", () => {
    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").clear().type("bbb");
    cy.get("input[name='rank']").clear().type("222");

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateTagTypeApi");
    cy.wait("@getTagTypesApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "bbb")
      .should("contain", "222")
      .should("contain", "#fff");
  });

  it("Color", () => {
    // Open modal
    cy.get(".pf-c-table > tbody > tr > td button[aria-label='edit']")
      .first()
      .click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("Red")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@updateTagTypeApi");
    cy.wait("@getTagTypesApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa")
      .should("contain", "111")
      .should("contain", "Red");
  });
});
