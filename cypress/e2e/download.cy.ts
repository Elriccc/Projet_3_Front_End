import HomePage from '../support/pages/HomePage';
import UploadPage from '../support/pages/UploadPage';
import DownloadPage from '../support/pages/DownloadPage';
import { Download, Upload } from '../support/fixtures';

describe('Téléchargement', () => {
    let files: Record<string, Upload>;
    let downloadFiles: Record<string, Download>;

    before(() => {
        cy.task("startE2EDatabase");
        cy.fixture("upload").then((upload) => { files = upload });
        cy.fixture("download").then((download) => { downloadFiles = download });
    })

    after(() => {cy.task("stopE2EDatabase");})

    it("Télécharger un fichier fonctionne", () => {
        
    })
})