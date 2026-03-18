jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadComponent } from './download.component';
import { FileService } from '../../core/service/file.service';
import { ErrorUtil } from '../../core/util/error-util';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DownloadFile } from '../../core/model/DownloadFile';
import * as FileSaver from 'file-saver';

const mockFileAvecMdp: DownloadFile = {
  fileLink: 'lien-test',
  name: 'rapport',
  extension: 'pdf',
  size: 204800,
  usePassword: true,
  daysUntilExpired: 3,
  tags: [],
};

const mockFileSansMdp: DownloadFile = {
  ...mockFileAvecMdp,
  usePassword: false,
};

const mockFileDemain: DownloadFile = {
  ...mockFileSansMdp,
  daysUntilExpired: 1,
};

describe('DownloadComponent', () => {
  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;
  let fileServiceMock: { retrieveFileByLink: jest.Mock; download: jest.Mock };
  let errorUtilMock: {
    returnRetrieveFileByLinkError: jest.Mock;
    returnDownloadError: jest.Mock;
  };
  let router: Router;

  const identityPipe = () => (source: any) => source;

  beforeEach(async () => {
    fileServiceMock = {
      retrieveFileByLink: jest.fn().mockReturnValue(of(mockFileSansMdp)),
      download: jest.fn().mockReturnValue(of(new Blob())),
    };

    errorUtilMock = {
      returnRetrieveFileByLinkError: jest.fn().mockReturnValue(identityPipe()),
      returnDownloadError: jest.fn().mockReturnValue(identityPipe()),
    };

    await TestBed.configureTestingModule({
      imports: [DownloadComponent], // retirer RouterModule
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: ErrorUtil, useValue: errorUtilMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'lien-test' } } },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  // ─── ngOnInit() ─────────────────────────────────────────────────────────────

  describe('ngOnInit()', () => {
    it('doit charger les infos du fichier sans mot de passe', () => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
      fixture.detectChanges();

      expect(component.fileName()).toBe('rapport.pdf');
      expect(component.daysUntilExpired()).toBe(3);
      expect(component.usePassword()).toBe(false);
      expect(component.loaded()).toBe(true);
    });

    it('doit charger les infos du fichier avec mot de passe', () => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileAvecMdp));
      fixture.detectChanges();

      expect(component.usePassword()).toBe(true);
      expect(component.downloadForm.contains('password')).toBe(true);
    });

    it('doit retirer le champ password du formulaire si usePassword = false', () => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
      fixture.detectChanges();

      expect(component.downloadForm.contains('password')).toBe(false);
    });

    it('doit construire le message d\'expiration', () => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
      fixture.detectChanges();

      expect(component.expirationMessage()).toContain('trois jours');
    });

    it('doit construire le message d\'expiration "demain" pour 1 jour', () => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileDemain));
      fixture.detectChanges();
      expect(component.expirationMessage()).toContain('un jours');
    });

    it('doit appeler retrieveFileByLink avec le bon lien', () => {
      fixture.detectChanges();
      expect(fileServiceMock.retrieveFileByLink).toHaveBeenCalledWith('lien-test');
    });
  });

  // ─── onSubmit() ─────────────────────────────────────────────────────────────

  describe('onSubmit() - sans mot de passe', () => {
    beforeEach(() => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
      fixture.detectChanges();
    });

    it('doit lancer le téléchargement avec un mot de passe vide', () => {
      component.onSubmit();
      expect(fileServiceMock.download).toHaveBeenCalledWith('lien-test', '');
    });

    it('doit appeler saveAs avec le bon nom de fichier', () => {
      component.onSubmit();
      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.anything(), 'rapport.pdf');
    });
  });

  describe('onSubmit() - avec mot de passe', () => {
    beforeEach(() => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileAvecMdp));
      fixture.detectChanges();
    });

    it('ne doit pas lancer le téléchargement si le formulaire est invalide (password vide)', () => {
      component.onSubmit();
      expect(fileServiceMock.download).not.toHaveBeenCalled();
    });

    it('doit lancer le téléchargement avec le mot de passe saisi', () => {
      component.downloadForm.setValue({ password: 'monSecret' });
      component.onSubmit();
      expect(fileServiceMock.download).toHaveBeenCalledWith('lien-test', 'monSecret');
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template - fichier actif sans mot de passe', () => {
    beforeEach(() => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
      fixture.detectChanges();
    });

    it('doit afficher le nom du fichier', () => {
      const label = fixture.nativeElement.querySelector('[data-cy="file-name"]');
      expect(label.textContent).toBe('rapport.pdf');
    });

    it('doit afficher la taille du fichier', () => {
      const label = fixture.nativeElement.querySelector('[data-cy="file-size"]');
      expect(label.textContent).toContain('Ko');
    });

    it('doit afficher l\'info d\'expiration (> 1 jour) avec le bon message', () => {
      const info = fixture.nativeElement.querySelector('[data-cy="expiration-info"]');
      expect(info).toBeTruthy();
    });

    it('doit afficher le bouton de téléchargement actif', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="download-btn"]');
      expect(btn).toBeTruthy();
    });

    it('ne doit pas afficher le champ mot de passe', () => {
      const passwordGroup = fixture.nativeElement.querySelector('[data-cy="password-group"]');
      expect(passwordGroup).toBeFalsy();
    });
  });

  describe('template - fichier avec 1 jour restant', () => {
    beforeEach(() => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileDemain));
      fixture.detectChanges();
    });

    it('doit afficher l\'alerte d\'expiration (1 jour)', () => {
      const alert = fixture.nativeElement.querySelector('[data-cy="expiration-alert"]');
      expect(alert).toBeTruthy();
    });
  });

  describe('template - fichier expiré (daysUntilExpired = 0)', () => {
      it('doit afficher le message d\'expiration quand loaded = true et daysUntilExpired = 0', () => {
        fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileSansMdp));
        fixture.detectChanges();
        component.daysUntilExpired.set(0);
        component.loaded.set(true);
        fixture.detectChanges();
        const errMsg = fixture.nativeElement.querySelector('[data-cy="expired-message"]');
        expect(errMsg).toBeTruthy();
        expect(errMsg.textContent).toContain('expiré');
      });
    });

  describe('template - avec mot de passe', () => {
    beforeEach(() => {
      fileServiceMock.retrieveFileByLink.mockReturnValue(of(mockFileAvecMdp));
      fixture.detectChanges();
    });

    it('doit afficher le champ mot de passe', () => {
      const passwordGroup = fixture.nativeElement.querySelector('[data-cy="password-group"]');
      expect(passwordGroup).toBeTruthy();
    });

    it('doit afficher le bouton de téléchargement désactivé si password vide', () => {
      const disabledBtn = fixture.nativeElement.querySelector('[data-cy="download-btn-disabled"]');
      expect(disabledBtn).toBeTruthy();
    });

    it('doit afficher le bouton actif si mot de passe saisi', () => {
      component.downloadForm.setValue({ password: 'monSecret' });
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-cy="download-btn"]');
      expect(btn).toBeTruthy();
    });
  });
});