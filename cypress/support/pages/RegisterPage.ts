class RegisterPage {
  visit() {
    cy.visit('/register');
  }

  checkTitle(){
    cy.get('[data-cy=title]').should('have.text', 'Créer un compte')
  }

  fillEmail(email: string) {
    if(email.length>0)cy.get('[data-cy=login]').type(email);
  }

  fillPassword(password: string) {
    if(password.length>0)cy.get('[data-cy=password]').type(password);
  }

  fillPasswordConfirmation(passwordConfirmation: string) {
    if(passwordConfirmation.length>0)cy.get('[data-cy=passwordConfirmation]').type(passwordConfirmation)
  }

  visitLogin(){
    cy.get('[data-cy=visit-login]').click();
  }

  submit() {
    cy.get('[data-cy=submit]').click();
  }

  getErrorRegister() {
    return cy.get('[data-cy=register-error]')
  }

  getLoginRequiredError(){
    return cy.get('[data-cy=login-required-error]')
  }

  getLoginPatternError(){
    return cy.get('[data-cy=login-pattern-error]')
  }

  getPasswordRequiredError(){
    return cy.get('[data-cy=password-required-error]')
  }

  getPasswordMinlengthError(){
    return cy.get('[data-cy=password-minlength-error]')
  }

  getPasswordMatchError(){
    return cy.get('[data-cy=password-match-error]')
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