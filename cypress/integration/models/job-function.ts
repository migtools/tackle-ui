import {
  submitForm,
  verifyInitialFormStatus,
  applyFilterTextToolbar,
} from "./commons";

export interface IFormValue {
  name: string;
}

export class JobFunctions {
  openPage(): void {
    cy.visit("/controls/job-functions");
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[name='name']").clear().type(formValue.name);
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-job-function']").click();

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
