declare namespace Cypress {
  interface Chainable<Subject = any> {
    mockApi(): Chainable<Subject>
  }
}

Cypress.Commands.add('mockApi', () => {

})