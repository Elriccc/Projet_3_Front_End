import HomePage from '../support/pages/HomePage';
import UploadPage from '../support/pages/UploadPage';
import DownloadPage from '../support/pages/DownloadPage';

describe('Téléchargement', () => {
    before(() => {cy.task("startE2EDatabase");})
    after(() => {cy.task("stopE2EDatabase");})

    it("Test", () => {
        
    })
})