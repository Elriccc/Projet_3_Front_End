import { TestBed } from '@angular/core/testing';
import { AuthUtil } from './auth-util';
import { LoginService } from '../service/login.service';
import { UserService } from '../../user-service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('AuthUtil', () => {
  let authUtil: AuthUtil;
  let loginServiceMock: jest.Mocked<LoginService>;
  let userService: UserService;

  beforeEach(() => {
    loginServiceMock = {
      isAuthTokenCorrect: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    } as unknown as jest.Mocked<LoginService>;

    TestBed.configureTestingModule({
      providers: [
        AuthUtil,
        UserService,
        { provide: LoginService, useValue: loginServiceMock },
      ],
    });

    authUtil = TestBed.inject(AuthUtil);
    userService = TestBed.inject(UserService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('isAuthenticated()', () => {
    it('doit retourner false et déconnecter si aucun token en session', async () => {
      const result = await authUtil.isAuthenticated();
      expect(result).toBe(false);
      expect(userService.Connected()).toBe(false);
    });

    it('doit retourner true si le token est valide', async () => {
      sessionStorage.setItem('accessToken', 'token-valide');
      loginServiceMock.isAuthTokenCorrect.mockReturnValue(of({ valid: true }));

      const result = await authUtil.isAuthenticated();
      expect(result).toBe(true);
    });

    it('doit retourner false et déconnecter si l\'API répond false', async () => {
      sessionStorage.setItem('accessToken', 'token-invalide');
      loginServiceMock.isAuthTokenCorrect.mockReturnValue(of(false));

      const result = await authUtil.isAuthenticated();
      expect(result).toBe(false);
      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });

    it('doit retourner false si l\'API retourne une erreur', async () => {
      sessionStorage.setItem('accessToken', 'token-erreur');
      loginServiceMock.isAuthTokenCorrect.mockReturnValue(
        throwError(() => new Error('Erreur serveur'))
      );

      const result = await authUtil.isAuthenticated();
      expect(result).toBe(false);
    });
  });

  describe('storeLogin()', () => {
    it('doit stocker le token en session', () => {
      authUtil.storeLogin('mon-jwt', 'user@test.com');
      expect(sessionStorage.getItem('accessToken')).toBe('mon-jwt');
    });

    it('doit vider la session avant de stocker', () => {
      sessionStorage.setItem('autreClef', 'autreValeur');
      authUtil.storeLogin('nouveau-jwt', 'user@test.com');
      expect(sessionStorage.getItem('autreClef')).toBeNull();
      expect(sessionStorage.getItem('accessToken')).toBe('nouveau-jwt');
    });
  });

  describe('disconnect()', () => {
    it('doit vider la session', () => {
      sessionStorage.setItem('accessToken', 'token');
      authUtil.disconnect();
      expect(sessionStorage.getItem('accessToken')).toBeNull();
    });

    it('doit déconnecter le UserService', () => {
      userService.connect();
      authUtil.disconnect();
      expect(userService.Connected()).toBe(false);
    });
  });

  describe('initAuth()', () => {
    it('doit connecter l\'utilisateur et passer loaded à true si authentifié', async () => {
      sessionStorage.setItem('accessToken', 'token-valide');
      loginServiceMock.isAuthTokenCorrect.mockReturnValue(of({ valid: true }));
      const loaded = signal(false);

      authUtil.initAuth(loaded);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(userService.Connected()).toBe(true);
      expect(loaded()).toBe(true);
    });

    it('doit déconnecter et passer loaded à true si non authentifié', async () => {
      const loaded = signal(false);

      authUtil.initAuth(loaded);
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(userService.Connected()).toBe(false);
      expect(loaded()).toBe(true);
    });
  });
});