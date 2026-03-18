import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../../core/service/login.service';
import { AuthUtil } from '../../core/util/auth-util';
import { UserService } from '../../user-service';
import { provideRouter, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceMock: { login: jest.Mock };
  let authUtilMock: { storeLogin: jest.Mock };
  let userService: UserService;
  let router: Router;

  const fillForm = (login: string, password: string) => {
    component.loginForm.setValue({ login, password });
  };

  beforeEach(async () => {
    loginServiceMock = { login: jest.fn() };
    authUtilMock = { storeLogin: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule],
      providers: [
        UserService,
        { provide: LoginService, useValue: loginServiceMock },
        { provide: AuthUtil, useValue: authUtilMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ─── Formulaire ─────────────────────────────────────────────────────────────

  describe('formulaire', () => {
    it('doit être invalide à l\'initialisation', () => {
      expect(component.loginForm.invalid).toBe(true);
    });

    it('doit être valide avec un email et un mot de passe corrects', () => {
      fillForm('user@test.com', 'motdepasse123');
      expect(component.loginForm.valid).toBe(true);
    });

    it('doit invalider un email mal formaté', () => {
      fillForm('pasUnEmail', 'motdepasse123');
      expect(component.loginForm.invalid).toBe(true);
      expect(component.form['login'].hasError('pattern')).toBe(true);
    });

    it('doit invalider un mot de passe trop court (< 8 caractères)', () => {
      fillForm('user@test.com', 'abc');
      expect(component.form['password'].hasError('minlength')).toBe(true);
    });

    it('doit invalider un email vide', () => {
      fillForm('', 'motdepasse123');
      expect(component.form['login'].hasError('required')).toBe(true);
    });

    it('doit invalider un mot de passe vide', () => {
      fillForm('user@test.com', '');
      expect(component.form['password'].hasError('required')).toBe(true);
    });
  });

  // ─── onSubmit() ─────────────────────────────────────────────────────────────

  describe('onSubmit()', () => {
    it('ne doit pas appeler le service si le formulaire est invalide', () => {
      component.onSubmit();
      expect(loginServiceMock.login).not.toHaveBeenCalled();
    });

    it('doit stocker le token et naviguer vers / en cas de succès', () => {
      fillForm('user@test.com', 'motdepasse123');
      loginServiceMock.login.mockReturnValue(of('mon.jwt.token'));
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.onSubmit();

      expect(authUtilMock.storeLogin).toHaveBeenCalledWith('mon.jwt.token', 'user@test.com');
      expect(userService.Connected()).toBe(true);
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('doit afficher une erreur 400', () => {
      fillForm('user@test.com', 'motdepasse123');
      loginServiceMock.login.mockReturnValue(throwError(() => ({ status: 400 })));

      component.onSubmit();

      expect(component.loginError()).toBe('Email ou mot de passe incorrect');
    });

    it('doit afficher une erreur 500', () => {
      fillForm('user@test.com', 'motdepasse123');
      loginServiceMock.login.mockReturnValue(throwError(() => ({ status: 500 })));

      component.onSubmit();

      expect(component.loginError()).toBe('Le serveur ne répond pas');
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template', () => {
    it('ne doit pas afficher le message d\'erreur si loginError est vide', () => {
      const errDiv = fixture.nativeElement.querySelector('[data-cy="login-error"]');
      expect(errDiv).toBeFalsy();
    });

    it('doit afficher le message d\'erreur si loginError est défini', () => {
      fillForm('user@test.com', 'motdepasse123');
      loginServiceMock.login.mockReturnValue(throwError(() => ({ status: 400 })));
      component.onSubmit();
      fixture.detectChanges();

      const errDiv = fixture.nativeElement.querySelector('[data-cy="login-error"]');
      expect(errDiv).toBeTruthy();
      expect(errDiv.textContent).toContain('Email ou mot de passe incorrect');
    });

    it('doit afficher l\'erreur required sur le champ login après soumission', () => {
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="login-required-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur de format email après soumission', () => {
      fillForm('pasunemail', 'motdepasse123');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="login-pattern-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur required sur le mot de passe après soumission', () => {
      fillForm('user@test.com', '');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="password-required-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur minlength sur le mot de passe après soumission', () => {
      fillForm('user@test.com', 'abc');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="password-minlength-error"]');
      expect(errLabel).toBeTruthy();
    });
  });
});