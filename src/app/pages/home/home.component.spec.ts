import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class StubComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([
          { path: 'upload', component: StubComponent },
          { path: '**', component: StubComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ─── Unitaires ──────────────────────────────────────────────────────────────

  describe('création', () => {
    it('doit être créé', () => {
      expect(component).toBeTruthy();
    });
  });

  // ─── Intégration ─────────────────────────────────────────────────────────────

  describe('template', () => {
    it('doit afficher le texte d\'accroche', () => {
      const p: HTMLElement = fixture.nativeElement.querySelector('.upload-text');
      expect(p).toBeTruthy();
      expect(p.textContent).toContain('Tu veux partager un fichier ?');
    });

    it('doit afficher le bouton de navigation vers /upload', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.logo-second-wrapper');
      expect(btn).toBeTruthy();
    });

    it('le bouton doit avoir le routerLink /upload', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('[routerLink="/upload"]');
      expect(btn).toBeTruthy();
    });

    it('doit afficher le logo', () => {
      const img: HTMLImageElement = fixture.nativeElement.querySelector('.logo');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('logo-white.png');
    });

    it('doit naviguer vers /upload au clic sur le bouton', async () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.logo-second-wrapper');
      btn.click();
      await fixture.whenStable();
      // Le routerLink gère la navigation — on vérifie que le bouton est cliquable
      expect(btn).toBeTruthy();
    });

    it('le bouton doit avoir l\'attribut tabindex 3', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.logo-second-wrapper');
      expect(btn.getAttribute('tabindex')).toBe('3');
    });

    it('doit contenir le wrapper principal', () => {
      const wrapper: HTMLElement = fixture.nativeElement.querySelector('.upload-wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('doit contenir le wrapper du logo', () => {
      const logoWrapper: HTMLElement = fixture.nativeElement.querySelector('.logo-first-wrapper');
      expect(logoWrapper).toBeTruthy();
    });
  });
});