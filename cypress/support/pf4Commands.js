Cypress.Commands.add("pf4_pagination_action_goToPage", (page) => {
  cy.get(
    ".pf-c-pagination__nav > .pf-c-pagination__nav-page-select > input[aria-label='Current page']"
  )
    .clear()
    .type(page)
    .type("{enter}");
});

Cypress.Commands.add("pf4_pagination_select_currentPageInput", () => {
  cy.get(
    ".pf-c-pagination__nav > .pf-c-pagination__nav-page-select > input[aria-label='Current page']"
  );
});

Cypress.Commands.add("pf4_pagination_verify_total", (total) => {
  cy.get(".pf-c-pagination .pf-c-options-menu__toggle-text").first().contains(total);
});
