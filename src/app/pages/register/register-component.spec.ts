import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { LoginService } from '../../core/service/login.service';
import { provideRouter, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let loginServiceMock: { register: jest.Mock };
  let router: Router;

  const fillForm = (login: string, password: string, passwordConfirmation: string) => {
    component.registerForm.setValue({ login, password, passwordConfirmation });
  };

  beforeEach(async () => {
    loginServiceMock = { register: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterModule],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ─── Formulaire ─────────────────────────────────────────────────────────────

  describe('formulaire', () => {
    it('doit être invalide à l\'initialisation', () => {
      expect(component.registerForm.invalid).toBe(true);
    });

    it('doit être valide avec des champs corrects', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      expect(component.registerForm.valid).toBe(true);
    });

    it('doit invalider un email mal formaté', () => {
      fillForm('pasunemail', 'motdepasse123', 'motdepasse123');
      expect(component.form['login'].hasError('pattern')).toBe(true);
    });

    it('doit invalider un mot de passe trop court', () => {
      fillForm('user@test.com', 'abc', 'abc');
      expect(component.form['password'].hasError('minlength')).toBe(true);
    });

    it('doit invalider un email vide', () => {
      fillForm('', 'motdepasse123', 'motdepasse123');
      expect(component.form['login'].hasError('required')).toBe(true);
    });

    it('doit invalider un mot de passe vide', () => {
      fillForm('user@test.com', '', '');
      expect(component.form['password'].hasError('required')).toBe(true);
    });
  });

  // ─── onPasswordConfirmationChange() ─────────────────────────────────────────

  describe('onPasswordConfirmationChange()', () => {
    it('doit passer passwordsFieldDontMatch à true si les mots de passe diffèrent', () => {
      fillForm('user@test.com', 'motdepasse123', 'différent456');
      component.onPasswordConfirmationChange();
      expect(component.passwordsFieldDontMatch).toBe(true);
    });

    it('doit passer passwordsFieldDontMatch à false si les mots de passe sont identiques', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      component.onPasswordConfirmationChange();
      expect(component.passwordsFieldDontMatch).toBe(false);
    });
  });

  // ─── onSubmit() ─────────────────────────────────────────────────────────────

  describe('onSubmit()', () => {
    it('ne doit pas appeler le service si le formulaire est invalide', () => {
      component.onSubmit();
      expect(loginServiceMock.register).not.toHaveBeenCalled();
    });

    it('doit naviguer vers /login en cas de succès', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      loginServiceMock.register.mockReturnValue(of({}));
      const navigateSpy = jest.spyOn(router, 'navigate');

      component.onSubmit();

      expect(loginServiceMock.register).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('doit afficher une erreur 400 (email déjà existant)', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      loginServiceMock.register.mockReturnValue(throwError(() => ({ status: 400 })));

      component.onSubmit();

      expect(component.registerError()).toBe("L'email choisit existe déjà");
    });

    it('doit afficher une erreur 500', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      loginServiceMock.register.mockReturnValue(throwError(() => ({ status: 500 })));

      component.onSubmit();

      expect(component.registerError()).toBe('Le serveur ne répond pas');
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template', () => {
    it('ne doit pas afficher le message d\'erreur si registerError est vide', () => {
      const errDiv = fixture.nativeElement.querySelector('[data-cy="register-error"]');
      expect(errDiv).toBeFalsy();
    });

    it('doit afficher le message d\'erreur si registerError est défini', () => {
      fillForm('user@test.com', 'motdepasse123', 'motdepasse123');
      loginServiceMock.register.mockReturnValue(throwError(() => ({ status: 400 })));
      component.onSubmit();
      fixture.detectChanges();

      const errDiv = fixture.nativeElement.querySelector('[data-cy="register-error"]');
      expect(errDiv).toBeTruthy();
      expect(errDiv.textContent).toContain("L'email choisit existe déjà");
    });

    it('doit afficher l\'erreur required sur le champ login', () => {
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="login-required-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur de format email', () => {
      fillForm('pasunemail', 'motdepasse123', 'motdepasse123');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="login-pattern-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur required sur le mot de passe', () => {
      fillForm('user@test.com', '', '');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="password-required-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur minlength sur le mot de passe', () => {
      fillForm('user@test.com', 'abc', 'abc');
      component.onSubmit();
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="password-minlength-error"]');
      expect(errLabel).toBeTruthy();
    });

    it('doit afficher l\'erreur de confirmation si les mots de passe diffèrent', () => {
      fillForm('user@test.com', 'motdepasse123', 'différent456');
      component.passwordsFieldDontMatch = true;
      component.submitted = true;
      fixture.detectChanges();
      const errLabel = fixture.nativeElement.querySelector('[data-cy="password-match-error"]');
      expect(errLabel).toBeTruthy();
    });
  });
});