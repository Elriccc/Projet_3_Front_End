import HomePage from '../support/pages/HomePage';
import LoginPage from '../support/pages/LoginPage';
import RegisterPage from '../support/pages/RegisterPage';
import { Register } from '../support/fixtures';

describe('Création de compte', () => {
    let users: Record<string, Register>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("register").then((register) => { users = register });
    })

    after(() => {cy.task("stopE2EDatabase");})

    beforeEach(() => {
        cy.intercept('POST', '**/register').as('register')
        HomePage.visit();
        HomePage.connect();
        LoginPage.visitRegister();
    })

    function registerFromFixture(fixtureRegister: string){
        const login = users[fixtureRegister];
        RegisterPage.register(login.email, login.password, login.passwordConfirmation);
    }

    it("Créer un compte fonctionne", () => {
        registerFromFixture('validLogin')       
        cy.wait('@register')
        LoginPage.checkTitle();
    })

    it("Créer un compte avec un email vide affiche une erreur sur l'email", () => {
        registerFromFixture('emailEmpty')       
        RegisterPage.getLoginRequiredError().should('exist')
    })

    it("Créer un compte avec un email au mauvais format affiche une erreur sur l'email", () => {
        registerFromFixture('emailIncorrect')       
        RegisterPage.getLoginPatternError().should('exist')
    })

    it("Créer un compte avec un mot de passe vide affiche une erreur sur le mot de passe", () => {
        registerFromFixture('passwordEmpty')       
        RegisterPage.getPasswordRequiredError().should('exist')
    })

    it("Créer un compte avec un mot de passe trop court affiche une erreur sur le mot de passe", () => {
        registerFromFixture('passwordTooShort')       
        RegisterPage.getPasswordMinlengthError().should('exist')
    })

    it("Créer un compte avec un mot de passe mal confirmé affiche une erreur sur le mot de passe", () => {
        registerFromFixture('passwordDoesNotMatch')       
        RegisterPage.getPasswordMatchError().should('exist')
    })

})