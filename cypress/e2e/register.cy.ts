import HomePage from '../support/pages/HomePage';
import LoginPage from '../support/pages/LoginPage';
import RegisterPage from '../support/pages/RegisterPage';
import { Register } from '../support/fixtures';

describe('Création de compte', () => {
    let users: Record<string, Register>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.wait(4000)
        cy.fixture("register").then((register) => { users = register });
    })

    after(() => {cy.task("stopE2EDatabase");})

    beforeEach(() => {
        cy.intercept('POST', '**/register').as('register')
        HomePage.visit();
        HomePage.connect();
        LoginPage.visitRegister();
    })

    it("Créer un compte fonctionne", () => {
        const validLogin = users['validLogin'];
        RegisterPage.register(validLogin.email, validLogin.password, validLogin.passwordConfirmation);
        cy.wait('@register')
        LoginPage.checkTitle();
    })

})