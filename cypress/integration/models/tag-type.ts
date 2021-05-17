import {
  applyFilterTextToolbar,
  submitForm,
  verifyInitialFormStatus,
} from "./commons";

export interface IFormValue {
  name: string;
  rank: number;
  color?: string;
}

export class TagType {
  openPage(): void {
    cy.visit("/controls/tags");
  }

  protected fillForm(formValue: IFormValue): void {
    cy.get("input[name='name']").clear().type(formValue.name);
    cy.get("input[name='rank']").clear().type(`${formValue.rank}`);

    if (formValue.color) {
      cy.get(".pf-c-form__group-control button.pf-c-select__toggle-button")
        .eq(0)
        .click();
      cy.get(".pf-c-select.pf-m-expanded > ul > li > button")
        .contains(formValue.color)
        .click();
    }
  }

  create(formValue: IFormValue): void {
    this.openPage();

    cy.get("button[aria-label='create-tag-type']").click();

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
