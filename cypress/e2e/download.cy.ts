import HomePage from '../support/pages/HomePage';
import UploadPage from '../support/pages/UploadPage';
import DownloadPage from '../support/pages/DownloadPage';
import { Download, Upload } from '../support/fixtures';

describe('Téléchargement', () => {
    let files: Record<string, Upload>;
    let downloadFiles: Record<string, Download>;
    let fileLink: string;
    let fileExpireTomorrowLink: string;
    let fileWithPasswordLink: string;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("upload").then((upload) => { 
            files = upload 
            //On crée 3 fichiers et on récupère leur lien avant la série de tests
            const file = files["correctFile"];
            const fileExpireTomorrow = files["correctFileExpireTomorrow"];
            const fileWithPassword = files["correctFileWithPassword"];
            cy.intercept('POST', '**/files').as('upload')

            //Fichier sans mot de passe, expire dans une semaine
            HomePage.visit()
            HomePage.upload()
            UploadPage.upload(file.fileName, file.password, file.expiration);
            cy.wait('@upload')
            UploadPage.getFileLink().then(($el) => {fileLink = $el.text().split('/').pop()+''; })

            //Fichier sans mot de passe, expire demain
            HomePage.visit()
            HomePage.upload()
            UploadPage.upload(fileExpireTomorrow.fileName, fileExpireTomorrow.password, fileExpireTomorrow.expiration);
            cy.wait('@upload')
            UploadPage.getFileLink().then(($el) => {fileExpireTomorrowLink = $el.text().split('/').pop()+''; })

            //Fichier avec mot de passe, expire dans une semaine
            HomePage.visit()
            HomePage.upload()
            UploadPage.upload(fileWithPassword.fileName, fileWithPassword.password, fileWithPassword.expiration);
            cy.wait('@upload')
            UploadPage.getFileLink().then(($el) => {fileWithPasswordLink = $el.text().split('/').pop()+''; })
        });
        cy.fixture("download").then((download) => { downloadFiles = download });
    })

    after(() => {cy.task("stopE2EDatabase");})

    beforeEach(() => {
        cy.intercept('POST', '**/files/download/*').as('download')
        cy.intercept('GET', '**/files/*').as('getFile')
    })

    function downloadFromFixture(fixtureDownload:string) {
        const download = downloadFiles[fixtureDownload];
        DownloadPage.download(download.password);
    }

    it("Télécharger un fichier fonctionne", () => {
        DownloadPage.visit(fileLink);
        cy.wait('@getFile');
        downloadFromFixture('noPassword');
        cy.wait('@download')
            .its('response.statusCode')
            .should('eq', 200);
    })

    it("Télécharger un fichier avec un mot de passe en saisissant le bon mot de passe fonctionne", () => {
        DownloadPage.visit(fileWithPasswordLink);
        cy.wait('@getFile');
        downloadFromFixture('goodPassword');
        cy.wait('@download')
            .its('response.statusCode')
            .should('eq', 200);
    })

    it("Télécharger un fichier en saisissant un mauvais mot de passe renvoie une erreur", () => {
        DownloadPage.visit(fileWithPasswordLink);
        cy.wait('@getFile');
        downloadFromFixture('passwordIncorrect');
        DownloadPage.getErrorDownload().should('exist');
    })
})