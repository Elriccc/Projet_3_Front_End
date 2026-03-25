class UploadPage {
  visit() {
    cy.visit('/upload');
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Ajouter un fichier')
  }

  addFile(fileName: string) {
    cy.get('#file')
      .selectFile(`cypress/fixtures/${fileName}`);
  }

  fillPassword(password: string) {
    cy.get('[data-cy=password]').type(password);
  }

  selectExpiration(expiration: string) {
    cy.get('[data-cy=expiration]').type(expiration);
  }

  getUploadDisabled(){
    cy.get('[data-cy=upload-btn-disabled]');
  }

  submit() {
    cy.get('[data-cy=upload-btn]').click();
  }

  getErrorUpload() {
    cy.get('[data-cy=upload-error]')
  }

  getFileNameError(){
    cy.get('[data-cy=file-name-error]')
  }

  getFilSizeError(){
    cy.get('[data-cy=file-size-error]')
  }

  getPasswordTooShortError(){
    cy.get('[data-cy=password-too-short-error]')
  }

  upload(fileName: string, password?: string, expiration?: string){
    this.checkTitle();
    this.addFile(fileName);
    if(password){
      this.fillPassword(password);
    }
    if(expiration){
      this.selectExpiration(expiration);
    }
    this.submit();
  }

  visitFile(){
    cy.get('[data-cy=file-link]').click();
  }

  copy() {
    cy.get('[data-cy=copy-btn]').click();
  }
}

export default new UploadPage();