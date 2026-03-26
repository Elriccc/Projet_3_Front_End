import { Upload } from '../support/fixtures';
import HomePage from '../support/pages/HomePage';
import UploadPage from '../support/pages/UploadPage';

describe('Téléversement', () => {
    let files: Record<string, Upload>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("upload").then((upload) => { files = upload });
    })

    after(() => {cy.task("stopE2EDatabase");})

    beforeEach(() => {
        cy.intercept('POST', '**/files').as('upload')
        HomePage.visit();
        HomePage.upload()
    })

    function uploadFromFixture(fixtureUpload: string){
        const upload = files[fixtureUpload]
        UploadPage.upload(upload.fileName, upload.password, upload.expiration)    
    }

    it("Téléverser un fichier fonctionne", () => {
        uploadFromFixture("correctFile")
        cy.wait('@upload')
        UploadPage.getCopyButton().should('exist');
    })

    it("Téléverser un fichier de moins d'1Ko envoie une erreur", () => {
        uploadFromFixture("tooSmallFile")
        UploadPage.getFilSizeError().should('exist');
    })

    it("Téléverser un fichier avec une extension incorrecte envoie une erreur", () => {
        uploadFromFixture("incorrectExtensionFile")
        UploadPage.getErrorUpload().should('exist');
    })

    it("Téléverser un fichier qui expire demain fonctionne", () => {
        uploadFromFixture("correctFileExpireTomorrow")
        cy.wait('@upload')
        UploadPage.getCopyButton().should('exist');
    })
    
    it("Téléverser un fichier correct avec un mot de passe fonctionne", () => {
        uploadFromFixture("correctFileWithPassword")
        cy.wait('@upload')
        UploadPage.getCopyButton().should('exist');
    })

    it("Téléverser un fichier avec un mot de passe trop court envoie une erreur", () => {
        uploadFromFixture("passwordTooShort")
        UploadPage.getPasswordTooShortError().should('exist');
    })
})