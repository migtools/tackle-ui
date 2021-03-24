// Pagination

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
  cy.get(".pf-c-pagination .pf-c-options-menu__toggle-text")
    .first()
    .contains(total);
});

// Table

Cypress.Commands.add(
  "pf4_table_rows",
  { prevSubject: "element" },
  (element) => {
    return cy.wrap(element).find("tbody > tr").not(".pf-m-expanded");
  }
);

Cypress.Commands.add(
  "pf4_table_action_select",
  { prevSubject: "element" },
  (row, rowIndex, actionName) => {
    cy.wrap(row)
      .find("tbody > tr > td.pf-c-table__action")
      .eq(rowIndex)
      .click();

    cy.wrap(row)
      .find("tbody > tr > td.pf-c-table__action > .pf-c-dropdown > ul > li")
      .contains(actionName)
      .click();
  }
);

Cypress.Commands.add(
  "pf4_table_column_toggle",
  { prevSubject: "element" },
  (element, column) => {
    cy.wrap(element)
      .find("thead > tr > th.pf-c-table__sort")
      .contains(column)
      .click();
  }
);

Cypress.Commands.add(
  "pf4_table_column_isAsc",
  { prevSubject: "element" },
  (element, column) => {
    cy.wrap(element)
      .find("thead > tr > th.pf-c-table__sort.pf-m-selected")
      .should("have.attr", "aria-sort", "ascending")
      .get("button")
      .contains(column);
  }
);

Cypress.Commands.add(
  "pf4_table_column_isDesc",
  { prevSubject: "element" },
  (element, column) => {
    cy.wrap(element)
      .find("thead > tr > th.pf-c-table__sort.pf-m-selected")
      .should("have.attr", "aria-sort", "descending")
      .get("button")
      .contains(column);
  }
);

// Dropdown

Cypress.Commands.add(
  "pf4_dropdown",
  { prevSubject: "element" },
  (element, method, eq) => {
    switch (method) {
      case "toggle":
        return cy.wrap(element).find("button.pf-c-dropdown__toggle").click();
      case "select":
        return cy.wrap(element).find("ul > li").eq(eq);

      default:
        break;
    }
  }
);
