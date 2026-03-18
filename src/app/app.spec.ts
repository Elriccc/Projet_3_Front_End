import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthUtil } from './core/util/auth-util';
import { UserService } from './user-service';
import { provideRouter, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

describe('App (AppComponent)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let authUtilMock: { initAuth: jest.Mock };
  let userService: UserService;
  let router: Router;

  beforeEach(async () => {
    authUtilMock = {
      initAuth: jest.fn().mockImplementation((loaded) => {
        loaded.set(true);
      }),
    };

    await TestBed.configureTestingModule({
      imports: [App, RouterModule],
      providers: [
        UserService,
        { provide: AuthUtil, useValue: authUtilMock },
        provideRouter([{ path: '**', component: App }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('Démarrage', () => {
    it('doit appeler initAuth au démarrage', () => {
      expect(authUtilMock.initAuth).toHaveBeenCalled();
    });
  });


  describe('Méthode hasRoute()', () => {
    it("doit retourner true si l'URL contient la route", async () => {
      await router.navigate(['/upload']);
      expect(component.hasRoute('/upload')).toBe(true);
    });

    it("doit retourner false si l'URL ne contient pas la route", async () => {
      await router.navigate(['/upload']);
      expect(component.hasRoute('/account')).toBe(false);
    });
  });


  describe('Cas utilisateur non connecté', () => {
    it('doit afficher le bouton "Se connecter" si non connecté', () => {
      userService.disconnect();
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-cy="login-btn"]');
      expect(btn).toBeTruthy();
    });

    it('ne doit pas afficher le bouton "Mon espace" si non connecté', () => {
      userService.disconnect();
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('[data-cy="account-btn"]');
      expect(btn).toBeFalsy();
    });
  });

  describe('Cas utilisateur connecté', () => {
    beforeEach(() => {
      userService.connect();
      fixture.detectChanges();
    });

    it('doit afficher le bouton "Mon espace" si connecté', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="account-btn"]');
      expect(btn).toBeTruthy();
    });

    it('ne doit pas afficher le bouton "Se connecter" si connecté', () => {
      const btn = fixture.nativeElement.querySelector('[data-cy="login-btn"]');
      expect(btn).toBeFalsy();
    });
  });

  describe('Template page Mon Espace', () => {
    it('doit masquer le header et footer sur la route /account', async () => {
      await router.navigate(['/account']);
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('header');
      expect(header).toBeFalsy();
    });
  });

  describe('Template autres pages', () => {
    it('doit afficher le header et le footer hors de /account', async () => {
      await router.navigate(['/']);
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('header');
      const footer = fixture.nativeElement.querySelector('footer');
      expect(header).toBeTruthy();
      expect(footer).toBeTruthy();
    });
  });
});