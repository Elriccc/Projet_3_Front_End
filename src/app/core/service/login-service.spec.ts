import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { User } from '../model/User';

describe('LoginService', () => {
  const baseUrl = 'http://localhost:8081/api/'
  let service: LoginService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    login: 'user@test.com',
    password: 'motdepasse123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('register()', () => {
    it('doit faire un POST /api/register', () => {
      service.register(mockUser).subscribe();

      const req = httpMock.expectOne(`${baseUrl}register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush({});
    });
  });

  describe('login()', () => {
    it('doit faire un POST /api/login et retourner un texte (JWT)', () => {
      service.login(mockUser).subscribe((res) => {
        expect(res).toBe('mon.jwt.token');
      });

      const req = httpMock.expectOne(`${baseUrl}login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockUser);
      req.flush('mon.jwt.token');
    });
  });

  describe('isAuthTokenCorrect()', () => {
    it('doit faire un GET /api/auth/:token', () => {
      service.isAuthTokenCorrect('mon.jwt.token').subscribe();

      const req = httpMock.expectOne(`${baseUrl}auth/mon.jwt.token`);
      expect(req.request.method).toBe('GET');
      req.flush({ valid: true });
    });
  });
});