import { describe, it, expect } from 'vitest';
import { superheroSchema } from './index';

describe('superheroSchema', () => {
  const validSuperheroData = {
    nickname: 'Superman',
    real_name: 'Clark Kent',
    origin_description:
      "He was born Kal-El on the planet Krypton, before being rocketed to Earth as an infant by his scientist father Jor-El, moments before Krypton's destruction.",
    superpowers:
      'Solar energy absorption, flight, heat vision, freeze breath, super strength, super speed, invulnerability',
    catch_phrase: "Look, up in the sky, it's a bird, it's a plane, it's Superman!",
  };

  describe('valid data', () => {
    it('should validate correct superhero data', async () => {
      await expect(superheroSchema.validate(validSuperheroData)).resolves.toEqual(
        validSuperheroData,
      );
    });

    it('should validate when all fields are present and non-empty', async () => {
      const data = {
        nickname: 'Batman',
        real_name: 'Bruce Wayne',
        origin_description: 'Witnessed his parents murder as a child.',
        superpowers: 'Martial arts, detective skills, advanced technology',
        catch_phrase: 'I am Batman',
      };

      await expect(superheroSchema.validate(data)).resolves.toEqual(data);
    });

    it('should validate with minimal valid strings', async () => {
      const data = {
        nickname: 'A',
        real_name: 'B',
        origin_description: 'C',
        superpowers: 'D',
        catch_phrase: 'E',
      };

      await expect(superheroSchema.validate(data)).resolves.toEqual(data);
    });
  });

  describe('nickname field', () => {
    it('should require nickname field', async () => {
      const dataWithoutNickname = {
        ...validSuperheroData,
      };
      delete dataWithoutNickname.nickname;

      await expect(superheroSchema.validate(dataWithoutNickname)).rejects.toThrow(
        'Nickname is required',
      );
    });

    it('should reject empty nickname', async () => {
      const dataWithEmptyNickname = {
        ...validSuperheroData,
        nickname: '',
      };

      await expect(superheroSchema.validate(dataWithEmptyNickname)).rejects.toThrow(
        'Nickname is required',
      );
    });

    it('should reject null nickname', async () => {
      const dataWithNullNickname = {
        ...validSuperheroData,
        nickname: null,
      };

      await expect(superheroSchema.validate(dataWithNullNickname)).rejects.toThrow(
        'Nickname is required',
      );
    });

    it('should reject undefined nickname', async () => {
      const dataWithUndefinedNickname = {
        ...validSuperheroData,
        nickname: undefined,
      };

      await expect(superheroSchema.validate(dataWithUndefinedNickname)).rejects.toThrow(
        'Nickname is required',
      );
    });
  });

  describe('real_name field', () => {
    it('should require real_name field', async () => {
      const dataWithoutRealName = {
        ...validSuperheroData,
      };
      delete dataWithoutRealName.real_name;

      await expect(superheroSchema.validate(dataWithoutRealName)).rejects.toThrow(
        'Real name is required',
      );
    });

    it('should reject empty real_name', async () => {
      const dataWithEmptyRealName = {
        ...validSuperheroData,
        real_name: '',
      };

      await expect(superheroSchema.validate(dataWithEmptyRealName)).rejects.toThrow(
        'Real name is required',
      );
    });

    it('should reject null real_name', async () => {
      const dataWithNullRealName = {
        ...validSuperheroData,
        real_name: null,
      };

      await expect(superheroSchema.validate(dataWithNullRealName)).rejects.toThrow(
        'Real name is required',
      );
    });
  });

  describe('origin_description field', () => {
    it('should require origin_description field', async () => {
      const dataWithoutOriginDescription = {
        ...validSuperheroData,
      };
      delete dataWithoutOriginDescription.origin_description;

      await expect(superheroSchema.validate(dataWithoutOriginDescription)).rejects.toThrow(
        'Origin description is required',
      );
    });

    it('should reject empty origin_description', async () => {
      const dataWithEmptyOriginDescription = {
        ...validSuperheroData,
        origin_description: '',
      };

      await expect(superheroSchema.validate(dataWithEmptyOriginDescription)).rejects.toThrow(
        'Origin description is required',
      );
    });

    it('should reject null origin_description', async () => {
      const dataWithNullOriginDescription = {
        ...validSuperheroData,
        origin_description: null,
      };

      await expect(superheroSchema.validate(dataWithNullOriginDescription)).rejects.toThrow(
        'Origin description is required',
      );
    });
  });

  describe('superpowers field', () => {
    it('should require superpowers field', async () => {
      const dataWithoutSuperpowers = {
        ...validSuperheroData,
      };
      delete dataWithoutSuperpowers.superpowers;

      await expect(superheroSchema.validate(dataWithoutSuperpowers)).rejects.toThrow(
        'Superpowers are required',
      );
    });

    it('should reject empty superpowers', async () => {
      const dataWithEmptySuperpowers = {
        ...validSuperheroData,
        superpowers: '',
      };

      await expect(superheroSchema.validate(dataWithEmptySuperpowers)).rejects.toThrow(
        'Superpowers are required',
      );
    });

    it('should reject null superpowers', async () => {
      const dataWithNullSuperpowers = {
        ...validSuperheroData,
        superpowers: null,
      };

      await expect(superheroSchema.validate(dataWithNullSuperpowers)).rejects.toThrow(
        'Superpowers are required',
      );
    });
  });

  describe('catch_phrase field', () => {
    it('should require catch_phrase field', async () => {
      const dataWithoutCatchPhrase = {
        ...validSuperheroData,
      };
      delete dataWithoutCatchPhrase.catch_phrase;

      await expect(superheroSchema.validate(dataWithoutCatchPhrase)).rejects.toThrow(
        'Catch phrase is required',
      );
    });

    it('should reject empty catch_phrase', async () => {
      const dataWithEmptyCatchPhrase = {
        ...validSuperheroData,
        catch_phrase: '',
      };

      await expect(superheroSchema.validate(dataWithEmptyCatchPhrase)).rejects.toThrow(
        'Catch phrase is required',
      );
    });

    it('should reject null catch_phrase', async () => {
      const dataWithNullCatchPhrase = {
        ...validSuperheroData,
        catch_phrase: null,
      };

      await expect(superheroSchema.validate(dataWithNullCatchPhrase)).rejects.toThrow(
        'Catch phrase is required',
      );
    });
  });

  describe('multiple validation errors', () => {
    it('should validate and fail on first error when multiple fields are invalid', async () => {
      const invalidData = {
        nickname: '',
        real_name: '',
        origin_description: '',
        superpowers: '',
        catch_phrase: '',
      };

      await expect(superheroSchema.validate(invalidData)).rejects.toThrow();

      await expect(superheroSchema.validate({})).rejects.toThrow();
    });
  });

  describe('schema type validation', () => {
    it('should enforce string type for all fields', async () => {
      const dataWithNonStringTypes = {
        nickname: 123,
        real_name: true,
        origin_description: ['array'],
        superpowers: { object: true },
        catch_phrase: new Date(),
      };

      await expect(superheroSchema.validate(dataWithNonStringTypes)).rejects.toThrow();
    });
  });

  describe('schema shape validation', () => {
    it('should validate schema shape', () => {
      expect(superheroSchema.fields).toBeDefined();
      expect(superheroSchema.fields.nickname).toBeDefined();
      expect(superheroSchema.fields.real_name).toBeDefined();
      expect(superheroSchema.fields.origin_description).toBeDefined();
      expect(superheroSchema.fields.superpowers).toBeDefined();
      expect(superheroSchema.fields.catch_phrase).toBeDefined();
    });

    it('should have all required fields in schema', () => {
      const expectedFields = [
        'nickname',
        'real_name',
        'origin_description',
        'superpowers',
        'catch_phrase',
      ];
      const schemaFields = Object.keys(superheroSchema.fields);

      expectedFields.forEach((field) => {
        expect(schemaFields).toContain(field);
      });
    });
  });

  describe('validateSync method', () => {
    it('should work with validateSync for valid data', () => {
      expect(() => superheroSchema.validateSync(validSuperheroData)).not.toThrow();

      const result = superheroSchema.validateSync(validSuperheroData);
      expect(result).toEqual(validSuperheroData);
    });

    it('should throw error with validateSync for invalid data', () => {
      const invalidData = {
        ...validSuperheroData,
        nickname: '',
      };

      expect(() => superheroSchema.validateSync(invalidData)).toThrow('Nickname is required');
    });
  });

  describe('isValid method', () => {
    it('should return true for valid data', () => {
      const isValid = superheroSchema.isValidSync(validSuperheroData);
      expect(isValid).toBe(true);
    });

    it('should return false for invalid data', () => {
      const invalidData = {
        ...validSuperheroData,
        nickname: '',
      };

      const isValid = superheroSchema.isValidSync(invalidData);
      expect(isValid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle very long strings', async () => {
      const longString = 'a'.repeat(10000);
      const dataWithLongStrings = {
        nickname: longString,
        real_name: longString,
        origin_description: longString,
        superpowers: longString,
        catch_phrase: longString,
      };

      await expect(superheroSchema.validate(dataWithLongStrings)).resolves.toEqual(
        dataWithLongStrings,
      );
    });

    it('should handle special characters', async () => {
      const dataWithSpecialChars = {
        nickname: 'Spéciał-Hérø 123 !@#$%^&*()',
        real_name: 'Réal Ñame with ünïcødè',
        origin_description: 'Origin with émojis 🦸‍♂️ and symbols ±≤≥',
        superpowers: 'Powers with números 123 and símbolos ∞',
        catch_phrase: 'Phrase with "quotes" and \'apostrophes\'',
      };

      await expect(superheroSchema.validate(dataWithSpecialChars)).resolves.toEqual(
        dataWithSpecialChars,
      );
    });

    it('should handle newlines and whitespace in strings', async () => {
      const dataWithWhitespace = {
        nickname: '  Superman  ',
        real_name: 'Clark\nKent',
        origin_description: 'Born on\tKrypton.\r\nCame to Earth.',
        superpowers: '  Flight,\n  Heat Vision  ',
        catch_phrase: '  Up, up and away!  ',
      };

      const expectedResult = {
        nickname: 'Superman',
        real_name: 'Clark\nKent',
        origin_description: 'Born on\tKrypton.\r\nCame to Earth.',
        superpowers: 'Flight,\n  Heat Vision',
        catch_phrase: 'Up, up and away!',
      };

      await expect(superheroSchema.validate(dataWithWhitespace)).resolves.toEqual(expectedResult);
    });
  });
});
