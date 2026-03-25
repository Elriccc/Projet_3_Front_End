class HomePage {
  visit() {
    cy.visit('/');
  }

  connect(){
    cy.get('[data-cy=login-btn]').click();
  }

  visitMyAccount(){
    cy.get('[data-cy=account-btn]').click();
  }

  upload(){
    cy.get('[data-cy=upload-btn]').click();
  }
}

export default new HomePage();