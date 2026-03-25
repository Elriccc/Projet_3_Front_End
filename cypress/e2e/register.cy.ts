import HomePage from '../support/pages/HomePage';
import LoginPage from '../support/pages/LoginPage';
import RegisterPage from '../support/pages/RegisterPage';
import { Register } from '../support/fixtures';

describe('Création de compte', () => {
    let users: Record<string, Register>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("register").then((register) => { users = register })
    })

    beforeEach(() => {
        cy.mockApi();
        HomePage.visit();
        HomePage.connect();
        LoginPage.visitRegister();
    })

    it("Créer un compte fonctionne", () => {
        const validLogin = users['validLogin'];
        RegisterPage.register(validLogin.email, validLogin.password, validLogin.passwordConfirmation);
    })

    after(() => {cy.task("stopE2EDatabase");})
})