/// <reference types="cypress" />

describe("Create new tagType", () => {
  before(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");
  });

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    // Delete all tagTypes
    cy.get("@tokens").then((tokens) => cy.tackleControlsClean(tokens));

    // Interceptors
    cy.intercept("GET", "/api/controls/tag-type*").as("getTagTypeApi");
    cy.intercept("POST", "/api/controls/tag-type*").as("createTagTypeApi");

    // Go to page
    cy.visit("/controls/tags");
  });

  it("With min data", () => {
    // Open modal
    cy.get("button[aria-label='create-tag-type']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("aaa");

    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("Blue")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createTagTypeApi");
    cy.wait("@getTagTypeApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa")
      .should("contain", "Blue");
  });

  it("With rank", () => {
    // Open modal
    cy.get("button[aria-label='create-tag-type']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("aaa");
    cy.get("input[name='rank']").clear().type("22");

    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("Blue")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createTagTypeApi");
    cy.wait("@getTagTypeApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa")
      .should("contain", "22")
      .should("contain", "Blue");
  });

  it("With color", () => {
    // Open modal
    cy.get("button[aria-label='create-tag-type']").click();

    // Verify primary button is disabled
    cy.get("button[aria-label='submit']").should("be.disabled");

    // Fill form
    cy.get("input[name='name']").type("aaa");

    cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
      .eq(0)
      .click();
    cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
      .contains("Blue")
      .click();

    cy.get("button[aria-label='submit']").should("not.be.disabled");
    cy.get("form").submit();

    cy.wait("@createTagTypeApi");
    cy.wait("@getTagTypeApi");

    // Verify table
    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(0)
      .should("contain", "aaa")
      .should("contain", "Blue");
  });
});
