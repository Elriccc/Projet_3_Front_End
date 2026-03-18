import { TestBed } from '@angular/core/testing';
import { UserService } from './app/user-service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('doit être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('État initial', () => {
    it('Connected doit être false par défaut', () => {
      expect(service.Connected()).toBe(false);
    });
  });

  describe('Fonction connect()', () => {
    it('doit passer Connected à true', () => {
      service.connect();
      expect(service.Connected()).toBe(true);
    });

    it('doit rester true si appelé plusieurs fois', () => {
      service.connect();
      service.connect();
      expect(service.Connected()).toBe(true);
    });
  });

  describe('Fonction disconnect()', () => {
    it('doit passer Connected à false', () => {
      service.connect();
      service.disconnect();
      expect(service.Connected()).toBe(false);
    });

    it('doit rester false si appelé plusieurs fois', () => {
      service.disconnect();
      service.disconnect();
      expect(service.Connected()).toBe(false);
    });
  });

  describe('Cycle connect / disconnect', () => {
    it('doit alterner correctement', () => {
      service.connect();
      expect(service.Connected()).toBe(true);
      service.disconnect();
      expect(service.Connected()).toBe(false);
      service.connect();
      expect(service.Connected()).toBe(true);
    });
  });
});