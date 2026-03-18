import { buildExpirationMessage, buildFileSizeLabel } from './file-util';

describe('buildExpirationMessage', () => {
  describe('valeurs nommées (1 à 7)', () => {
    it('doit retourner "un jours" pour 1', () => {
      expect(buildExpirationMessage(1)).toBe('un jours');
    });

    it('doit retourner "deux jours" pour 2', () => {
      expect(buildExpirationMessage(2)).toBe('deux jours');
    });

    it('doit retourner "trois jours" pour 3', () => {
      expect(buildExpirationMessage(3)).toBe('trois jours');
    });

    it('doit retourner "quatre jours" pour 4', () => {
      expect(buildExpirationMessage(4)).toBe('quatre jours');
    });

    it('doit retourner "cinq jours" pour 5', () => {
      expect(buildExpirationMessage(5)).toBe('cinq jours');
    });

    it('doit retourner "six jours" pour 6', () => {
      expect(buildExpirationMessage(6)).toBe('six jours');
    });

    it('doit retourner "une semaine" pour 7', () => {
      expect(buildExpirationMessage(7)).toBe('une semaine');
    });
  });

  describe('valeurs hors plage', () => {
    it('doit retourner une chaîne vide pour 0', () => {
      expect(buildExpirationMessage(0)).toBe('');
    });

    it('doit retourner une chaîne vide pour une valeur > 7', () => {
      expect(buildExpirationMessage(8)).toBe('');
    });

    it('doit retourner une chaîne vide pour une valeur négative', () => {
      expect(buildExpirationMessage(-1)).toBe('');
    });
  });

  describe('avec prefix et suffix', () => {
    it('doit ajouter le prefix et le suffix', () => {
      expect(buildExpirationMessage(3, 'Dans ', ' !')).toBe('Dans trois jours !');
    });

    it('doit fonctionner avec uniquement un prefix', () => {
      expect(buildExpirationMessage(7, 'Expire dans ')).toBe('Expire dans une semaine');
    });

    it('doit fonctionner avec uniquement un suffix', () => {
      expect(buildExpirationMessage(1, undefined, '.')).toBe('un jours.');
    });

    it('doit gérer une valeur hors plage avec prefix et suffix', () => {
      expect(buildExpirationMessage(0, 'Dans ', ' !')).toBe('Dans  !');
    });
  });
});

describe('buildFileSizeLabel', () => {
  describe('octets (< 1000)', () => {
    it('doit afficher en octets pour 0', () => {
      expect(buildFileSizeLabel(0)).toBe('0 o');
    });

    it('doit afficher en octets pour 999', () => {
      expect(buildFileSizeLabel(999)).toBe('999 o');
    });

    it('doit afficher en octets pour 1', () => {
      expect(buildFileSizeLabel(1)).toBe('1 o');
    });
  });

  describe('kilooctets (1000 à 999 999)', () => {
    it('doit afficher en Ko pour exactement 1000', () => {
      expect(buildFileSizeLabel(1000)).toBe('1.00 Ko');
    });

    it('doit afficher en Ko avec 2 décimales', () => {
      expect(buildFileSizeLabel(1500)).toBe('1.50 Ko');
    });

    it('doit afficher en Ko pour 999 999', () => {
      expect(buildFileSizeLabel(999999)).toBe('1000.00 Ko');
    });
  });

  describe('mégaoctets (1 000 000 à 999 999 999)', () => {
    it('doit afficher en Mo pour exactement 1 000 000', () => {
      expect(buildFileSizeLabel(1_000_000)).toBe('1.00 Mo');
    });

    it('doit afficher en Mo avec 2 décimales', () => {
      expect(buildFileSizeLabel(2_500_000)).toBe('2.50 Mo');
    });
  });

  describe('gigaoctets (≥ 1 000 000 000)', () => {
    it('doit afficher en Go pour exactement 1 Go', () => {
      expect(buildFileSizeLabel(1_000_000_000)).toBe('1.00 Go');
    });

    it('doit afficher en Go avec 2 décimales', () => {
      expect(buildFileSizeLabel(1_500_000_000)).toBe('1.50 Go');
    });
  });
});