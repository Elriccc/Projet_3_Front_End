class LoginPage {
  visit() {
    cy.visit('/login');
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Connexion')
  }

  fillEmail(email: string) {
    cy.get('[data-cy=login]').type(email);
  }

  fillPassword(password: string) {
    cy.get('[data-cy=password]').type(password, { log: false });
  }

  visitRegister(){
    cy.get('[data-cy=visit-register]').click();
  }

  submit() {
    cy.get('[data-cy=submit]').click();
  }

  getErrorLogin() {
    cy.get('[data-cy=login-error]')
  }

  getLoginRequiredError(){
    cy.get('[data-cy=login-required-error]')
  }

  getLoginPatternError(){
    cy.get('[data-cy=login-pattern-error]')
  }

  getPasswordRequiredError(){
    cy.get('[data-cy=password-required-error]')
  }

  getPasswordMinlengthError(){
    cy.get('[data-cy=password-minlength-error]')
  }

  login(email: string, password: string) {
    this.checkTitle();
    this.fillEmail(email);
    this.fillPassword(password);
    this.submit();
  }
}

export default new LoginPage();