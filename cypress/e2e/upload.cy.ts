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

    it("Téléverser un fichier fonctionne", () => {
        
    })
})