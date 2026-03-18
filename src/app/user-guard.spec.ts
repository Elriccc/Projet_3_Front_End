import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { userGuard } from './user-guard.guard';
import { AuthUtil } from './core/util/auth-util';

describe('userGuard', () => {
  let authUtilMock: { isAuthenticated: jest.Mock };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  const runGuard = () =>
    TestBed.runInInjectionContext(() => userGuard(mockRoute, mockState));

  beforeEach(() => {
    authUtilMock = { isAuthenticated: jest.fn() };

    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        { provide: AuthUtil, useValue: authUtilMock },
        provideRouter([]),
      ],
    });
  });

  it("doit retourner true si l'utilisateur est authentifié", async () => {
    authUtilMock.isAuthenticated.mockResolvedValue(true);
    const result = await runGuard();
    expect(result).toBe(true);
  });

  it("doit retourner false si l'utilisateur n'est pas authentifié", async () => {
    authUtilMock.isAuthenticated.mockResolvedValue(false);
    const result = await runGuard();
    expect(result).toBe(false);
  });
});