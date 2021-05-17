import {
  applyFilterTextToolbar,
  submitForm,
  verifyInitialFormStatus,
} from "./commons";

export interface IFormValue {
  email: string;
  displayName: string;
  jobFunction?: string;
  groups?: string[];
}

export class Stakeholder {
  openPage(): void {
    cy.visit("/controls/stakeholders");

    // Interceptors
    cy.intercept("GET", "/api/controls/job-function*").as(
      "getAllJobFunctionsDropdown"
    );
    cy.intercept("GET", "/api/controls/stakeholder-group*").as(
      "getAllStakeholderGroupsDropdown"
    );
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[name='email']").clear().type(formValue.email);
    cy.get("input[name='displayName']").clear().type(formValue.displayName);

    if (formValue.jobFunction) {
      cy.wait("@getAllJobFunctionsDropdown");
      cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
        .eq(0)
        .clear()
        .type(formValue.jobFunction)
        .type("{enter}");
    }
    if (formValue.groups) {
      cy.wait("@getAllStakeholderGroupsDropdown");
      formValue.groups.forEach((e) => {
        cy.get(".pf-c-form__group-control input.pf-c-select__toggle-typeahead")
          .eq(1)
          .clear()
          .type(e)
          .type("{enter}");
      });
    }
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-stakeholder']").click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  edit(rowIndex: number, formValue: IFormValue): void {
    this.openPage();

    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(rowIndex)
      .find("button[aria-label='edit']")
      .click();

    verifyInitialFormStatus();
    this.fillForm(formValue);
    submitForm();
  }

  delete(rowIndex: number): void {
    this.openPage();

    cy.get(".pf-c-table")
      .pf4_table_rows()
      .eq(rowIndex)
      .find("button[aria-label='delete']")
      .click();
    cy.get("button[aria-label='confirm']").click();
  }

  applyFilter(filterIndex: number, filterText: string): void {
    applyFilterTextToolbar(filterIndex, filterText);
  }
}
