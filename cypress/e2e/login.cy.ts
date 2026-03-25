import HomePage from '../support/pages/HomePage';
import LoginPage from '../support/pages/LoginPage';
import RegisterPage from '../support/pages/RegisterPage';

describe('Connexion', () => {
    let loginDatas;
    let registerDatas;

    before(() => {cy.task("startE2EDatabase");})
    after(() => {cy.task("stopE2EDatabase");})

    it("Test", () => {
        
    })
})