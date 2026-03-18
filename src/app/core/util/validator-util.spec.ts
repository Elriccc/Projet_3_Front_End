import { FormControl } from '@angular/forms';
import { passwordExistAndIsTooShort } from './validator-util';

describe('passwordExistAndIsTooShort', () => {
  const validator = passwordExistAndIsTooShort();

  describe('mot de passe vide (optionnel)', () => {
    it('doit retourner null pour une chaîne vide', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });
  });

  describe('mot de passe trop court', () => {
    it('doit retourner une erreur pour 1 caractère', () => {
      const control = new FormControl('a');
      expect(validator(control)).toEqual({ passwordExistAndIsTooShort: true });
    });

    it('doit retourner une erreur pour 5 caractères', () => {
      const control = new FormControl('abcde');
      expect(validator(control)).toEqual({ passwordExistAndIsTooShort: true });
    });
  });

  describe('mot de passe valide', () => {
    it('doit retourner null pour exactement 6 caractères', () => {
      const control = new FormControl('abcdef');
      expect(validator(control)).toBeNull();
    });

    it('doit retourner null pour un mot de passe long', () => {
      const control = new FormControl('motDePasseTresLong123!');
      expect(validator(control)).toBeNull();
    });
  });
});