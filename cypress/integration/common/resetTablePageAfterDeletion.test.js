/// <reference types="cypress" />

context("Reset table after deletion", () => {
  const verifyLastPage = (apiPath, total, perPage, openDeleteModalFn) => {
    cy.intercept({
      method: "GET",
      path: `/api/${apiPath}*`,
    }).as("getTableDataApi");

    cy.intercept({
      method: "DELETE",
      path: `/api/${apiPath}/*`,
    }).as("deleteRequestApi");

    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(total);

    // Go to last page
    const lastPage = parseInt((total + perPage) / perPage);

    cy.pf4_pagination_action_goToPage(lastPage);
    cy.wait("@getTableDataApi");
    cy.pf4_pagination_select_currentPageInput().should("have.value", lastPage);

    // Delete last element
    openDeleteModalFn();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteRequestApi");
    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(total - 1);

    // Verify current page has moved back to previous page
    cy.pf4_pagination_select_currentPageInput().should(
      "have.value",
      lastPage - 1
    );

    // Delete another item again
    openDeleteModalFn();
    cy.get("button[aria-label='confirm']").click();

    cy.wait("@deleteRequestApi");
    cy.wait("@getTableDataApi");

    // Verify table elements
    cy.pf4_pagination_verify_total(total - 2);

    // Verify current page has not changed
    cy.pf4_pagination_select_currentPageInput().should(
      "have.value",
      lastPage - 1
    );
  };

  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin("alice").as("tokens");

    cy.get("@tokens").then((tokens) => {
      cy.tackleControlsClean(tokens);
      cy.tackleAppInventoryClean(tokens);
    });
  });

  it("Business service table", () => {
    const totalRows = 11;
    const rowsPerpage = 10;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create table rows").then(() => {
        return [...Array(totalRows)]
          .map((_, i) => ({
            name: `service${i + 1}`,
          }))
          .forEach((payload) => {
            cy.createBusinessService(payload, tokens);
          });
      });
    });

    cy.visit("/controls/business-services");
    verifyLastPage("controls/business-service", totalRows, rowsPerpage, () => {
      cy.get("button[aria-label='delete']").first().click();
    });
  });

  it("Stakeholder table", () => {
    const totalRows = 11;
    const rowsPerpage = 10;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create table rows").then(() => {
        return [...Array(totalRows)]
          .map((_, i) => ({
            email: `email-${(i + 10).toString(36)}@domain.com`,
            displayName: `stakeholder${i + 1}`,
          }))
          .forEach((payload) => {
            cy.createStakeholder(payload, tokens);
          });
      });
    });

    cy.visit("/controls/stakeholders");
    verifyLastPage("controls/stakeholder", totalRows, rowsPerpage, () => {
      cy.get("button[aria-label='delete']").first().click();
    });
  });

  it("Stakeholder group table", () => {
    const totalRows = 11;
    const rowsPerpage = 10;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create table rows").then(() => {
        return [...Array(totalRows)]
          .map((_, i) => ({
            name: `group${i + 1}`,
          }))
          .forEach((payload) => {
            cy.createStakeholderGroup(payload, tokens);
          });
      });
    });

    cy.visit("/controls/stakeholder-groups");
    verifyLastPage("controls/stakeholder-group", totalRows, rowsPerpage, () => {
      cy.get("button[aria-label='delete']").first().click();
    });
  });

  it("Application inventory table", () => {
    const totalRows = 11;
    const rowsPerpage = 10;

    cy.get("@tokens").then((tokens) => {
      cy.log("Create table rows").then(() => {
        return [...Array(totalRows)]
          .map((_, i) => ({
            name: `applications${i + 1}`,
          }))
          .forEach((payload) => {
            cy.createApplication(payload, tokens);
          });
      });
    });

    cy.visit("/application-inventory");
    verifyLastPage(
      "application-inventory/application",
      totalRows,
      rowsPerpage,
      () => {
        cy.pf4_table_select_kebabAction("Delete").click();
      }
    );
  });
});
