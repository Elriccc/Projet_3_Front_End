import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyFilesComponent } from './/my-files.component';
import { FileService } from '../../../core/service/file.service';
import { AuthUtil } from '../../../core/util/auth-util';
import { DownloadFile } from '../../../core/model/DownloadFile';
import { provideRouter, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

const makeFile = (overrides: Partial<DownloadFile> = {}): DownloadFile => ({
  fileLink: 'lien-abc',
  name: 'document',
  extension: 'pdf',
  size: 5000,
  usePassword: false,
  daysUntilExpired: 3,
  tags: [],
  ...overrides,
});

const fileActif1 = makeFile({ fileLink: 'lien-1', name: 'fichier1', daysUntilExpired: 2 });
const fileActif2 = makeFile({ fileLink: 'lien-2', name: 'fichier2', daysUntilExpired: 5 });
const fileExpiré = makeFile({ fileLink: 'lien-3', name: 'fichier3', daysUntilExpired: 0 });

describe('MyFilesComponent', () => {
  let component: MyFilesComponent;
  let fixture: ComponentFixture<MyFilesComponent>;
  let fileServiceMock: jest.Mocked<Partial<FileService>>;
  let authUtilMock: { disconnect: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    fileServiceMock = {
      retrieveAllFiles: jest.fn().mockReturnValue(of([fileActif1, fileExpiré, fileActif2])),
      delete: jest.fn().mockReturnValue(of({})),
    };

    authUtilMock = { disconnect: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MyFilesComponent, RouterModule],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: AuthUtil, useValue: authUtilMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFilesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ─── Initialisation ─────────────────────────────────────────────────────────

  describe('initialisation', () => {
    it('doit charger et trier les fichiers (actifs avant expirés, puis par jours croissants)', () => {
      const files = component.files();
      expect(files[0].fileLink).toBe('lien-1'); // 2 jours
      expect(files[1].fileLink).toBe('lien-2'); // 5 jours
      expect(files[2].fileLink).toBe('lien-3'); // expiré
    });

    it('doit passer filesLoaded à true après le chargement', () => {
      expect(component.filesLoaded()).toBe(true);
    });

    it('doit gérer un tableau vide', () => {
      fileServiceMock.retrieveAllFiles!.mockReturnValue(of([]));
      const fixture2 = TestBed.createComponent(MyFilesComponent);
      fixture2.detectChanges();
      expect(fixture2.componentInstance.files()).toEqual([]);
      expect(fixture2.componentInstance.filesLoaded()).toBe(true);
    });
  });

  // ─── Filtres ────────────────────────────────────────────────────────────────

  describe('allFiles()', () => {
    it('doit remettre tous les fichiers', () => {
      component.expiredFiles();
      component.allFiles();
      expect(component.files().length).toBe(3);
    });
  });

  describe('activeFiles()', () => {
    it('doit ne garder que les fichiers avec daysUntilExpired > 0', () => {
      component.activeFiles();
      expect(component.files().every(f => f.daysUntilExpired > 0)).toBe(true);
      expect(component.files().length).toBe(2);
    });
  });

  describe('expiredFiles()', () => {
    it('doit ne garder que les fichiers expirés', () => {
      component.expiredFiles();
      expect(component.files().every(f => f.daysUntilExpired <= 0)).toBe(true);
      expect(component.files().length).toBe(1);
    });
  });

  // ─── Popup ──────────────────────────────────────────────────────────────────

  describe('showPopup()', () => {
    it('doit définir selectedFile et afficher la popup', () => {
      component.showPopup(fileActif1);
      expect(component.selectedFile).toBe(fileActif1);
      expect(component.isPopupVisible()).toBe(true);
    });
  });

  describe('cancelDelete()', () => {
    it('doit réinitialiser selectedFile et masquer la popup', () => {
      component.showPopup(fileActif1);
      component.cancelDelete();
      expect(component.selectedFile).toBeUndefined();
      expect(component.isPopupVisible()).toBe(false);
    });
  });

  // ─── Suppression ────────────────────────────────────────────────────────────

  describe('deleteFile()', () => {
    it('doit supprimer le fichier sélectionné de la liste et du cache', () => {
      component.showPopup(fileActif1);
      component.deleteFile();

      expect(fileServiceMock.delete).toHaveBeenCalledWith('lien-1');
      expect(component.files().find(f => f.fileLink === 'lien-1')).toBeUndefined();
      expect(component.cachedFiles.find(f => f.fileLink === 'lien-1')).toBeUndefined();
    });

    it('doit masquer la popup après suppression', () => {
      component.showPopup(fileActif1);
      component.deleteFile();
      expect(component.isPopupVisible()).toBe(false);
    });

    it('doit réinitialiser selectedFile après suppression', () => {
      component.showPopup(fileActif1);
      component.deleteFile();
      expect(component.selectedFile).toBeUndefined();
    });

    it('ne doit rien faire si selectedFile est undefined', () => {
      component.selectedFile = undefined;
      component.deleteFile();
      expect(fileServiceMock.delete).not.toHaveBeenCalled();
    });
  });

  // ─── Déconnexion ────────────────────────────────────────────────────────────

  describe('disconnect()', () => {
    it('doit appeler authUtil.disconnect et naviguer vers /', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.disconnect();
      expect(authUtilMock.disconnect).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template', () => {
    it('doit afficher autant de app-my-file que de fichiers', () => {
      const items = fixture.nativeElement.querySelectorAll('app-my-file');
      expect(items.length).toBe(3);
    });

    it('doit afficher la popup si isPopupVisible = true', () => {
      component.showPopup(fileActif1);
      fixture.detectChanges();
      const popup = fixture.nativeElement.querySelector('app-delete-popup');
      expect(popup).toBeTruthy();
    });

    it('ne doit pas afficher la popup si isPopupVisible = false', () => {
      const popup = fixture.nativeElement.querySelector('app-delete-popup');
      expect(popup).toBeFalsy();
    });

    it('doit filtrer sur "Actifs" au clic du radio correspondant', () => {
      const radio = fixture.nativeElement.querySelector('#my-files-switch-active');
      radio.click();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('app-my-file');
      expect(items.length).toBe(2);
    });

    it('doit filtrer sur "Expirés" au clic du radio correspondant', () => {
      const radio = fixture.nativeElement.querySelector('#my-files-switch-expired');
      radio.click();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('app-my-file');
      expect(items.length).toBe(1);
    });

    it('doit remettre tous les fichiers au clic sur "Tous"', () => {
      const radioExpired = fixture.nativeElement.querySelector('#my-files-switch-expired');
      radioExpired.click();
      fixture.detectChanges();
      const radioAll = fixture.nativeElement.querySelector('#my-files-switch-all');
      radioAll.click();
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('app-my-file');
      expect(items.length).toBe(3);
    });

    it('doit appeler disconnect() au clic sur le bouton Déconnexion', () => {
      const spy = jest.spyOn(component, 'disconnect');
      fixture.nativeElement.querySelector('[data-cy="disconnect-btn"]').click();
      expect(spy).toHaveBeenCalled();
    });
  });
});