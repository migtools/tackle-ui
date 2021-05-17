export const verifyInitialFormStatus = () => {
  cy.get("button[aria-label='submit']").should("be.disabled");
};

export const submitForm = () => {
  cy.get("button[aria-label='submit']").should("not.be.disabled");
  cy.get("form").submit();
};

export const applyFilterTextToolbar = (filterIndex: number, filterText: string) => {
  // Select filter
  cy.get(".pf-c-toolbar .pf-c-dropdown").pf4_dropdown("toggle");
  cy.get(".pf-c-toolbar .pf-c-dropdown")
    .pf4_dropdown("select", filterIndex)
    .click();

  // Type filterText and then apply it
  cy.get(
    ".pf-c-toolbar .pf-c-toolbar__content input[aria-label='filter-text']"
  )
    .clear()
    .type(filterText);
  cy.get(
    ".pf-c-toolbar .pf-c-toolbar__content button[aria-label='search']"
  ).click();
};
