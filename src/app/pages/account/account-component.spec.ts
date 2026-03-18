import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';
import { provideRouter, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent, RouterModule],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    // Neutraliser le clic automatique de ngAfterViewInit
    jest.spyOn(HTMLButtonElement.prototype, 'click').mockImplementation(() => {});
    fixture.detectChanges();
  });

  describe('ngAfterViewInit()', () => {
    it('doit cliquer automatiquement sur le bouton #myFiles au démarrage', () => {
      const clickSpy = jest.spyOn(HTMLButtonElement.prototype, 'click');
      fixture.detectChanges();
      expect(clickSpy).toHaveBeenCalled();
    });

    it('doit avoir une référence myFilesBtn valide après init', () => {
      fixture.detectChanges();
      expect(component.myFilesBtn).toBeTruthy();
      expect(component.myFilesBtn.nativeElement.tagName).toBe('BUTTON');
    });
  });

  describe('template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('doit contenir un lien vers / (bouton DataShare)', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="home-btn"]');
      expect(btn).toBeTruthy();
    });

    it('doit contenir un bouton Mes fichiers avec routerLink /account/my-files', () => {
      const btn = fixture.debugElement.query(By.css('[data-cy="my-files-btn"]'));
      expect(btn).toBeTruthy();
    });

    it('doit contenir un router-outlet', () => {
      const outlet = fixture.nativeElement.querySelector('router-outlet');
      expect(outlet).toBeTruthy();
    });
  });
});