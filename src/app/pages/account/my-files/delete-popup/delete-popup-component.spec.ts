import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletePopupComponent } from './delete-popup.component';
import { DownloadFile } from '../../../../core/model/DownloadFile';
import { ComponentRef } from '@angular/core';

const mockFile: DownloadFile = {
  fileLink: 'lien-test',
  name: 'rapport',
  extension: 'pdf',
  size: 10000,
  usePassword: false,
  daysUntilExpired: 3,
  tags: [],
};

describe('DeletePopupComponent', () => {
  let component: DeletePopupComponent;
  let fixture: ComponentFixture<DeletePopupComponent>;
  let componentRef: ComponentRef<DeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePopupComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('file', mockFile);
    fixture.detectChanges();
  });

  // ─── Unitaires ──────────────────────────────────────────────────────────────

  describe('message()', () => {
    it('doit construire le message avec le nom et l\'extension du fichier', () => {
      expect(component.message()).toBe(
        'Êtes-vous sûr de vouloir supprimer votre fichier rapport.pdf ?'
      );
    });

    it('doit gérer un fichier undefined', () => {
      componentRef.setInput('file', undefined);
      fixture.detectChanges();
      expect(component.message()).toBe(
        'Êtes-vous sûr de vouloir supprimer votre fichier undefined.undefined ?'
      );
    });
  });

  describe('cancelDelete()', () => {
    it('doit émettre l\'événement cancel', () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');
      component.cancelDelete();
      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('confirmDelete()', () => {
    it('doit émettre l\'événement confirm', () => {
      const confirmSpy = jest.spyOn(component.confirm, 'emit');
      component.confirmDelete();
      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template', () => {
    it('doit afficher le message de confirmation', () => {
      const p: HTMLElement = fixture.nativeElement.querySelector('[data-cy="popup-message"]');
      expect(p.textContent).toContain('rapport.pdf');
    });

    it('doit émettre cancel au clic sur Annuler', () => {
      const cancelSpy = jest.spyOn(component.cancel, 'emit');
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[data-cy="cancel-btn"]');
      btn.click();
      expect(cancelSpy).toHaveBeenCalled();
    });

    it('doit émettre confirm au clic sur Confirmer', () => {
      const confirmSpy = jest.spyOn(component.confirm, 'emit');
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[data-cy="confirm-btn"]');
      btn.click();
      expect(confirmSpy).toHaveBeenCalled();
    });

    it('doit afficher le titre "Suppression"', () => {
      const title: HTMLElement = fixture.nativeElement.querySelector('h2');
      expect(title.textContent).toBe('Suppression');
    });
  });
});