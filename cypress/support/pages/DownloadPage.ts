class DownloadPage {
  visit(fileLink: string) {
    cy.visit(`/${fileLink}`);
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Télécharger un fichier')
  }

  fillPassword(password: string) {
    cy.get('[data-cy=password]').type(password);
  }

  submit() {
    cy.get('[data-cy=download-btn]').click();
  }

  getExpirationInfo() {
    cy.get('[data-cy=expiration-info]')
  }

  getExpirationAlert() {
    cy.get('[data-cy=expiration-alert]')
  }

  getExpirationMessage() {
    cy.get('[data-cy=expiration-message]')
  }

  download(password?: string) {
    this.checkTitle();
    if(password){
      this.fillPassword(password);
    }
    this.submit();
  }
}

export default new DownloadPage();