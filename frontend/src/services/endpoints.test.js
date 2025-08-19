import { describe, it, expect } from 'vitest';
import { apiEndpoints } from './endpoints';

describe('apiEndpoints', () => {
  describe('getAllHeroes', () => {
    it('should generate correct endpoint with page and limit parameters', () => {
      const endpoint = apiEndpoints.getAllHeroes(1, 5);
      expect(endpoint).toBe('/superheroes?page=1&limit=5');
    });

    it('should handle different page and limit values', () => {
      expect(apiEndpoints.getAllHeroes(2, 10)).toBe('/superheroes?page=2&limit=10');
      expect(apiEndpoints.getAllHeroes(1, 1)).toBe('/superheroes?page=1&limit=1');
      expect(apiEndpoints.getAllHeroes(100, 50)).toBe('/superheroes?page=100&limit=50');
    });

    it('should handle zero values', () => {
      expect(apiEndpoints.getAllHeroes(0, 0)).toBe('/superheroes?page=0&limit=0');
    });

    it('should handle negative values', () => {
      expect(apiEndpoints.getAllHeroes(-1, -5)).toBe('/superheroes?page=-1&limit=-5');
    });

    it('should handle string parameters (edge case)', () => {
      expect(apiEndpoints.getAllHeroes('1', '5')).toBe('/superheroes?page=1&limit=5');
      expect(apiEndpoints.getAllHeroes('abc', 'def')).toBe('/superheroes?page=abc&limit=def');
    });

    it('should handle null and undefined parameters', () => {
      expect(apiEndpoints.getAllHeroes(null, null)).toBe('/superheroes?page=null&limit=null');
      expect(apiEndpoints.getAllHeroes(undefined, undefined)).toBe(
        '/superheroes?page=undefined&limit=undefined',
      );
    });

    it('should handle large numbers', () => {
      expect(apiEndpoints.getAllHeroes(999999, 100000)).toBe(
        '/superheroes?page=999999&limit=100000',
      );
    });

    it('should handle decimal numbers', () => {
      expect(apiEndpoints.getAllHeroes(1.5, 5.7)).toBe('/superheroes?page=1.5&limit=5.7');
    });
  });

  describe('getHeroById', () => {
    it('should generate correct endpoint with hero ID', () => {
      const endpoint = apiEndpoints.getHeroById('hero-123');
      expect(endpoint).toBe('/superheroes/hero-123');
    });

    it('should handle different ID formats', () => {
      expect(apiEndpoints.getHeroById('1')).toBe('/superheroes/1');
      expect(apiEndpoints.getHeroById('abc-def-123')).toBe('/superheroes/abc-def-123');
      expect(apiEndpoints.getHeroById('uuid-style-id')).toBe('/superheroes/uuid-style-id');
    });

    it('should handle numeric IDs', () => {
      expect(apiEndpoints.getHeroById(123)).toBe('/superheroes/123');
      expect(apiEndpoints.getHeroById(0)).toBe('/superheroes/0');
    });

    it('should handle special characters in ID', () => {
      expect(apiEndpoints.getHeroById('hero@123')).toBe('/superheroes/hero@123');
      expect(apiEndpoints.getHeroById('hero%20name')).toBe('/superheroes/hero%20name');
    });

    it('should handle empty string ID', () => {
      expect(apiEndpoints.getHeroById('')).toBe('/superheroes/');
    });

    it('should handle null and undefined ID', () => {
      expect(apiEndpoints.getHeroById(null)).toBe('/superheroes/null');
      expect(apiEndpoints.getHeroById(undefined)).toBe('/superheroes/undefined');
    });
  });

  describe('createHero', () => {
    it('should return correct static endpoint', () => {
      expect(apiEndpoints.createHero).toBe('/superheroes');
    });

    it('should be a string property, not a function', () => {
      expect(typeof apiEndpoints.createHero).toBe('string');
    });
  });

  describe('updateHero', () => {
    it('should generate correct endpoint with hero ID', () => {
      const endpoint = apiEndpoints.updateHero('hero-123');
      expect(endpoint).toBe('/superheroes/hero-123');
    });

    it('should handle different ID formats', () => {
      expect(apiEndpoints.updateHero('1')).toBe('/superheroes/1');
      expect(apiEndpoints.updateHero('abc-def-123')).toBe('/superheroes/abc-def-123');
    });

    it('should handle numeric IDs', () => {
      expect(apiEndpoints.updateHero(456)).toBe('/superheroes/456');
    });

    it('should handle special characters in ID', () => {
      expect(apiEndpoints.updateHero('hero@456')).toBe('/superheroes/hero@456');
    });

    it('should handle edge cases', () => {
      expect(apiEndpoints.updateHero('')).toBe('/superheroes/');
      expect(apiEndpoints.updateHero(null)).toBe('/superheroes/null');
      expect(apiEndpoints.updateHero(undefined)).toBe('/superheroes/undefined');
    });
  });

  describe('deleteHero', () => {
    it('should generate correct endpoint with hero ID', () => {
      const endpoint = apiEndpoints.deleteHero('hero-123');
      expect(endpoint).toBe('/superheroes/hero-123');
    });

    it('should handle different ID formats', () => {
      expect(apiEndpoints.deleteHero('1')).toBe('/superheroes/1');
      expect(apiEndpoints.deleteHero('abc-def-123')).toBe('/superheroes/abc-def-123');
    });

    it('should handle numeric IDs', () => {
      expect(apiEndpoints.deleteHero(789)).toBe('/superheroes/789');
    });

    it('should handle special characters in ID', () => {
      expect(apiEndpoints.deleteHero('hero@789')).toBe('/superheroes/hero@789');
    });

    it('should handle edge cases', () => {
      expect(apiEndpoints.deleteHero('')).toBe('/superheroes/');
      expect(apiEndpoints.deleteHero(null)).toBe('/superheroes/null');
      expect(apiEndpoints.deleteHero(undefined)).toBe('/superheroes/undefined');
    });
  });

  describe('addImage', () => {
    it('should generate correct endpoint with hero ID', () => {
      const endpoint = apiEndpoints.addImage('hero-123');
      expect(endpoint).toBe('/superheroes/hero-123/images');
    });

    it('should handle different ID formats', () => {
      expect(apiEndpoints.addImage('1')).toBe('/superheroes/1/images');
      expect(apiEndpoints.addImage('abc-def-123')).toBe('/superheroes/abc-def-123/images');
    });

    it('should handle numeric IDs', () => {
      expect(apiEndpoints.addImage(101)).toBe('/superheroes/101/images');
    });

    it('should handle special characters in ID', () => {
      expect(apiEndpoints.addImage('hero@101')).toBe('/superheroes/hero@101/images');
    });

    it('should handle edge cases', () => {
      expect(apiEndpoints.addImage('')).toBe('/superheroes//images');
      expect(apiEndpoints.addImage(null)).toBe('/superheroes/null/images');
      expect(apiEndpoints.addImage(undefined)).toBe('/superheroes/undefined/images');
    });
  });

  describe('removeImage', () => {
    it('should generate correct endpoint with hero ID and image name', () => {
      const endpoint = apiEndpoints.removeImage('hero-123', 'image.jpg');
      expect(endpoint).toBe('/superheroes/hero-123/images/image.jpg');
    });

    it('should handle different ID and image name formats', () => {
      expect(apiEndpoints.removeImage('1', 'photo.png')).toBe('/superheroes/1/images/photo.png');
      expect(apiEndpoints.removeImage('abc-def-123', 'avatar.gif')).toBe(
        '/superheroes/abc-def-123/images/avatar.gif',
      );
    });

    it('should handle numeric parameters', () => {
      expect(apiEndpoints.removeImage(202, 'image.jpg')).toBe('/superheroes/202/images/image.jpg');
      expect(apiEndpoints.removeImage('hero-123', 123)).toBe('/superheroes/hero-123/images/123');
    });

    it('should handle special characters', () => {
      expect(apiEndpoints.removeImage('hero@202', 'image@special.jpg')).toBe(
        '/superheroes/hero@202/images/image@special.jpg',
      );
      expect(apiEndpoints.removeImage('hero-123', 'image%20name.jpg')).toBe(
        '/superheroes/hero-123/images/image%20name.jpg',
      );
    });

    it('should handle image names with paths', () => {
      expect(apiEndpoints.removeImage('hero-123', 'subfolder/image.jpg')).toBe(
        '/superheroes/hero-123/images/subfolder/image.jpg',
      );
      expect(apiEndpoints.removeImage('hero-123', '../image.jpg')).toBe(
        '/superheroes/hero-123/images/../image.jpg',
      );
    });

    it('should handle edge cases', () => {
      expect(apiEndpoints.removeImage('', '')).toBe('/superheroes//images/');
      expect(apiEndpoints.removeImage(null, null)).toBe('/superheroes/null/images/null');
      expect(apiEndpoints.removeImage(undefined, undefined)).toBe(
        '/superheroes/undefined/images/undefined',
      );
    });

    it('should handle mixed edge cases', () => {
      expect(apiEndpoints.removeImage('hero-123', '')).toBe('/superheroes/hero-123/images/');
      expect(apiEndpoints.removeImage('', 'image.jpg')).toBe('/superheroes//images/image.jpg');
      expect(apiEndpoints.removeImage('hero-123', null)).toBe('/superheroes/hero-123/images/null');
      expect(apiEndpoints.removeImage(null, 'image.jpg')).toBe(
        '/superheroes/null/images/image.jpg',
      );
    });
  });

  describe('healthCheck', () => {
    it('should return correct static endpoint', () => {
      expect(apiEndpoints.healthCheck).toBe('/health');
    });

    it('should be a string property, not a function', () => {
      expect(typeof apiEndpoints.healthCheck).toBe('string');
    });
  });

  describe('endpoint object structure', () => {
    it('should have all expected properties', () => {
      const expectedProperties = [
        'getAllHeroes',
        'getHeroById',
        'createHero',
        'updateHero',
        'deleteHero',
        'addImage',
        'removeImage',
        'healthCheck',
      ];

      expectedProperties.forEach((prop) => {
        expect(apiEndpoints).toHaveProperty(prop);
      });
    });

    it('should have correct property types', () => {
      expect(typeof apiEndpoints.getAllHeroes).toBe('function');
      expect(typeof apiEndpoints.getHeroById).toBe('function');
      expect(typeof apiEndpoints.createHero).toBe('string');
      expect(typeof apiEndpoints.updateHero).toBe('function');
      expect(typeof apiEndpoints.deleteHero).toBe('function');
      expect(typeof apiEndpoints.addImage).toBe('function');
      expect(typeof apiEndpoints.removeImage).toBe('function');
      expect(typeof apiEndpoints.healthCheck).toBe('string');
    });

    it('should not have unexpected properties', () => {
      const actualProperties = Object.keys(apiEndpoints);
      const expectedProperties = [
        'getAllHeroes',
        'getHeroById',
        'createHero',
        'updateHero',
        'deleteHero',
        'addImage',
        'removeImage',
        'healthCheck',
      ];

      expect(actualProperties.sort()).toEqual(expectedProperties.sort());
    });
  });

  describe('consistency tests', () => {
    it('should use consistent base path for superhero endpoints', () => {
      const basePattern = /^\/superheroes/;

      expect(apiEndpoints.getAllHeroes(1, 5)).toMatch(basePattern);
      expect(apiEndpoints.getHeroById('123')).toMatch(basePattern);
      expect(apiEndpoints.createHero).toMatch(basePattern);
      expect(apiEndpoints.updateHero('123')).toMatch(basePattern);
      expect(apiEndpoints.deleteHero('123')).toMatch(basePattern);
      expect(apiEndpoints.addImage('123')).toMatch(basePattern);
      expect(apiEndpoints.removeImage('123', 'image.jpg')).toMatch(basePattern);
    });

    it('should not have trailing slashes on static endpoints', () => {
      expect(apiEndpoints.createHero).not.toMatch(/\/$/);
      expect(apiEndpoints.healthCheck).not.toMatch(/\/$/);
    });

    it('should generate consistent URL formats', () => {
      // Test that similar operations follow consistent patterns
      expect(apiEndpoints.getHeroById('123')).toBe('/superheroes/123');
      expect(apiEndpoints.updateHero('123')).toBe('/superheroes/123');
      expect(apiEndpoints.deleteHero('123')).toBe('/superheroes/123');

      // These should all be the same since they operate on the same resource
      expect(apiEndpoints.getHeroById('123')).toBe(apiEndpoints.updateHero('123'));
      expect(apiEndpoints.updateHero('123')).toBe(apiEndpoints.deleteHero('123'));
    });
  });

  describe('URL encoding considerations', () => {
    it('should handle characters that need URL encoding', () => {
      const specialChars = 'hero with spaces';

      expect(apiEndpoints.getHeroById(specialChars)).toBe('/superheroes/hero with spaces');
      expect(apiEndpoints.updateHero(specialChars)).toBe('/superheroes/hero with spaces');
      expect(apiEndpoints.deleteHero(specialChars)).toBe('/superheroes/hero with spaces');
      expect(apiEndpoints.addImage(specialChars)).toBe('/superheroes/hero with spaces/images');
      expect(apiEndpoints.removeImage(specialChars, 'image name.jpg')).toBe(
        '/superheroes/hero with spaces/images/image name.jpg',
      );
    });

    it('should handle characters in image names', () => {
      const specialImageName = 'my image file.jpg';

      expect(apiEndpoints.removeImage('hero-123', specialImageName)).toBe(
        '/superheroes/hero-123/images/my image file.jpg',
      );
    });
  });
});
