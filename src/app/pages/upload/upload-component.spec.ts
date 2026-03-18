import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadComponent } from './upload.component';
import { FileService } from '../../core/service/file.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { provideRouter, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DownloadFile } from '../../core/model/DownloadFile';

const mockDownloadFile: DownloadFile = {
  fileLink: 'lien-upload',
  name: 'fichier',
  extension: 'zip',
  size: 204800,
  usePassword: false,
  daysUntilExpired: 7,
  tags: [],
};

const makeFileEvent = (name: string, size: number): Event => {
  const file = new File([], name);  // <-- tableau vide, pas 'x'.repeat(size)
  Object.defineProperty(file, 'size', { value: size, configurable: true });
  const input = document.createElement('input');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  return { target: input } as unknown as Event;
};

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let fileServiceMock: { upload: jest.Mock };
  let clipboardMock: { copy: jest.Mock };

  beforeEach(async () => {
    fileServiceMock = { upload: jest.fn() };
    clipboardMock = { copy: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [UploadComponent, RouterModule],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: Clipboard, useValue: clipboardMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── onFileSelected() ───────────────────────────────────────────────────────

  describe('onFileSelected()', () => {
    it('doit mettre à jour fileName et fileSizeStr pour un fichier valide', () => {
      component.onFileSelected(makeFileEvent('archive.zip', 50_000));
      expect(component.fileName()).toBe('archive.zip');
      expect(component.fileSizeStr()).toBe('50.00 Ko');
    });

    it('doit signaler une erreur si le fichier fait moins de 1 Ko', () => {
      component.onFileSelected(makeFileEvent('petit.txt', 500));
      expect(component.fileSizeError()).toBe('Le fichier doit faire au moins 1Ko');
    });

    it('doit signaler une erreur si le fichier dépasse 1 Go', () => {
      component.onFileSelected(makeFileEvent('gros.iso', 1_100_000_000));
      expect(component.fileSizeError()).toContain("Le fichier ne peut pas faire plus d'1Go");
    });

    it('doit signaler une erreur si le nom dépasse 255 caractères', () => {
      const longName = 'a'.repeat(256) + '.txt';
      component.onFileSelected(makeFileEvent(longName, 5000));
      expect(component.fileNameError()).toBe('Le nom du fichier est trop long');
    });

    it('doit réinitialiser le nom si aucun fichier sélectionné', () => {
      const input = document.createElement('input');
      Object.defineProperty(input, 'files', { value: [] });
      component.onFileSelected({ target: input } as unknown as Event);
      expect(component.fileName()).toBe('Aucun fichier sélectionné');
      expect(component.fileSizeStr()).toBe('');
    });

    it('doit vider les erreurs précédentes à chaque sélection', () => {
      component.onFileSelected(makeFileEvent('petit.txt', 500));
      expect(component.fileSizeError()).not.toBe('');
      component.onFileSelected(makeFileEvent('ok.zip', 5000));
      expect(component.fileSizeError()).toBe('');
      expect(component.fileNameError()).toBe('');
    });
  });

  // ─── onSubmit() ─────────────────────────────────────────────────────────────

  describe('onSubmit()', () => {
    const prepareValidForm = () => {
      (component as any).uploadFile = {
        password: '',
        expirationTime: 7,
        file: new File([], 'test.zip'),
      };
      component.fileName.set('test.zip');
      component.fileSizeStr.set('5.00 Ko');
      component.uploadForm.get('file')!.markAsDirty();
      component.uploadForm.get('file')!.setErrors(null);
      component.uploadForm.patchValue({ password: '', expiration: '7' });
    };

    it('ne doit pas appeler le service si le formulaire est invalide (aucun fichier)', () => {
      component.onSubmit();
      expect(fileServiceMock.upload).not.toHaveBeenCalled();
    });

    it('ne doit pas appeler le service si le nom est trop long', () => {
      component.onFileSelected(makeFileEvent('a'.repeat(256) + '.txt', 5000));
      component.uploadForm.patchValue({ expiration: '7' });
      component.onSubmit();
      expect(fileServiceMock.upload).not.toHaveBeenCalled();
    });

    it('ne doit pas appeler le service si le fichier est trop petit', () => {
      component.onFileSelected(makeFileEvent('petit.txt', 500));
      component.uploadForm.patchValue({ expiration: '7' });
      component.onSubmit();
      expect(fileServiceMock.upload).not.toHaveBeenCalled();
    });

    it('doit passer validated à true et afficher le lien en cas de succès', () => {
      prepareValidForm();
      fileServiceMock.upload.mockReturnValue(of(mockDownloadFile));
      // Simuler window.location.origin
      

      component.onSubmit();

      expect(component.validated()).toBe(true);
      expect(component.fileLink()).toBe('http://localhost:4200/lien-upload');
      expect(component.fileExpiration()).toContain('une semaine');
    });

    it('doit afficher l\'erreur 400 (extension incorrecte)', () => {
      prepareValidForm();
      fileServiceMock.upload.mockReturnValue(throwError(() => ({ status: 400 })));
      component.onSubmit();
      expect(component.uploadError()).toContain("L'extension du fichier est incorrect");
    });

    it('doit afficher l\'erreur 500', () => {
      prepareValidForm();
      fileServiceMock.upload.mockReturnValue(throwError(() => ({ status: 500 })));
      component.onSubmit();
      expect(component.uploadError()).toBe('Le serveur ne répond pas');
    });
  });

  // ─── copyLink() ─────────────────────────────────────────────────────────────

  describe('copyLink()', () => {
    it('doit copier le lien dans le presse-papier', () => {
      component['fileLink'].set('https://datashare.fr/lien-xyz');
      component.copyLink();
      expect(clipboardMock.copy).toHaveBeenCalledWith('https://datashare.fr/lien-xyz');
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template - formulaire initial', () => {
    it('doit afficher le bouton Téléverser désactivé si aucun fichier', () => {
      const disabledBtn = fixture.nativeElement.querySelector('[data-cy="upload-btn-disabled"]');
      expect(disabledBtn).toBeTruthy();
    });

    it('doit afficher le bouton Téléverser actif après sélection d\'un fichier', () => {
      component.uploadForm.get('file')!.markAsDirty();
      component.uploadForm.get('file')!.setErrors(null);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-cy="upload-btn"]');
      expect(btn).toBeTruthy();
    });

    it('doit afficher l\'erreur de taille après soumission avec fichier trop petit', () => {
      component.onFileSelected(makeFileEvent('petit.txt', 500));
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="file-size-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('ne doit pas afficher le message d\'erreur upload si uploadError est vide', () => {
      const errDiv = fixture.nativeElement.querySelector('[data-cy="upload-error"]');
      expect(errDiv).toBeFalsy();
    });
  });

  describe('template - après upload réussi', () => {
    beforeEach(() => {
      (component as any).uploadFile = {
        password: '',
        expirationTime: 7,
        file: new File([], 'test.zip'),
      };
      component.fileName.set('test.zip');
      component.fileSizeStr.set('5.00 Ko');
      component.uploadForm.get('file')!.markAsDirty();
      component.uploadForm.get('file')!.setErrors(null);
      component.uploadForm.patchValue({ password: '', expiration: '7' });
      fileServiceMock.upload.mockReturnValue(of(mockDownloadFile));
      component.onSubmit();
      fixture.detectChanges();
    });

    it('doit masquer le formulaire et afficher le résultat', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();
    });

    it('doit afficher le lien de téléchargement', () => {
      const link = fixture.nativeElement.querySelector('[data-cy="file-link"]');
      expect(link).toBeTruthy();
      expect(link.textContent).toContain('lien-upload');
    });

    it('doit appeler copyLink() au clic sur Copier le lien', () => {
      const spy = jest.spyOn(component, 'copyLink');
      fixture.nativeElement.querySelector('[data-cy="copy-btn"]').click();
      expect(spy).toHaveBeenCalled();
    });
  });
});