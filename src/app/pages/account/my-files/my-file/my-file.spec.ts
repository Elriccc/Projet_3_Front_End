import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyFileComponent } from './my-file.component';
import { DownloadFile } from '../../../../core/model/DownloadFile';
import { provideRouter, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ComponentRef } from '@angular/core';

const makeFile = (overrides: Partial<DownloadFile> = {}): DownloadFile => ({
  fileLink: 'lien-abc',
  name: 'document',
  extension: 'docx',
  size: 5000,
  usePassword: false,
  daysUntilExpired: 3,
  tags: [],
  ...overrides,
});

describe('MyFileComponent', () => {
  let component: MyFileComponent;
  let fixture: ComponentFixture<MyFileComponent>;
  let componentRef: ComponentRef<MyFileComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFileComponent, RouterModule],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyFileComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true); // <-- ajouter
  });

  // ─── filename() ─────────────────────────────────────────────────────────────

  describe('filename()', () => {
    it('doit retourner nom.extension', () => {
      componentRef.setInput('file', makeFile());
      fixture.detectChanges();
      expect(component.filename()).toBe('document.docx');
    });
  });

  // ─── expiration() ───────────────────────────────────────────────────────────

  describe('expiration()', () => {
    it('doit retourner "Expiré" pour daysUntilExpired <= 0', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 0 }));
      fixture.detectChanges();
      expect(component.expiration()).toBe('Expiré');
    });

    it('doit retourner "Expiré" pour daysUntilExpired négatif', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: -1 }));
      fixture.detectChanges();
      expect(component.expiration()).toBe('Expiré');
    });

    it('doit retourner "Expire demain" pour daysUntilExpired = 1', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 1 }));
      fixture.detectChanges();
      expect(component.expiration()).toBe('Expire demain');
    });

    it('doit retourner le message buildExpirationMessage pour daysUntilExpired = 3', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 3 }));
      fixture.detectChanges();
      expect(component.expiration()).toBe('Expire dans trois jours');
    });

    it('doit retourner le message pour 7 jours', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 7 }));
      fixture.detectChanges();
      expect(component.expiration()).toBe('Expire dans une semaine');
    });
  });

  // ─── deleteFileEvent() ───────────────────────────────────────────────────────

  describe('deleteFileEvent()', () => {
    it('doit émettre le fichier via deleteFileFromArray', () => {
      const file = makeFile();
      componentRef.setInput('file', file);
      fixture.detectChanges();
      const spy = jest.spyOn(component.deleteFileFromArray, 'emit');
      component.deleteFileEvent();
      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  // ─── gotoFile() ──────────────────────────────────────────────────────────────

  describe('gotoFile()', () => {
    it('doit naviguer vers /fileLink', () => {
      componentRef.setInput('file', makeFile({ fileLink: 'lien-abc' }));
      fixture.detectChanges();
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.gotoFile();
      expect(navigateSpy).toHaveBeenCalledWith(['/lien-abc']);
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template - fichier actif', () => {
    beforeEach(() => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 3 }));
      fixture.detectChanges();
    });

    it('doit afficher le nom du fichier', () => {
      const label = fixture.nativeElement.querySelector('[data-cy="file-name"]');
      expect(label.textContent).toBe('document.docx');
    });

    it('doit afficher la date d\'expiration', () => {
      const label = fixture.nativeElement.querySelector('[data-cy="file-expiration"]');
      expect(label.textContent).toBe('Expire dans trois jours');
    });

    it('doit afficher le bouton Supprimer', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="delete-btn"]');
      expect(btn).toBeTruthy();
    });

    it('doit afficher le bouton Accéder', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="goto-btn"]');
      expect(btn).toBeTruthy();
    });

    it('ne doit pas afficher l\'icône cadenas si usePassword = false', () => {
      const icon = fixture.nativeElement.querySelector('[data-cy="password-icon"]');
      expect(icon).toBeFalsy();
    });

    it('doit afficher l\'icône cadenas si usePassword = true', () => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 3, usePassword: true }));
      fixture.detectChanges();
      const icon = fixture.nativeElement.querySelector('[data-cy="password-icon"]');
      expect(icon).toBeTruthy();
    });

    it('doit appeler deleteFileEvent au clic sur Supprimer', () => {
      const spy = jest.spyOn(component.deleteFileFromArray, 'emit');
      fixture.nativeElement.querySelector('[data-cy="delete-btn"]').click();
      expect(spy).toHaveBeenCalled();
    });

    it('doit appeler gotoFile au clic sur Accéder', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      const spy = jest.spyOn(component, 'gotoFile');
      fixture.nativeElement.querySelector('[data-cy="goto-btn"]').click();
      expect(spy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/lien-abc']);
    });
  });

  describe('template - fichier expiré', () => {
    beforeEach(() => {
      componentRef.setInput('file', makeFile({ daysUntilExpired: 0 }));
      fixture.detectChanges();
    });

    it('doit afficher "Expiré" avec la classe label-error', () => {
      const label = fixture.nativeElement.querySelector('[data-cy="file-expiration"]');
      expect(label.classList).toContain('label-error');
      expect(label.textContent).toBe('Expiré');
    });

    it('ne doit pas afficher les boutons Supprimer et Accéder', () => {
      expect(fixture.nativeElement.querySelector('[data-cy="delete-btn"]')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('[data-cy="goto-btn"]')).toBeFalsy();
    });

    it('doit afficher le message d\'expiration', () => {
      const msg = fixture.nativeElement.querySelector('[data-cy="expired-message"]');
      expect(msg).toBeTruthy();
      expect(msg.textContent).toContain("Ce fichier a expiré");
    });
  });
});