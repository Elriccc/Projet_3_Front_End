class RegisterPage {
  visit() {
    cy.visit('/register');
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Créer un compte')
  }

  fillEmail(email: string) {
    cy.get('[data-cy=login]').type(email);
  }

  fillPassword(password: string) {
    cy.get('[data-cy=password]').type(password);
  }

  fillPasswordConfirmation(passwordConfirmation: string) {
    cy.get('[data-cy=passwordConfirmation]').type(passwordConfirmation)
  }

  visitLogin(){
    cy.get('[data-cy=visit-login]').click();
  }

  submit() {
    cy.get('[data-cy=submit]').click();
  }

  getErrorRegister() {
    cy.get('[data-cy=register-error]')
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

  getPasswordMatchError(){
    cy.get('[data-cy=password-match-error]')
  }

  register(email: string, password: string, passwordConfirmation: string) {
    this.checkTitle();
    this.fillEmail(email);
    this.fillPassword(password);
    this.fillPasswordConfirmation(passwordConfirmation);
    this.submit();
  }
}

export default new RegisterPage();