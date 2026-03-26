import { Login, Register } from '../support/fixtures';
import HomePage from '../support/pages/HomePage';
import LoginPage from '../support/pages/LoginPage';
import RegisterPage from '../support/pages/RegisterPage';

describe('Connexion', () => {
    let registerUsers: Record<string, Register>;
    let loginUsers: Record<string, Login>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("register").then((register) => { 
            registerUsers = register 
            //On crée un compte correct avant la série de tests
            const login = registerUsers['validLogin'];
            cy.intercept('POST', '**/register').as('register');
            HomePage.visit();
            HomePage.connect();
            LoginPage.visitRegister();
            RegisterPage.register(login.email, login.password, login.passwordConfirmation);
            cy.wait('@register');
        });
        cy.fixture("login").then((login) => { loginUsers = login });

        
    })
    after(() => {cy.task("stopE2EDatabase");})

    beforeEach(() => {
        cy.intercept('POST', '**/login').as('login');
        HomePage.visit();
        HomePage.connect();
    })

    function loginFromFixtureLogin(fixtureLogin: string){
        const validLogin = loginUsers[fixtureLogin];
        LoginPage.login(validLogin.email, validLogin.password);
    }

    it("Se connecter avec des informations correctes fonctionne", () => {
        loginFromFixtureLogin("validLogin")
        cy.wait('@login');
        HomePage.isConnected()
    })

    it("Se connecter à un utilisateur qui n'existe pas renvoie une erreur", () => {
        loginFromFixtureLogin("nonExistingLogin")
        cy.wait('@login');
        LoginPage.getErrorLogin().should('exist')
    })

    it("Se connecter avec un email vide affiche une erreur sur l'email", () => {
        loginFromFixtureLogin("emailEmpty")
        LoginPage.getLoginRequiredError().should('exist')
    })

    it("Se connecter avec un email au mauvais format affiche une erreur sur l'email", () => {
        loginFromFixtureLogin("emailIncorrect")
        LoginPage.getLoginPatternError().should('exist')
    })

    it("Se connecter avec un mot de passe vide met une erreur sur le mot de passe", () => {
        loginFromFixtureLogin("passwordEmpty")
        LoginPage.getPasswordRequiredError().should('exist')
    })

    it("Se connecter avec un mot de passe trop court met une erreur sur le mot de passe", () => {
        loginFromFixtureLogin("passwordTooShortUser")
        LoginPage.getPasswordMinlengthError().should('exist')
    })
})