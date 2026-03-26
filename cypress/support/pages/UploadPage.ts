class UploadPage {
  visit() {
    cy.visit('/upload');
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Ajouter un fichier')
  }

  addFile(fileName: string) {
    if(fileName.length>0)cy.get('#file')
      .selectFile(`cypress/fixtures/${fileName}`);
  }

  fillPassword(password: string) {
    if(password.length>0)cy.get('[data-cy=password]').type(password);
  }

  selectExpiration(expiration: string) {
    if(expiration.length>0)cy.get('[data-cy=expiration]').type(expiration);
  }

  getUploadDisabled(){
    return cy.get('[data-cy=upload-btn-disabled]');
  }

  submit() {
    cy.get('[data-cy=upload-btn]').click();
  }

  getErrorUpload() {
    return cy.get('[data-cy=upload-error]')
  }

  getFileNameError(){
    return cy.get('[data-cy=file-name-error]')
  }

  getFilSizeError(){
    return cy.get('[data-cy=file-size-error]')
  }

  getPasswordTooShortError(){
    return cy.get('[data-cy=password-too-short-error]')
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