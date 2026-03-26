import { TestBed } from '@angular/core/testing';
import { ErrorUtil } from './error-util';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('ErrorUtil', () => {
  let errorUtil: ErrorUtil;
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ErrorUtil,
        { provide: Router, useValue: routerMock },
      ],
    });

    errorUtil = TestBed.inject(ErrorUtil);
  });


  describe('returnRegisterError()', () => {
    it('doit afficher un message pour 400', (done) => {
      const registerError = signal('');
      throwError(() => ({ status: 400 }))
        .pipe(errorUtil.returnRegisterError(registerError))
        .subscribe({ complete: () => {
          expect(registerError()).toBe("L'email choisit existe déjà");
          done();
        }});
    });

    it('doit afficher un message pour 500', (done) => {
      const registerError = signal('');
      throwError(() => ({ status: 500 }))
        .pipe(errorUtil.returnRegisterError(registerError))
        .subscribe({ complete: () => {
          expect(registerError()).toBe('Le serveur ne répond pas');
          done();
        }});
    });

    it('doit vider le message pour un code inconnu', (done) => {
      const registerError = signal('ancien message');
      throwError(() => ({ status: 0 }))
        .pipe(errorUtil.returnRegisterError(registerError))
        .subscribe({ error: () => {
          expect(registerError()).toBe('');
          done();
        }});
    });
  });


  describe('returnLoginError()', () => {
    it('doit afficher un message pour 400', (done) => {
      const loginError = signal('');
      throwError(() => ({ status: 400 }))
        .pipe(errorUtil.returnLoginError(loginError))
        .subscribe({ complete: () => {
          expect(loginError()).toBe('Email ou mot de passe incorrect');
          done();
        }});
    });

    it('doit afficher un message pour 500', (done) => {
      const loginError = signal('');
      throwError(() => ({ status: 500 }))
        .pipe(errorUtil.returnLoginError(loginError))
        .subscribe({ complete: () => {
          expect(loginError()).toBe('Le serveur ne répond pas');
          done();
        }});
    });

    it('doit vider le message pour un code inconnu', (done) => {
      const loginError = signal('ancien');
      throwError(() => ({ status: 0 }))
        .pipe(errorUtil.returnLoginError(loginError))
        .subscribe({ error: () => {
          expect(loginError()).toBe('');
          done();
        }});
    });
  });


  describe('returnRetrieveFileByLinkError()', () => {
    it('doit naviguer vers / pour 404', (done) => {
      const daysUntilExpired = signal(5);
      const loaded = signal(false);
      throwError(() => ({ status: 404 }))
        .pipe(errorUtil.returnRetrieveFileByLinkError(routerMock as any, daysUntilExpired, loaded))
        .subscribe({ complete: () => {
          expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
          done();
        }});
    });

    it('doit naviguer vers / pour 500', (done) => {
      const daysUntilExpired = signal(5);
      const loaded = signal(false);
      throwError(() => ({ status: 500 }))
        .pipe(errorUtil.returnRetrieveFileByLinkError(routerMock as any, daysUntilExpired, loaded))
        .subscribe({ complete: () => {
          expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
          done();
        }});
    });

    it('doit mettre daysUntilExpired à 0 et loaded à true pour 410', (done) => {
      const daysUntilExpired = signal(5);
      const loaded = signal(false);
      throwError(() => ({ status: 410 }))
        .pipe(errorUtil.returnRetrieveFileByLinkError(routerMock as any, daysUntilExpired, loaded))
        .subscribe({ complete: () => {
          expect(daysUntilExpired()).toBe(0);
          expect(loaded()).toBe(true);
          expect(routerMock.navigate).not.toHaveBeenCalled();
          done();
        }});
    });
  });


  describe('returnUploadError()', () => {
    it('doit afficher un message pour 400', (done) => {
      const uploadError = signal('');
      throwError(() => ({ status: 400 }))
        .pipe(errorUtil.returnUploadError(uploadError))
        .subscribe({ complete: () => {
          expect(uploadError()).toContain("L'extension du fichier est incorrect");
          done();
        }});
    });

    it('doit afficher un message pour 500', (done) => {
      const uploadError = signal('');
      throwError(() => ({ status: 500 }))
        .pipe(errorUtil.returnUploadError(uploadError))
        .subscribe({ complete: () => {
          expect(uploadError()).toBe('Le serveur ne répond pas');
          done();
        }});
    });

    it('doit vider le message pour un code inconnu', (done) => {
      const uploadError = signal('ancien');
      throwError(() => ({ status: 0 }))
        .pipe(errorUtil.returnUploadError(uploadError))
        .subscribe({ error: () => {
          expect(uploadError()).toBe('');
          done();
        }});
    });
  });


  describe('returnDownloadError()', () => {
    it('doit afficher un message pour 400', (done) => {
      const downloadError = signal('');
      throwError(() => ({ status: 400 }))
        .pipe(errorUtil.returnDownloadError(downloadError))
        .subscribe({ complete: () => {
          expect(downloadError()).toBe('Le mot de passe est incorrect');
          done();
        }});
    });

    it('doit afficher un message pour 404', (done) => {
      const downloadError = signal('');
      throwError(() => ({ status: 404 }))
        .pipe(errorUtil.returnDownloadError(downloadError))
        .subscribe({ complete: () => {
          expect(downloadError()).toBe("Le fichier n'existe plus");
          done();
        }});
    });

    it('doit afficher un message pour 500', (done) => {
      const downloadError = signal('');
      throwError(() => ({ status: 500 }))
        .pipe(errorUtil.returnDownloadError(downloadError))
        .subscribe({ complete: () => {
          expect(downloadError()).toBe('Le serveur ne répond pas');
          done();
        }});
    });

    it('doit vider le message pour un code inconnu', (done) => {
      const downloadError = signal('ancien');
      throwError(() => ({ status: 0 }))
        .pipe(errorUtil.returnDownloadError(downloadError))
        .subscribe({ error: () => {
          expect(downloadError()).toBe('');
          done();
        }});
    });
  });
});